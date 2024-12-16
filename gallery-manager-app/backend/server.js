const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "دسترسی امکان پذیر نیست" });

  try {
    const verified = jwt.verify(token, "your_jwt_secret");
    req.user = verified;
    if (req.user.role === "admin") {
      next(); // دسترسی کامل به همه متدها برای admin
    } else if (
      req.user.role === "user" &&
      (req.path === "/user-images" || req.path === "/forget-password")
    ) {
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
app.use(
  cors({
    origin: "http://localhost:3000", // آدرس فرانت‌اند شما
    credentials: true, // اجازه ارسال کوکی‌ها
  })
);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set the limit for JSON body parser
// app.use(bodyParser.json({ limit: '50mb' }));
// Set the limit for URL-encoded body parser
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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

app.post(
  "/upload",
  authenticateToken,
  upload.single("fileToUpload"),
  (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
    }

    const { userId, userName, userNumber, photographerName, description } =
      req.body;
    const imagePath = req.file.path.replace(/\\/g, "/");

    // Log incoming data for debugging
    // console.log("Received data on server:");
    // console.log("userId:", userId);
    // console.log("userName:", userName);
    // console.log("userNumber:", userNumber);
    // console.log("photographerName:", photographerName);
    // console.log("description:", description);
    // console.log("imagePath:", imagePath);

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
          message: "تصویر با موفقیت بارگزاری شد و در پایگاه داده قرار گرفت",
        });
      }
    );
  }
);

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

app.put(
  "/images/:imageId",
  authenticateToken,
  upload.single("photo"),
  (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
    }
    const { imageId } = req.params;
    const { userId, userName, userNumber, photographerName, description } =
      req.body;
    let imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Log incoming data for debugging
    // console.log("Received data on server:");
    // console.log("imageId:", imageId);
    // console.log("userId:", userId);
    // console.log("userName:", userName);
    // console.log("userNumber:", userNumber);
    // console.log("photographerName:", photographerName);
    // console.log("description:", description);
    // console.log("imagePath:", imagePath);

    const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
    db.query(selectSql, [imageId], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "تصویر یافت نشد" });
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

          res.json({ message: "اطلاعات تصویر با موفقیت به‌روزرسانی شد" });
        }
      );
    });
  }
);

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

const addUser = multer();

app.post("/users", authenticateToken, addUser.none(), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }

  const { userId, userName, userNumber, userEmail, userPassword } = req.body;

  // Log received data on the server
  console.log("Received data on server:");
  console.log("userId:", userId);
  console.log("userName:", userName);
  console.log("userNumber:", userNumber);
  console.log("userEmail:", userEmail);
  console.log("userPassword:", userPassword);

  const checkSql = "SELECT * FROM users WHERE userName = ? OR userNumber = ?";
  db.query(checkSql, [userName, userNumber], async (checkErr, results) => {
    if (checkErr) {
      return res.status(500).send(checkErr);
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "نام کاربری یا شماره همراه قبلاً ثبت شده است" });
    }

    // const hashedPassword = await bcrypt.hash(userPassword, 10);
    const insertSql = "INSERT INTO users (userId, userName, userNumber, userEmail, userPassword) VALUES (?, ?, ?, ?, ?)";

    db.query(insertSql, [userId, userName, userNumber, userEmail || null, userPassword], (insertErr, result) => {
      if (insertErr) {
        return res.status(500).send(insertErr);
      }

      // Send JSON response
      res.status(200).json({ message: "اطلاعات با موفقیت ثبت شد", userId: result.insertId });
    });
  });
});


const editUser = multer();

app.put("/users/:userId", authenticateToken, editUser.none(), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }

  const userId = req.params.userId;
  const { userName, userNumber, userEmail, userPassword } = req.body;

  // Log received data on the server
  console.log("Received data on server:");
  console.log("userId:", userId);
  console.log("userName:", userName);
  console.log("userNumber:", userNumber);
  console.log("userEmail:", userEmail);
  console.log("userPassword:", userPassword);

  let sql;
  let values;

  if (userPassword) {
    // const hashedPassword = await bcrypt.hash(userPassword, 10);
    sql = "UPDATE users SET userName = ?, userNumber = ?, userEmail = ?, userPassword = ? WHERE userId = ?";
    values = [userName, userNumber, userEmail, userPassword, userId];
  } else {
    sql = "UPDATE users SET userName = ?, userNumber = ?, userEmail = ? WHERE userId = ?";
    values = [userName, userNumber, userEmail, userId];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: "User updated successfully" });
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
