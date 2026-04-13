const http = require("http");
const https = require("https");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const url = new URL(req.url, "http://localhost");
  const path = url.searchParams.get("path");
  const key = url.searchParams.get("key");

  if (!path || !key) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Missing path or key" }));
  }

  const options = {
    hostname: "openapi.etsy.com",
    path: `/v3/application/${path}`,
    headers: { "x-api-key": key }
  };

  https.get(options, r => {
    let data = "";
    r.on("data", chunk => data += chunk);
    r.on("end", () => res.end(data));
  }).on("error", e => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  });
});

server.listen(process.env.PORT || 3000);
