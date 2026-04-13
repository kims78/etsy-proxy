const express = require("express");
const https = require("https");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/etsy", (req, res) => {
  const { path, key } = req.query;
  if (!path || !key) return res.status(400).json({ error: "Missing path or key" });
  
  const options = {
    hostname: "openapi.etsy.com",
    path: `/v3/application/${path}`,
    headers: { "x-api-key": key }
  };

  https.get(options, r => {
    let data = "";
    r.on("data", chunk => data += chunk);
    r.on("end", () => {
      try { res.json(JSON.parse(data)); }
      catch(e) { res.status(500).json({ error: "Parse error" }); }
    });
  }).on("error", e => res.status(500).json({ error: e.message }));
});

app.listen(process.env.PORT || 3000);
