// ===== Imports =====
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "pg"; // PostgreSQL
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
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
  console.error("❌ DATABASE_URL is missing.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL.trim(),
  ssl: { rejectUnauthorized: false },
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

// ===== Helpers =====
function getUserIdFromToken(req) {
  try {
    const auth = req.headers["authorization"];
    if (!auth?.startsWith("Bearer ")) return null;
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// ===== Auth Routes =====
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    // ✅ normalize email
    const lowerEmail = email.toLowerCase().trim();

    // Check if email already exists
    const exists = await pool.query(`SELECT id FROM users WHERE email=$1`, [
      lowerEmail,
    ]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role`,
      [name.trim(), lowerEmail, hash]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


app.post("/auth/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // ✅ normalize email
    const lowerEmail = email.toLowerCase().trim();

    // Check if user exists
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      lowerEmail,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return consistent structure
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


// ===== General Routes =====
app.get("/", (req, res) => {
  res.json("✅ NovaScotiaAle Backend is running!");
});

// LIST accommodation/jobs/rides
app.get("/accomodation", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM accomodation ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.get("/rides", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM rides ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// CREATE accommodation/jobs/rides (with optional user_id)
app.post("/accomodation", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  const userId = getUserIdFromToken(req); // NULL if not logged in
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO accomodation (title, descriptions, locations, price, contact_email, photos, status, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)
      RETURNING id
    `;
    const result = await pool.query(sql, [
      title,
      descriptions,
      locations,
      Number(price) || null,
      contact_email,
      photoPath,
      userId,
    ]);
    res.json({ id: result.rows[0].id, status: "pending" });
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.post("/jobs", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  const userId = getUserIdFromToken(req);
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO jobs (title, descriptions, locations, price, contact_email, photos, status, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)
      RETURNING id
    `;
    const result = await pool.query(sql, [
      title,
      descriptions,
      locations,
      Number(price) || null,
      contact_email,
      photoPath,
      userId,
    ]);
    res.json({ id: result.rows[0].id, status: "pending" });
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.post("/rides", upload.single("photo"), async (req, res) => {
  const { title, descriptions, locations, price, contact_email } = req.body;
  const userId = getUserIdFromToken(req);
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO rides (title, descriptions, locations, price, contact_email, photos, status, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)
      RETURNING id
    `;
    const result = await pool.query(sql, [
      title,
      descriptions,
      locations,
      Number(price) || null,
      contact_email,
      photoPath,
      userId,
    ]);
    res.json({ id: result.rows[0].id, status: "pending" });
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// ===== Admin-lite middleware =====
function adminLite(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_DASH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Admin-lite routes
app.get("/admin-lite/pending", adminLite, async (req, res) => {
  const sql = `
    SELECT 'accomodation' AS kind, id, title, contact_email, created_time, user_id
    FROM accomodation
    UNION ALL
    SELECT 'jobs' AS kind, id, title, contact_email, created_time, user_id
    FROM jobs
    UNION ALL
    SELECT 'rides' AS kind, id, title, contact_email, created_time, user_id
    FROM rides
    ORDER BY created_time DESC
    LIMIT 200
  `;
  try {
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.patch("/admin-lite/:kind/:id/status", adminLite, async (req, res) => {
  const { kind, id } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  const table =
    kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";
  try {
    const r = await pool.query(`UPDATE ${table} SET status=$1 WHERE id=$2`, [
      status,
      id,
    ]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

app.delete("/admin-lite/:kind/:id", adminLite, async (req, res) => {
  const { kind, id } = req.params;
  const table =
    kind === "jobs" ? "jobs" : kind === "rides" ? "rides" : "accomodation";
  try {
    const r = await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
