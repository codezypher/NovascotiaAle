// ===== Imports =====
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ===== Setup paths (__dirname in ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ===== App =====
const app = express();

// Static for uploaded files (must be after app = express())
app.use("/uploads", express.static(uploadsDir));

// CORS + JSON
app.use(
  cors({
    origin: ["http://localhost:3000"], // your React dev server
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());


// (optional) tiny logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===== MySQL =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Donkal@9953",
  database: "NovaScotiaAle",
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// ===== Multer (file uploads) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safe);
  },
});
const upload = multer({ storage });

// ===== Routes =====
app.get("/", (req, res) => {
  res.json("Hey, I am the backend server..............!");
});

// LIST
app.get("/accomodation", (req, res) => {
  db.query("SELECT * FROM accomodation ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching accomodation:", err);
      return res.status(500).json({ error: "Database Error!" });
    }
    res.json(rows);
  });
});

// CREATE (with image upload)
app.post("/accomodation", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO accomodation (title, descriptions, locations, price, photos)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, descriptions, locations, Number(price), photoPath],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: result.insertId, message: "Accommodation added" });
    }
  );
});


// ===== JOBS =====

// LIST jobs
app.get("/jobs", (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database Error!" });
    res.json(rows);
  });
});

// CREATE job (optional image)
app.post("/jobs", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO jobs (title, descriptions, locations, price, photos)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, descriptions, locations, Number(price), photoPath], (err, result) => {
    if (err) {
      console.error("Insert jobs error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, message: "Job added" });
  });
});


// ===== RIDES =====

// LIST rides
app.get("/rides", (req, res) => {
  db.query("SELECT * FROM rides ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database Error!" });
    res.json(rows);
  });
});

// CREATE ride (optional image)
app.post("/rides", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO rides (title, descriptions, locations, price, photos)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, descriptions, locations, Number(price), photoPath], (err, result) => {
    if (err) {
      console.error("Insert rides error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, message: "Ride added" });
  });
});



// DELETE
app.delete("/accomodation/:id", (req, res) => {
  db.query("DELETE FROM accomodation WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "Accomodation has been deleted successfully." });
  });
});

// ===== Start server =====
app.listen(8800, () => {
  console.log("Server is running on http://localhost:8800");
});
