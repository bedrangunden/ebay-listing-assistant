import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { name, profit, demand, risk } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sen e-ticaret uzmanısın."
          },
          {
            role: "user",
            content: `
Ürün: ${name}
Kar: ${profit}
Talep: ${demand}
Risk: ${risk}

Bunu analiz et:
- Satılır mı?
- Rekabet durumu
- Öneri ver
Kısa ve net yaz.
            `
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: "AI hata verdi" });
  }
});

app.listen(3000, () => console.log("Server çalışıyor 🚀"));
