// ===== Imports =====
import dotenv from "dotenv";
dotenv.config();

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

// Backend Port
const PORT = process.env.PORT || 8800;


// ===== App =====
const app = express();

// Static for uploaded files (must be after app = express())
app.use("/uploads", express.static(uploadsDir));

// CORS + JSON
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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

// LIST accomodation (approved only)
app.get("/accomodation", (req, res) => {
  db.query("SELECT * FROM accomodation WHERE status='approved' ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching accomodation:", err);
      return res.status(500).json({ error: "Database Error!" });
    }
    res.json(rows);
  });
});


// CREATE accomodation
app.post("/accomodation", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO accomodation (title, descriptions, locations, price, contact_email, photos)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, descriptions, locations, Number(price) || null, contact_email, photoPath], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, status: "pending", message: "Accommodation submitted for review" });
  });
});


// ===== JOBS =====

// LIST jobs (approved only)
app.get("/jobs", (req, res) => {
  db.query("SELECT * FROM jobs WHERE status='approved' ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database Error!" });
    res.json(rows);
  });
});


// CREATE job
app.post("/jobs", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO jobs (title, descriptions, locations, price, contact_email, photos)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, descriptions, locations, Number(price) || null, contact_email, photoPath], (err, result) => {
    if (err) {
      console.error("Insert jobs error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, status: "pending", message: "Job submitted for review" });
  });
});

// ===== RIDES =====
// LIST rides (approved only)
app.get("/rides", (req, res) => {
  db.query("SELECT * FROM rides WHERE status='approved' ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database Error!" });
    res.json(rows);
  });
});

// CREATE ride
app.post("/rides", upload.single("photo"), (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO rides (title, descriptions, locations, price, contact_email, photos)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, descriptions, locations, Number(price) || null, contact_email, photoPath], (err, result) => {
    if (err) {
      console.error("Insert rides error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ id: result.insertId, status: "pending", message: "Ride submitted for review" });
  });
});



// DELETE
app.delete("/accomodation/:id", (req, res) => {
  db.query("DELETE FROM accomodation WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "Accomodation has been deleted successfully." });
  });
});


// ===== Admin-lite auth middleware =====
function adminLite(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_DASH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ===== Admin-lite: list pending across all tables =====
app.get("/admin-lite/pending", adminLite, (req, res) => {
  const sql = `
    SELECT 'accomodation' AS kind, id, title, contact_email, created_time AS created_at
    FROM accomodation WHERE status='pending'
    UNION ALL
    SELECT 'jobs' AS kind, id, title, contact_email, created_time
    FROM jobs WHERE status='pending'
    UNION ALL
    SELECT 'rides' AS kind, id, title, contact_email, created_time
    FROM rides WHERE status='pending'
    ORDER BY created_at DESC
    LIMIT 200
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// ===== Admin-lite: approve/reject =====
app.patch("/admin-lite/:kind/:id/status", adminLite, (req, res) => {
  const { kind, id } = req.params;
  const { status } = req.body || {};
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ error: "Bad status" });

  const table = kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";
  db.query(`UPDATE ${table} SET status=? WHERE id=?`, [status, id], (err, r) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (r.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  });
});

// ===== Admin-lite: delete row =====
app.delete("/admin-lite/:kind/:id", adminLite, (req, res) => {
  const { kind, id } = req.params;
  const table = kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";
  db.query(`DELETE FROM ${table} WHERE id=?`, [id], (err, r) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (r.affectedRows === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  });
});



// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
