// Copies the web app into www/ for Capacitor (iOS and Android builds).
import { cpSync, rmSync, mkdirSync } from "node:fs";

const files = ["index.html", "manifest.webmanifest", "sw.js", "css", "js", "icons"];
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
for (const f of files) cpSync(f, `www/${f}`, { recursive: true });
console.log("Built www/ with:", files.join(", "));
