const fs = require("fs");
const path = require("path");

// Path to the built index.html
const htmlPath = path.join(__dirname, "..", "dist", "index.html");

// Read the HTML file
let html = fs.readFileSync(htmlPath, "utf8");

// Replace render-blocking CSS with async loading
// Find: <link rel="stylesheet" crossorigin href="/assets/css/index-XXXXX.css">
// Replace with async loading technique
html = html.replace(
  /<link rel="stylesheet" crossorigin href="(\/assets\/css\/[^"]+)">/g,
  (match, href) => {
    return `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="${href}" crossorigin>
    <noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`;
  }
);

// Write the optimized HTML back
fs.writeFileSync(htmlPath, html, "utf8");

console.log("✅ HTML optimized: CSS is now non-blocking");
