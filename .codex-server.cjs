const http = require("http");
const fs = require("fs");
const path = require("path");

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };

http.createServer((request, response) => {
  const pathname = decodeURIComponent(request.url.split("?")[0]);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(__dirname, relative);
  if (!file.startsWith(__dirname)) { response.writeHead(403); response.end("Forbidden"); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404); response.end("Not found"); return; }
    response.setHeader("Content-Type", types[path.extname(file).toLowerCase()] || "application/octet-stream");
    response.end(data);
  });
}).listen(8000, "127.0.0.1");
