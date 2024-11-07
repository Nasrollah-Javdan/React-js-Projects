const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
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

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
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

app.post("/users", (req, res) => {
  const { userName, userNumber, userPassword } = req.body;
  const sql =
    "INSERT INTO users (userName, userNumber, userPassword) VALUES (?, ?, ?)";
  db.query(sql, [userName, userNumber, userPassword], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "User added successfully", userId: result.insertId });
  });
});

app.put("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const { userName, userNumber, userPassword } = req.body;
  const sql =
    "UPDATE users SET userName = ?, userNumber = ?, userPassword = ? WHERE userId = ?";
  db.query(sql, [userName, userNumber, userPassword, userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: "User updated successfully" });
  });
});

app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE userId = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result[0]); 
  });
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const sql = "SELECT * FROM users WHERE userName = ? AND userPassword = ?";
  db.query(sql, [name, password], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      res.json({
        authenticated: true,
        userName: results[0].userName,
        isAdmin: results[0].isAdmin,
      });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
