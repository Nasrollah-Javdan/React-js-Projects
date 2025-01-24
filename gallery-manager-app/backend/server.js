// استفاده از فریمورک express Js برای سادگی کار بیشتر
const express = require("express");
// برای اتصال به دیتابیس
const mysql = require("mysql");
// برای اجازه دسترسی به لینک های خارجی
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
// عملیات کراد برای فایل های سیستمی
const fs = require("fs");
// هش کردن اطلاعات
const bcrypt = require("bcryptjs");
// ایجاد توکن
const jwt = require("jsonwebtoken");
//
const cookieParser = require("cookie-parser");

const key = "hashKey";
function simpleEncryptDecrypt(input, key) {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

// اعتبار سنجی توکن و اعمال محدودیت متناسب نقش کاربر ورودی
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "دسترسی امکان پذیر نیست" });
  }

  
  const verifyToken = (token, secretKey) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      return null;
    }
  };
  
  let admin = false;

  let verified = verifyToken(token, adminSecretKey);
  if(verified){
    console.log("Admin Verified");
    admin = true;
  }else{
    verified = verifyToken(token, userSecretKey);
    if(verified){
      console.log("User Verified");
    }
  }

  if (verified) {
    req.user = verified;
    if (admin) {
      next(); 
    } else if (
      !admin &&
      (req.path === "/user-images" ||
        req.path === "/forget-password" ||
        req.path === "/search-images")
    ) {
      next(); 
    } else {
      res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
    }
  } else {
    res.status(400).json({ message: "توکن شما معتبر نمی باشد" });
  }
};


// استفاده از اکسپرس
const app = express();
// برای افزودن کوکی
app.use(cookieParser());
// مشخص کردن مسیر فرانت اند و اجازه ارسال کوکی
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

// اتصال به دیتابیس لوکال هاست
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gallery",
});

// کنترل اتصال به دیتابیس
db.connect((err) => {
  if (err) {
    console.error("اتصال به پایگاه داده امکان پذیر نیست", err);
    return;
  }
  console.log("اتصال به پایگاه داده برقرار است");
});

// تعریف محل ذخیره عکس ها و مشخص کردن نحوه اسم گذاری برای عکس ها
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        path
          .basename(file.originalname)
          .substr(
            path.basename(file.originalname).lastIndexOf("."),
            path.basename(file.originalname).length
          )
    );
  },
});

// متد فراموشی رمز
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

// متد بارگزاری عکس جدید
app.post(
  "/upload",
  authenticateToken,
  upload.single("fileToUpload"),
  async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
    }

    const {
      imageId,
      userId,
      userName,
      userNumber,
      photographerName,
      description,
    } = req.body;
    const imagePath = req.file.path.replace(/\\/g, "/");

    try {
      const encryptedImagePath = simpleEncryptDecrypt(imagePath, key);
      // console.log(encryptedImagePath);

      const sql =
        "INSERT INTO images (imageId, imagePath, userId, userName, userNumber, photographerName, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          imageId,
          encryptedImagePath,
          userId,
          userName,
          userNumber,
          photographerName,
          description,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.json({
            message: "تصویر با موفقیت بارگزاری شد و در پایگاه داده قرار گرفت",
          });
        }
      );
    } catch (err) {
      console.error("Error encrypting image path:", err);
      res.status(500).json({ message: "خطایی در پردازش تصویر رخ داده است" });
    }
  }
);

// متد گرفتن اطلاعات کاربران از دیتابیس
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

app.get("/search-images", authenticateToken, (req, res) => {
  const searchQuery = req.query.q;

  let sql;
  let params;

  if (req.user.role === "admin") {
    sql =
      "SELECT * FROM images WHERE imageId LIKE ? OR userId LIKE ? OR userName LIKE ?";
    params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
  } else {
    sql =
      "SELECT * FROM images WHERE (imageId LIKE ? OR userId LIKE ? OR userName LIKE ?) AND userName = ?";
    params = [
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      `%${searchQuery}%`,
      req.user.userName,
    ];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    results = results.map((result) => {
      const decryptedImagePath = simpleEncryptDecrypt(result.imagePath, key);
      result.imagePath = decryptedImagePath.replace(/\\/g, "/");
      return result;
    });

    res.json(results);
  });
});


// متد گرفتن اطلاعات از دیتابیس
app.get("/images", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
  }

  const sql = "SELECT * FROM images";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    const key = "hashKey";

    results = results.map((result) => {
      const decryptedImagePath = simpleEncryptDecrypt(result.imagePath, key);
      result.imagePath = decryptedImagePath.replace(/\\/g, "/");
      return result;
    });
    res.json(results);
  });
});


