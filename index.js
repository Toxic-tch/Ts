const http = require("http");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 8080;

// Start Wings
spawn("/etc/pterodactyl/wings", [], {
  stdio: "inherit"
});

// ✅ FIXED Serveo tunnel (no TTY error + shows URL)
const tunnel = spawn("ssh", [
  "-T", // ✅ disable pseudo-terminal (fix error)
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
  console.log(data.toString()); // Serveo prints URL here sometimes
});

// Keep service alive
http.createServer((req, res) => {
  res.end("Wings running");
}).listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
