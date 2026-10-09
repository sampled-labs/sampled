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

export const SITE_URL = "https://www.stellarsampled.com";

// Static pages configuration
export const staticPages = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/explore", changefreq: "daily", priority: "0.9" },
  { url: "/upload-sample", changefreq: "monthly", priority: "0.8" },
  { url: "/waitlist", changefreq: "monthly", priority: "0.7" },
];

function escapeXml(value) {
  const text = String(value);
  for (const character of text) {
    const code = character.codePointAt(0);
    if (
      (code < 0x20 && ![0x09, 0x0a, 0x0d].includes(code)) ||
      (code >= 0xd800 && code <= 0xdfff) ||
      code === 0xfffe ||
      code === 0xffff
    ) {
      throw new TypeError("Sitemap fields must contain valid XML characters");
    }
  }
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// Pure XML construction: importing this module does not read the clock or write.
export function buildSitemap(pages, today) {
  if (!Array.isArray(pages)) {
    throw new TypeError("Sitemap pages must be an array");
  }
  if (typeof today !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    throw new TypeError("Sitemap date must use YYYY-MM-DD");
  }
  const date = new Date(`${today}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== today) {
    throw new TypeError("Sitemap date must be a valid calendar date");
  }

  const urlEntries = pages.map(
    (page) => `  <url>
    <loc>${escapeXml(SITE_URL + page.url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${escapeXml(page.changefreq)}</changefreq>
    <priority>${escapeXml(page.priority)}</priority>
  </url>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;
}

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const sitemap = buildSitemap(staticPages, today);
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");

  console.log("Generating sitemap...");
  console.log("Site URL:", SITE_URL);
  console.log("Added " + staticPages.length + " static pages");
  fs.writeFileSync(outputPath, sitemap, "utf8");
  console.log("");
  console.log("Sitemap generated successfully!");
  console.log("Output: " + outputPath);
  console.log("Total URLs: " + staticPages.length);
}

// Keep CLI generation, but make the exported builder safe to import in tests.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateSitemap().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
