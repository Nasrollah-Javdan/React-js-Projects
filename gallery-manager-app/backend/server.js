const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gallery",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.basename(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("fileToUpload"), (req, res) => {
  const { userId, userName, userNumber, photographerName, description } =
    req.body;
  const imagePath = req.file.path.replace(/\\/g, "/");

  const sql =
    "INSERT INTO images (imagePath, userId, userName, userNumber, photographerName, description) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [imagePath, userId, userName, userNumber, photographerName, description],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ message: "Image uploaded and saved to database" });
    }
  );
});

app.get("/users", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/images", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM images";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    results = results.map((result) => {
      result.imagePath = result.imagePath.replace(/\\/g, "/");
      return result;
    });
    res.json(results);
  });
});

app.get("/search-users", authenticateToken, (req, res) => {
  const searchQuery = req.query.q;
  const sql = "SELECT * FROM users WHERE userId LIKE ? OR userName LIKE ?";
  db.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/users/:userId", authenticateToken, (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE userId = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result[0]);
  });
});

app.get("/lastUserId", authenticateToken, (req, res) => {
  const sql =
    "SELECT * FROM users WHERE userId = (SELECT MAX(userId) FROM users)";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.get("/lastImageId", authenticateToken, (req, res) => {
  const sql = "SELECT MAX(imageId) AS lastImageId FROM images";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    const lastImageId = result[0].lastImageId || 0;
    res.json({ lastImageId });
  });
});

app.get("/search-images", authenticateToken, (req, res) => {
  const searchQuery = req.query.q;
  const sql =
    "SELECT * FROM images WHERE imageId LIKE ? OR userId LIKE ? OR userName LIKE ?";
  db.query(
    sql,
    [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    }
  );
});

app.get("/user-images", authenticateToken, (req, res) => {
  const { userName } = req.query;
  const sql = "SELECT * FROM images WHERE userName = ?";
  db.query(sql, [userName], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Endpoint to delete an image
app.delete("/images/:imageId", (req, res) => {
  const imageId = req.params.imageId;

  // Get the image path from the database
  const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
  db.query(selectSql, [imageId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = results[0].imagePath;

    // Delete the image record from the database
    const deleteSql = "DELETE FROM images WHERE imageId = ?";
    db.query(deleteSql, [imageId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Delete the image file from the uploads directory
      fs.unlink(imagePath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

app.put("/images/:imageId", upload.single("photo"), (req, res) => {
  const { imageId } = req.params;
  const { userId, userName, userNumber, photographerName, description } =
    req.body;
  let imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  // اگر تصویری جدید آپلود نشده باشد، از مسیر تصویر قبلی استفاده می‌کنیم
  const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
  db.query(selectSql, [imageId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (!imagePath) {
      imagePath = results[0].imagePath;
    }

    const updateSql =
      "UPDATE images SET imagePath = ?, userId = ?, userName = ?, userNumber = ?, photographerName = ?, description = ? WHERE imageId = ?";
    db.query(
      updateSql,
      [
        imagePath,
        userId,
        userName,
        userNumber,
        photographerName,
        description,
        imageId,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ message: "Image details updated successfully" });
      }
    );
  });
});

app.delete("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "DELETE FROM users WHERE userId = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: `User with ID ${userId} deleted` });
  });
});

app.post("/users", async (req, res) => {
  const { userName, userNumber, userPassword } = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 10); // هش کردن رمز عبور
  const sql =
    "INSERT INTO users (userName, userNumber, userPassword) VALUES (?, ?, ?)";
  db.query(sql, [userName, userNumber, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "User added successfully", userId: result.insertId });
  });
});

app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { userName, userNumber, userPassword } = req.body;
  const hashedPassword = await bcrypt.hash(userPassword, 10); // هش کردن رمز عبور
  const sql =
    "UPDATE users SET userName = ?, userNumber = ?, userPassword = ? WHERE userId = ?";
  db.query(
    sql,
    [userName, userNumber, hashedPassword, userId],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

app.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const sql = "SELECT * FROM users WHERE userId = ?";
  db.query(sql, [userId], async (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.userPassword);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.userId, role: user.isAdmin ? "admin" : "user" },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );
        res.json({
          authenticated: true,
          token,
          userName: user.userName,
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(401).json({ authenticated: false });
      }
    } else {
      res.status(401).json({ authenticated: false });
    }
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