app.use("/uploads", (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "دسترسی امکان پذیر نیست" });
  }

  const verifyToken = (token, secretKey) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      return null;
    }
  };

  let admin = false;

  let verified = verifyToken(token, adminSecretKey);
  if(verified){
    console.log("Admin Verified");
    admin = true;
  }else{
    verified = verifyToken(token, userSecretKey);
    if(verified){
      console.log("User Verified");
    }
  }

  if (verified) {
    req.user = verified;

    if (admin) {
      express.static(path.join(__dirname, "uploads"))(req, res, next);
    } else {
      const sql = "SELECT imagePath FROM images WHERE userName = ?";
      db.query(sql, [req.user.userName], (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }

        const userImages = results.map((result) => {
          const decryptedImagePath = simpleEncryptDecrypt(result.imagePath, key);
          return path.basename(decryptedImagePath);
        });

        const requestedImage = path.basename(req.path);

        if (userImages.includes(requestedImage)) {
          express.static(path.join(__dirname, "uploads"))(req, res, next);
        } else {
          res.status(403).json({ message: "دسترسی امکان پذیر نیست" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "توکن شما معتبر نمی باشد" });
  }
});



app.get(
  "/user-images",
  authenticateToken,
  (req, res, next) => {
    const sql = "SELECT imagePath FROM images WHERE userName = ?";
    db.query(sql, [req.user.userName], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      const userImages = results.map((result) => {
        const decryptedImagePath = simpleEncryptDecrypt(result.imagePath, key);
        return path.basename(decryptedImagePath);
      });
      // console.log("[INFO] User images fetched from DB:", userImages);

      req.userImages = userImages;
      next();
    });
  },
  (req, res) => {
    const sql = "SELECT * FROM images WHERE userName = ?";
    db.query(sql, [req.user.userName], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      results = results.map((result) => {
        const decryptedImagePath = simpleEncryptDecrypt(result.imagePath, key);
        result.imagePath = decryptedImagePath.replace(/\\/g, "/");
        return result;
      });

      // console.log("[INFO] User images fetched from DB:", results);

      res.json(results);
    });
  }
);

// متد جستجوی کاربر در دیتابیس
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

//
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

    const encryptedImagePath = results[0].imagePath;
    const decryptedImagePath = simpleEncryptDecrypt(encryptedImagePath, key);

    const deleteSql = "DELETE FROM images WHERE imageId = ?";
    db.query(deleteSql, [imageId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      fs.unlink(decryptedImagePath, (err) => {
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

    const selectSql = "SELECT imagePath FROM images WHERE imageId = ?";
    db.query(selectSql, [imageId], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "تصویر یافت نشد" });
      }

      const oldEncryptedImagePath = results[0].imagePath;
      const oldImagePath = simpleEncryptDecrypt(oldEncryptedImagePath, key);

      if (!imagePath) {
        imagePath = oldImagePath;
      }

      const encryptedImagePath = simpleEncryptDecrypt(imagePath, key);

      const updateSql =
        "UPDATE images SET imagePath = ?, userId = ?, userName = ?, userNumber = ?, photographerName = ?, description = ? WHERE imageId = ?";
      db.query(
        updateSql,
        [
          encryptedImagePath,
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
      return res
        .status(400)
        .json({ message: "نام کاربری یا شماره همراه قبلاً ثبت شده است" });
    }

    // const hashedPassword = await bcrypt.hash(userPassword, 10);
    const insertSql =
      "INSERT INTO users (userId, userName, userNumber, userEmail, userPassword) VALUES (?, ?, ?, ?, ?)";

    db.query(
      insertSql,
      [userId, userName, userNumber, userEmail || null, userPassword],
      (insertErr, result) => {
        if (insertErr) {
          return res.status(500).send(insertErr);
        }

        // Send JSON response
        res.status(200).json({
          message: "اطلاعات با موفقیت ثبت شد",
          userId: result.insertId,
        });
      }
    );
  });
});

const editUser = multer();

app.put(
  "/users/:userId",
  authenticateToken,
  editUser.none(),
  async (req, res) => {
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
      sql =
        "UPDATE users SET userName = ?, userNumber = ?, userEmail = ?, userPassword = ? WHERE userId = ?";
      values = [userName, userNumber, userEmail, userPassword, userId];
    } else {
      sql =
        "UPDATE users SET userName = ?, userNumber = ?, userEmail = ? WHERE userId = ?";
      values = [userName, userNumber, userEmail, userId];
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log("Email is Duplicated");
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "User updated successfully" });
    });
  }
);

const adminSecretKey = 'adminSecretKey';
const userSecretKey = 'userSecretKey';

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
        let token;
        if (user.isAdmin) {
          token = jwt.sign(
            {
              id: user.userId,
              role: "admin",
              userName: user.userName,
            },
            adminSecretKey,
            { expiresIn: "1h" }
          );
        } else {
          token = jwt.sign(
            {
              id: user.userId,
              role: "user",
              userName: user.userName,
            },
            userSecretKey,
            { expiresIn: "1h" }
          );
        }
        res.cookie("token", token, { httpOnly: true });
        res.json({
          authenticated: true,
          token,
          userName: user.userName,
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
