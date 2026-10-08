/**
 * Sitemap Generator for Sampled
 *
 * This script generates static URL entries into public/sitemap.xml (overwriting the committed file).
 * It emits the four static routes: /, /explore, /upload-sample, and /waitlist.
 * Note: Dynamic sample routes (/sample/:id, /market/:id) are excluded and must be supplied from an indexer or database.
 * Run with: node scripts/generate-sitemap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://www.stellarsampled.com";

// Static pages configuration
const staticPages = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/explore", changefreq: "daily", priority: "0.9" },
  { url: "/upload-sample", changefreq: "monthly", priority: "0.8" },
  { url: "/waitlist", changefreq: "monthly", priority: "0.7" },
];

// Generate XML for a single URL entry
function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Main sitemap generation function
async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  console.log("Generating sitemap...");
  console.log("Site URL:", SITE_URL);

  // Generate URL entries for static pages
  const urlEntries = staticPages.map((page) =>
    generateUrlEntry(
      SITE_URL + page.url,
      today,
      page.changefreq,
      page.priority,
    ),
  );

  console.log("Added " + staticPages.length + " static pages");

  // Generate final sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;

  // Write to public directory
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outputPath, sitemap, "utf8");

  console.log("");
  console.log("Sitemap generated successfully!");
  console.log("Output: " + outputPath);
  console.log("Total URLs: " + urlEntries.length);
}

// Run the generator
generateSitemap().catch(console.error);
