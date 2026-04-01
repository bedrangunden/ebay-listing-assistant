const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/search", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("DB hata: " + err.message);
  }
});

app.post("/add-listing", async (req, res) => {
  try {
    const { name, profit, demand, risk } = req.body;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        name TEXT,
        profit TEXT,
        demand TEXT,
        risk TEXT
      );
    `);

    await pool.query(
      "INSERT INTO listings (name, profit, demand, risk) VALUES ($1, $2, $3, $4)",
      [name, profit, demand, risk]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        profit TEXT,
        demand TEXT,
        risk TEXT
      );
    `);

    await pool.query(`
      INSERT INTO products (name, profit, demand, risk)
      VALUES
      ('LED Light', '€10', 'yüksek', 'düşük'),
      ('Organizer Box', '€8', 'orta', 'düşük'),
      ('Phone Holder', '€7', 'yüksek', 'orta')
      ON CONFLICT DO NOTHING;
    `);

    app.listen(PORT, () => {
      console.log("Server çalışıyor");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
