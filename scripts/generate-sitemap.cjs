// Script to generate dynamic sitemap based on actual content
// This should be run before deployment to include all manuscript/post URLs

const fs = require("fs");
const path = require("path");

const baseUrl = "https://chinguitipedia.com";
const currentDate = new Date().toISOString().split("T")[0];

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/about", priority: "0.8", changefreq: "monthly" },
  { url: "/contact", priority: "0.7", changefreq: "monthly" },
  { url: "/terms", priority: "0.5", changefreq: "yearly" },
  { url: "/manuscripts", priority: "0.9", changefreq: "weekly" },
  { url: "/tahqiq", priority: "0.9", changefreq: "weekly" },
  { url: "/books-on-chinguitt", priority: "0.9", changefreq: "weekly" },
  { url: "/about-chinguit", priority: "0.9", changefreq: "weekly" },
  { url: "/sharia-sciences", priority: "0.85", changefreq: "weekly" },
  { url: "/linguistic-sciences", priority: "0.85", changefreq: "weekly" },
  { url: "/social-sciences", priority: "0.85", changefreq: "weekly" },
  { url: "/varieties", priority: "0.85", changefreq: "weekly" },
  { url: "/benefits", priority: "0.85", changefreq: "weekly" },
  { url: "/formal-education-library", priority: "0.85", changefreq: "weekly" },
  { url: "/scientific-news", priority: "0.85", changefreq: "daily" },
  { url: "/search", priority: "0.6", changefreq: "monthly" },
  { url: "/all-entries", priority: "0.7", changefreq: "weekly" },
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach((page) => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemap += `
</urlset>`;

  // Write to public folder
  const publicPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(publicPath, sitemap, "utf-8");
  console.log("✅ Sitemap generated successfully at:", publicPath);

  // Also copy to dist folder if it exists
  const distPath = path.join(__dirname, "../dist/sitemap.xml");
  if (fs.existsSync(path.join(__dirname, "../dist"))) {
    fs.writeFileSync(distPath, sitemap, "utf-8");
    console.log("✅ Sitemap copied to dist folder");
  }
}

// Run the script
generateSitemap();

// Export for use in build process
module.exports = { generateSitemap };
