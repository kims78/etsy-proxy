const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/etsy", async (req, res) => {
  const { path, key } = req.query;
  if (!path || !key) return res.status(400).json({ error: "Missing path or key" });
  try {
    const r = await fetch(`https://openapi.etsy.com/v3/application/${path}`, {
      headers: { "x-api-key": key }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000);
