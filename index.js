const http = require("http");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 8080;

// Start Wings
const wings = spawn("/etc/pterodactyl/wings", [], {
  stdio: "inherit"
});

wings.on("close", (code) => {
  console.log(`Wings exited with code ${code}`);
});

// Start Serveo tunnel (auto URL)
const tunnel = spawn("ssh", [
  "-o",
  "StrictHostKeyChecking=no",
  "-R",
  "80:localhost:8080",
  "serveo.net"
]);

tunnel.stdout.on("data", (data) => {
  console.log("🌍 PUBLIC URL:");
  console.log(data.toString());
});

tunnel.stderr.on("data", (data) => {
  console.error("Tunnel error:", data.toString());
});

// Keep Render alive
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wings running\n");
}).listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
