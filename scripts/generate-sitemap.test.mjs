import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, copyFile, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSitemap, SITE_URL, staticPages } from "./generate-sitemap.js";

test("configured pages have one URL each, the site prefix and injected date", () => {
  const xml = buildSitemap(staticPages, "2031-05-17");
  assert.equal((xml.match(/<url>/g) || []).length, staticPages.length);
  const locations = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (m) => m[1]);
  assert.deepEqual(
    locations,
    staticPages.map((page) => SITE_URL + page.url),
  );
  const dates = Array.from(xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g), (m) => m[1]);
  assert.deepEqual(
    dates,
    staticPages.map(() => "2031-05-17"),
  );
  assert.equal(buildSitemap(staticPages, "2031-05-17"), xml);
});

test("the complete XML template is well-formed and fields are XML-escaped", () => {
  const pages = [{ url: "/find?a=1&b=<two>", changefreq: "daily", priority: "0.9" }];
  assert.equal(
    buildSitemap(pages, "2032-02-29"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.stellarsampled.com/find?a=1&amp;b=&lt;two&gt;</loc>
    <lastmod>2032-02-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`,
  );
  assert.throws(() => buildSitemap(pages, "2031-02-29"), /valid calendar date/);
  assert.throws(() => buildSitemap(pages, "2031-05-17<tag>"), /YYYY-MM-DD/);
  assert.throws(
    () => buildSitemap([{ ...pages[0], url: "/bad\u0000" }], "2031-05-17"),
    /valid XML characters/,
  );
});

test("import has no output or file write, while the direct CLI still generates", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "sampled-sitemap-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const scripts = path.join(root, "scripts");
  await mkdir(scripts);
  const entry = path.join(scripts, "generate-sitemap.mjs");
  await copyFile(new URL("./generate-sitemap.js", import.meta.url), entry);

  // There is deliberately no public directory: an import must not try to write.
  const imported = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `await import(${JSON.stringify(pathToFileURL(entry).href)})`,
    ],
    { encoding: "utf8" },
  );
  assert.equal(imported.status, 0, imported.stderr);
  assert.equal(imported.stdout, "");
  assert.equal(imported.stderr, "");
  await assert.rejects(readFile(path.join(root, "public", "sitemap.xml")), {
    code: "ENOENT",
  });

  await mkdir(path.join(root, "public"));
  const before = new Date().toISOString().slice(0, 10);
  const generated = spawnSync(process.execPath, [entry], { encoding: "utf8" });
  const after = new Date().toISOString().slice(0, 10);
  assert.equal(generated.status, 0, generated.stderr);
  const xml = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
  assert.ok(
    xml === buildSitemap(staticPages, before) ||
      xml === buildSitemap(staticPages, after),
  );
});
