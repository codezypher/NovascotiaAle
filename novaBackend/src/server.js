import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { uploadsDir, uploadsStatic, upload } from './uploads.js';

const app = express();

// CORS + JSON
const allowed = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];
app.use(cors({ origin: allowed, credentials: true }));
app.use(express.json());

// serve uploaded files
app.use('/uploads', uploadsStatic);

// DB pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASS, database: process.env.DB_NAME,
  waitForConnections: true, connectionLimit: 10, queueLimit: 0, dateStrings: true
});

// Health
app.get('/', (req, res) => res.json({ ok: true, service: 'nova-ajr' }));

/* ------- Helpers ------- */
async function list(table) {
  const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
  return rows;
}
async function create(table, body, file) {
  const { title, descriptions, locations, price, contact_email } = body;
  const photoPath = file ? `/uploads/${file.filename}` : null;
  const sql = `
    INSERT INTO ${table} (title, descriptions, locations, price, contact_email, photos)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const vals = [title, descriptions, locations, Number(price) || null, contact_email || null, photoPath];
  const [r] = await pool.query(sql, vals);
  return { id: r.insertId };
}

/* ------- Routes: Accommodations ------- */
app.get('/accomodation', async (req, res) => {
  try { res.json(await list('accomodation')); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});
app.post('/accomodation', upload.single('photo'), async (req, res) => {
  try { res.status(201).json(await create('accomodation', req.body, req.file)); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});

/* ------- Routes: Jobs ------- */
app.get('/jobs', async (req, res) => {
  try { res.json(await list('jobs')); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});
app.post('/jobs', upload.single('photo'), async (req, res) => {
  try { res.status(201).json(await create('jobs', req.body, req.file)); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});

/* ------- Routes: Rides ------- */
app.get('/rides', async (req, res) => {
  try { res.json(await list('rides')); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});
app.post('/rides', upload.single('photo'), async (req, res) => {
  try { res.status(201).json(await create('rides', req.body, req.file)); }
  catch (e) { console.error(e); res.status(500).json({ error: 'DB error' }); }
});

const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`AJR backend on http://localhost:${port}`));
