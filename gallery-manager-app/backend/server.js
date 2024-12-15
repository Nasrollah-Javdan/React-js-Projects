const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "دسترسی امکان پذیر نیست" });

  try {
    const verified = jwt.verify(token, "your_jwt_secret");
    req.user = verified;
    if (req.user.role === "admin") {
      next(); // دسترسی کامل به همه متدها برای admin
    } else if (req.user.role === "user" && (req.path === "/user-images" || req.path === "/forget-password")) {
      next(); // دسترسی محدود به مسیرهای /user-images و /forget-password برای کاربر
    } else {
      res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
    }
  } catch (err) {
    res.status(400).json({ message: "توکن شما معتبر نمی باشد" });
  }
};


const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // آدرس فرانت‌اند شما
  credentials: true // اجازه ارسال کوکی‌ها
}));
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
    console.error("اتصال به پایگاه داده امکان پذیر نیست", err);
    return;
  }
  console.log("اتصال به پایگاه داده برقرار است");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.basename(file.originalname));
  },
});

app.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE userEmail = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res
        .status(200)
        .json({ success: true, message: "رمز جدید برای ایمیل شما ارسال شد" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "ایمیل مورد نظر یافت نشد" });
    }
  });
});

const upload = multer({ storage: storage });

app.post("/upload", authenticateToken, upload.single("fileToUpload"), (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
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
      res.json({
        message: "توصیر با موفقیت بارگزاری شد و در پایگاه داده قرار گرفت",
      });
    }
  );
});

app.get("/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/images", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
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
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
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
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
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

app.delete("/images/:imageId", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const imageId = req.params.imageId;

  const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
  db.query(selectSql, [imageId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = results[0].imagePath;

    const deleteSql = "DELETE FROM images WHERE imageId = ?";
    db.query(deleteSql, [imageId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      fs.unlink(imagePath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

app.put("/images/:imageId", authenticateToken, upload.single("photo"), (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const { imageId } = req.params;
  const { userId, userName, userNumber, photographerName, description } =
    req.body;
  let imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
  db.query(selectSql, [imageId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const oldImagePath = results[0].imagePath;

    if (!imagePath) {
      imagePath = oldImagePath;
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

        if (req.file && oldImagePath !== imagePath) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              return res.status(500).send(err);
            }
          });
        }

        res.json({ message: "Image details updated successfully" });
      }
    );
  });
});

app.delete("/users/:userId", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const userId = req.params.userId;
  const sql = "DELETE FROM users WHERE userId = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: `User with ID ${userId} deleted` });
  });
});

app.post("/users", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const { userId, userName, userNumber, userEmail, userPassword } = req.body; // دریافت userEmail از درخواست
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  const sql =
    "INSERT INTO users (userId, userName, userNumber, userEmail, userPassword) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [userId, userName, userNumber, userEmail || null, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ message: "User added successfully", userId: result.insertId });
    }
  );
});

app.put("/users/:userId", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }
  const userId = req.params.userId;
  const { userName, userNumber, userPassword } = req.body;

  let sql;
  let values;

  if (userPassword) {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    sql =
      "UPDATE users SET userName = ?, userNumber = ?, userPassword = ? WHERE userId = ?";
    values = [userName, userNumber, hashedPassword, userId];
  } else {
    sql = "UPDATE users SET userName = ?, userNumber = ? WHERE userId = ?";
    values = [userName, userNumber, userId];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "User updated successfully" });
  });
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
          {
            id: user.userId,
            role: user.isAdmin ? "admin" : "user",
            userName: user.userName,
          },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true }); // ذخیره توکن به صورت HttpOnly cookie
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
