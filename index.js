const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", (req, res) => {
  res.send("Sistem çalışıyor 🚀");
});

app.get("/search", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("DB hata: " + err.message);
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});

await pool.query(`
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  profit TEXT,
  demand TEXT,
  risk TEXT
);
`);



app.listen(PORT, async () => {
  console.log("Server çalışıyor");

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

    console.log("DB hazır");
  } catch (err) {
    console.error(err);
  }
});

