// ===== Imports =====
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "pg"; // PostgreSQL
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const { Pool } = pkg;

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

// Static for uploaded files
app.use("/uploads", express.static(uploadsDir));

// ===== CORS + JSON =====
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,  // your Vercel frontend
  "http://localhost:3000",    // local React dev
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

// tiny logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===== Postgres (Neon) =====
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing. Check your Render environment variables.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.trim(),
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
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
  res.json("Hey, I am the backend server connected to Neon 🚀!");
});

// LIST accommodation (approved only)
app.get("/accomodation", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM accomodation WHERE status='approved' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching accomodation:", err.message);
    res.status(500).json({ error: "Database Error!", details: err.message });
  }
});

// CREATE accommodation
app.post("/accomodation", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO accomodation (title, descriptions, locations, price, contact_email, photos, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `;
    const values = [title, descriptions, locations, Number(price) || null, contact_email, photoPath];
    const result = await pool.query(sql, values);

    res.json({ id: result.rows[0].id, status: "pending", message: "Accommodation submitted for review" });
  } catch (err) {
    console.error("Insert accomodation error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ===== JOBS =====
app.get("/jobs", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM jobs WHERE status='approved' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ error: "Database Error!", details: err.message });
  }
});

app.post("/jobs", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO jobs (title, descriptions, locations, price, contact_email, photos, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `;
    const result = await pool.query(sql, [
      title, descriptions, locations, Number(price) || null, contact_email, photoPath,
    ]);
    res.json({ id: result.rows[0].id, status: "pending", message: "Job submitted for review" });
  } catch (err) {
    console.error("Insert jobs error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ===== RIDES =====
app.get("/rides", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM rides WHERE status='approved' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching rides:", err.message);
    res.status(500).json({ error: "Database Error!", details: err.message });
  }
});

app.post("/rides", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  if (!contact_email) return res.status(400).json({ error: "contact_email required" });
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO rides (title, descriptions, locations, price, contact_email, photos, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `;
    const result = await pool.query(sql, [
      title, descriptions, locations, Number(price) || null, contact_email, photoPath,
    ]);
    res.json({ id: result.rows[0].id, status: "pending", message: "Ride submitted for review" });
  } catch (err) {
    console.error("Insert rides error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// DELETE accommodation
app.delete("/accomodation/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM accomodation WHERE id = $1", [req.params.id]);
    res.json({ message: "Accommodation has been deleted successfully." });
  } catch (err) {
    console.error("Delete accommodation error:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// ===== Admin-lite auth middleware =====
function adminLite(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_DASH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Admin-lite pending
app.get("/admin-lite/pending", adminLite, async (req, res) => {
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
  try {
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending items:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Admin-lite approve/reject
app.patch("/admin-lite/:kind/:id/status", adminLite, async (req, res) => {
  const { kind, id } = req.params;
  const { status } = req.body || {};
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ error: "Bad status" });

  const table = kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";

  try {
    const r = await pool.query(`UPDATE ${table} SET status=$1 WHERE id=$2`, [status, id]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Admin-lite delete
app.delete("/admin-lite/:kind/:id", adminLite, async (req, res) => {
  const { kind, id } = req.params;
  const table = kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";

  try {
    const r = await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting row:", err.message);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
