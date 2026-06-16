import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const siteUrl = (process.env.SITE_URL || "https://miaosuangongzi.com").replace(/\/$/, "");
const host = new URL(siteUrl).host;
const key = process.env.INDEXNOW_KEY || "a783b6b8058144ba8575c8fd26d21350";
const keyLocation = `${siteUrl}/${key}.txt`;
const sitemapPath = path.join(dist, "sitemap.xml");

if (!fs.existsSync(sitemapPath)) {
  throw new Error("dist/sitemap.xml 不存在，请先运行 npm run build");
}

const sitemap = fs.readFileSync(sitemapPath, "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error("sitemap 中没有 URL");

const payload = {
  host,
  key,
  keyLocation,
  urlList: urls.slice(0, 10000)
};

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
});

const text = await response.text();
console.log(JSON.stringify({
  endpoint: "https://api.indexnow.org/indexnow",
  host,
  keyLocation,
  urls: payload.urlList.length,
  status: response.status,
  ok: response.ok,
  response: text.slice(0, 500)
}, null, 2));

if (!response.ok) process.exit(1);
