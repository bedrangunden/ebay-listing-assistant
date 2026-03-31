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
