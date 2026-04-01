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
    const q = (req.query.q || "").toLowerCase();

    let result;
    if (q) {
      result = await pool.query(
        "SELECT * FROM products WHERE LOWER(name) LIKE $1 ORDER BY id DESC",
        [`%${q}%`]
      );
    } else {
      result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/listings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM saved_listings ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/add-listing", async (req, res) => {
  try {
    const { name, profit, demand, risk } = req.body;

    if (!name || !profit || !demand || !risk) {
      return res.status(400).json({ success: false, error: "Eksik veri" });
    }

    await pool.query(
      `
      INSERT INTO saved_listings (name, profit, demand, risk)
      VALUES ($1, $2, $3, $4)
      `,
      [name, profit, demand, risk]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/delete-listing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM saved_listings WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        profit TEXT NOT NULL,
        demand TEXT NOT NULL,
        risk TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_listings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        profit TEXT NOT NULL,
        demand TEXT NOT NULL,
        risk TEXT NOT NULL
      );
    `);

    await pool.query(`
      INSERT INTO products (name, profit, demand, risk)
      SELECT * FROM (
        VALUES
          ('LED Light', '€10', 'yüksek', 'düşük'),
          ('Organizer Box', '€8', 'orta', 'düşük'),
          ('Phone Holder', '€7', 'yüksek', 'orta')
      ) AS v(name, profit, demand, risk)
      WHERE NOT EXISTS (SELECT 1 FROM products);
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
