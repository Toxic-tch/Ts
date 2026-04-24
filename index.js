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

// Optional: Serveo tunnel (your command)
const tunnel = spawn("ssh", [
  "-o", "StrictHostKeyChecking=no",
  "-R", "443:localhost:8080",
  "serveo.net"
]);

tunnel.stdout.on("data", (data) => {
  console.log(`Tunnel: ${data}`);
});

tunnel.stderr.on("data", (data) => {
  console.error(`Tunnel Error: ${data}`);
});

// Simple HTTP server (required by Render)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wings is running\n");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
