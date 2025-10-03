// seedUsers.js
import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  try {
    const adminPass = await bcrypt.hash("admin123", 10);
    const userPass = await bcrypt.hash("user123", 10);

    await pool.query(`
      TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES 
       ('Admin Nova', 'admin@nsale.com', $1, 'admin'),
       ('Normal User', 'user@nsale.com', $2, 'user')`,
      [adminPass, userPass]
    );

    console.log("✅ Users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();
