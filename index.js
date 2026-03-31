const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Sistem çalışıyor 🚀");
});

// 🔥 ÜRÜN BULMA
app.get("/search", (req, res) => {
  const q = req.query.q || "ürün";

  const results = [
    {
      name: `${q} LED Light`,
      profit: "€10",
      demand: "yüksek",
      risk: "düşük"
    },
    {
      name: `${q} Organizer Box`,
      profit: "€8",
      demand: "orta",
      risk: "düşük"
    },
    {
      name: `${q} Phone Holder`,
      profit: "€7",
      demand: "yüksek",
      risk: "orta"
    }
  ];

  res.json(results);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
