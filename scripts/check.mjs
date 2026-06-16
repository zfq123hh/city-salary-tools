import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const outDir = path.join(root, "dist");
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");
const mustExist = [
  "index.html",
  "cities/index.html",
  "tools/index.html",
  "cities/beijing/salary-tax-calculator/index.html",
  "cities/shanghai/social-security-calculator/index.html",
  "cities/shenzhen/housing-fund-calculator/index.html",
  "tools/annual-bonus-tax/index.html",
  "tools/retirement-age/index.html",
  "sitemap.xml",
  "robots.txt",
  "assets/style.css",
  "assets/app.js"
];
function fail(msg){ console.error(`❌ ${msg}`); process.exit(1); }
for (const rel of mustExist) {
  const full = path.join(outDir, rel);
  if (!fs.existsSync(full)) fail(`缺少文件: ${rel}`);
  if (!fs.statSync(full).isFile()) fail(`不是文件: ${rel}`);
}
const jsCheck = spawnSync(process.execPath, ["--check", path.join(outDir, "assets/app.js")], { encoding: "utf8" });
if (jsCheck.status !== 0) fail(`app.js 语法错误\n${jsCheck.stderr}`);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>{const p=path.join(dir,d.name);return d.isDirectory()?walk(p):[p]})}
const htmlFiles = walk(outDir).filter(f=>f.endsWith(".html"));
if (htmlFiles.length < 60) fail(`页面数量不足，当前 ${htmlFiles.length}`);
const routeToFile = href => {
  if (basePath && href.startsWith(`${basePath}/`)) href = href.slice(basePath.length);
  if (href === "/") return path.join(outDir,"index.html");
  if (href.startsWith("/assets/")) return path.join(outDir,href.slice(1));
  if (href.endsWith("/")) return path.join(outDir,href.slice(1),"index.html");
  return path.join(outDir,href.slice(1));
};
const broken = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file,"utf8");
  if (!/<title>.+<\/title>/.test(html)) broken.push(`${file}: missing title`);
  if (!/<meta name="description"/.test(html)) broken.push(`${file}: missing description`);
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) continue;
    if (!fs.existsSync(routeToFile(href))) broken.push(`${path.relative(outDir,file)} -> ${href}`);
  }
}
if (broken.length) fail(`发现内部链接/SEO问题:\n${broken.slice(0,30).join("\n")}`);
const sitemap = fs.readFileSync(path.join(outDir,"sitemap.xml"),"utf8");
const locCount = (sitemap.match(/<loc>/g)||[]).length;
if (locCount !== htmlFiles.length) fail(`sitemap 数量 ${locCount} 与 HTML 页面数量 ${htmlFiles.length} 不一致`);
console.log(`✅ 检查通过：${htmlFiles.length} 个 HTML 页面，${locCount} 条 sitemap URL，内部链接无断链，JS 语法通过。`);
