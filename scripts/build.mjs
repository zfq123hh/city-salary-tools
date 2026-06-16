import fs from "node:fs";
import path from "node:path";
import { cities, cityNote } from "../src/data/cities.mjs";
import { tools, cityToolTypes } from "../src/data/tools.mjs";

const root = path.resolve(process.cwd());
const outDir = path.join(root, "dist");
const siteName = "秒算工资工具";
const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");
const buildDate = new Date().toISOString().slice(0, 10);
const pages = [];

function ensureDir(filePath) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); }
function write(route, html, priority = 0.7, changefreq = "weekly") {
  const clean = route.endsWith("/") ? route : `${route}/`;
  const file = clean === "/"
    ? path.join(outDir, "index.html")
    : path.join(outDir, clean.slice(1), "index.html");
  ensureDir(file);
  let output = html;
  if (basePath) {
    output = output.replaceAll('href="/', `href="${basePath}/`).replaceAll('src="/', `src="${basePath}/`);
  }
  fs.writeFileSync(file, output, "utf8");
  pages.push({ route: clean, priority, changefreq });
}
function esc(s) { return String(s).replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function abs(route) { return `${siteUrl}${route}`; }
function breadcrumb(items) {
  return `<div class="breadcrumbs"><a href="/">首页</a>${items.map(i => ` / ${i.href ? `<a href="${i.href}">${esc(i.label)}</a>` : esc(i.label)}`).join("")}</div>`;
}
function layout({ route, title, description, keywords = [], body, schema }) {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const jsonLd = schema || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fullTitle,
    description,
    url: abs(route)
  };
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(keywords.join(","))}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${abs(route)}" />
  <link rel="stylesheet" href="/assets/style.css" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${abs(route)}" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header class="topbar"><div class="container topbar-inner"><a class="brand" href="/">${siteName}</a><nav class="nav"><a href="/cities/">城市工资</a><a href="/tools/">实用工具</a><a href="/privacy/">隐私政策</a><a href="/contact/">联系</a></nav></div></header>
  ${body}
  <footer class="footer"><div class="container"><p><strong>${siteName}</strong>：专注工资税后、社保公积金、个税、贷款和日期工具。</p><p><a href="/about/">关于我们</a> · <a href="/terms/">使用条款</a> · <a href="/privacy/">隐私政策</a> · <a href="/affiliate-disclosure/">推广披露</a></p><p class="muted">© ${new Date().getFullYear()} ${siteName}. 工具结果仅供估算参考，请以当地社保局、税务局、公积金中心及银行实际口径为准。</p></div></footer>
  <script src="/assets/app.js" defer></script>
</body>
</html>`;
}
function adSlot(){return `<div class="ad-slot">广告位预留：后续接入百度联盟 / 腾讯优量汇 / 国内 CPS 推荐</div>`}
function faq(items){return `<section class="card content"><h2>常见问题</h2>${items.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>`}
function salaryCalc(city){return `<section class="card calculator" data-calculator="salary" data-min="${city.minBase}" data-max="${city.maxBase}"><div><h2>${city.name}税后工资计算器</h2><p class="muted">输入月薪、社保基数和公积金比例，实时估算到手工资、个人社保、公积金和个税。</p><div class="form-row"><label>税前月薪</label><input name="gross" type="number" value="${city.avgSalary}" min="0" /></div><div class="form-row"><label>社保/公积金缴费基数</label><input name="base" type="number" value="${Math.min(city.avgSalary, city.maxBase)}" min="${city.minBase}" max="${city.maxBase}" /></div><div class="form-row"><label>个人公积金比例</label><select name="fundRate"><option value="5">5%</option><option value="7" selected>7%</option><option value="8">8%</option><option value="10">10%</option><option value="12">12%</option></select></div><p class="notice">${esc(city.name)}当前估算基数范围：社保 ${city.minBase} - ${city.maxBase} 元，公积金 ${city.fundMin} - ${city.fundMax} 元。</p></div><div class="result"><p>预计到手工资</p><p class="big js-net">--</p><dl><dt>个人所得税</dt><dd class="js-tax">--</dd><dt>个人社保</dt><dd class="js-social">--</dd><dt>个人公积金</dt><dd class="js-fund">--</dd><dt>应纳税所得额</dt><dd class="js-taxable">--</dd></dl></div></section>`}
function socialCalc(city){return `<section class="card calculator" data-calculator="social" data-min="${city.minBase}" data-max="${city.maxBase}"><div><h2>${city.name}社保计算器</h2><p class="muted">按养老、医疗、失业等常见个人比例估算个人社保缴费，并给出企业成本参考。</p><div class="form-row"><label>社保缴费基数</label><input name="base" type="number" value="${Math.min(city.avgSalary, city.maxBase)}" min="${city.minBase}" max="${city.maxBase}" /></div><p class="notice">计算口径：个人养老 8%、医疗 2%、失业 0.5%；企业侧为常见比例估算。</p></div><div class="result"><p>个人每月社保</p><p class="big js-person">--</p><dl><dt>企业每月成本</dt><dd class="js-company">--</dd><dt>合计缴费</dt><dd class="js-total">--</dd><dt>使用基数</dt><dd class="js-base">--</dd></dl></div></section>`}
function fundCalc(city){return `<section class="card calculator" data-calculator="fund" data-min="${city.fundMin}" data-max="${city.fundMax}"><div><h2>${city.name}公积金计算器</h2><p class="muted">输入缴费基数和比例，估算个人与单位每月公积金缴存金额。</p><div class="form-row"><label>公积金缴费基数</label><input name="base" type="number" value="${Math.min(city.avgSalary, city.fundMax)}" min="${city.fundMin}" max="${city.fundMax}" /></div><div class="form-row"><label>缴存比例</label><select name="rate"><option value="5">5%</option><option value="7" selected>7%</option><option value="8">8%</option><option value="10">10%</option><option value="12">12%</option></select></div></div><div class="result"><p>个人每月缴存</p><p class="big js-person">--</p><dl><dt>单位每月缴存</dt><dd class="js-company">--</dd><dt>月合计入账</dt><dd class="js-total">--</dd></dl></div></section>`}
function generalCalculator(kind){
  const today = new Date().toISOString().slice(0,10);
  const next = new Date(Date.now()+30*86400000).toISOString().slice(0,10);
  const blocks = {
    bonus: `<section class="card calculator" data-calculator="bonus"><div><h2>年终奖个税计算器</h2><div class="form-row"><label>全年一次性奖金</label><input name="bonus" type="number" value="30000" /></div></div><div class="result"><p>税后奖金</p><p class="big js-net">--</p><dl><dt>预计个税</dt><dd class="js-tax">--</dd><dt>综合税负</dt><dd class="js-rate">--</dd></dl></div></section>`,
    retirement: `<section class="card calculator" data-calculator="retirement"><div><h2>退休年龄计算器</h2><div class="form-row"><label>出生年份</label><input name="year" type="number" value="1990" /></div><div class="form-row"><label>出生月份</label><input name="month" type="number" value="6" min="1" max="12" /></div><div class="form-row"><label>身份类型</label><select name="type"><option value="male">男性职工</option><option value="female_cadre">女性干部/管理岗</option><option value="female_worker">女性工人/普通岗</option></select></div></div><div class="result"><p>预计退休时间</p><p class="big js-retire">--</p><dl><dt>估算退休年龄</dt><dd class="js-age">--</dd></dl></div></section>`,
    mortgage: `<section class="card calculator" data-calculator="mortgage"><div><h2>房贷计算器</h2><div class="form-row"><label>贷款金额（万元）</label><input name="amount" type="number" value="100" /></div><div class="form-row"><label>贷款年限</label><input name="years" type="number" value="30" /></div><div class="form-row"><label>年利率（%）</label><input name="rate" type="number" value="3.45" step="0.01" /></div></div><div class="result"><p>等额本息月供</p><p class="big js-monthly">--</p><dl><dt>总利息</dt><dd class="js-interest">--</dd><dt>总还款</dt><dd class="js-total">--</dd></dl></div></section>`,
    carLoan: `<section class="card calculator" data-calculator="carLoan"><div><h2>车贷计算器</h2><div class="form-row"><label>贷款金额</label><input name="amount" type="number" value="100000" /></div><div class="form-row"><label>贷款期数（月）</label><input name="months" type="number" value="36" /></div><div class="form-row"><label>年利率（%）</label><input name="rate" type="number" value="4.8" step="0.01" /></div></div><div class="result"><p>预计月供</p><p class="big js-monthly">--</p><dl><dt>总利息</dt><dd class="js-interest">--</dd><dt>总还款</dt><dd class="js-total">--</dd></dl></div></section>`,
    deposit: `<section class="card calculator" data-calculator="deposit"><div><h2>存款利息计算器</h2><div class="form-row"><label>本金</label><input name="amount" type="number" value="100000" /></div><div class="form-row"><label>期限（年）</label><input name="years" type="number" value="3" /></div><div class="form-row"><label>年利率（%）</label><input name="rate" type="number" value="2" step="0.01" /></div></div><div class="result"><p>预计利息</p><p class="big js-interest">--</p><dl><dt>本息合计</dt><dd class="js-total">--</dd></dl></div></section>`,
    compound: `<section class="card calculator" data-calculator="compound"><div><h2>复利计算器</h2><div class="form-row"><label>初始本金</label><input name="amount" type="number" value="10000" /></div><div class="form-row"><label>每月投入</label><input name="monthly" type="number" value="1000" /></div><div class="form-row"><label>投资年限</label><input name="years" type="number" value="10" /></div><div class="form-row"><label>年化收益率（%）</label><input name="rate" type="number" value="5" step="0.1" /></div></div><div class="result"><p>期末资产</p><p class="big js-total">--</p><dl><dt>累计投入</dt><dd class="js-invested">--</dd><dt>预计收益</dt><dd class="js-profit">--</dd></dl></div></section>`,
    workingDays: `<section class="card calculator" data-calculator="workingDays"><div><h2>工作日计算器</h2><div class="form-row"><label>开始日期</label><input name="start" type="date" value="${today}" /></div><div class="form-row"><label>结束日期</label><input name="end" type="date" value="${next}" /></div></div><div class="result"><p>工作日数量</p><p class="big js-days">--</p><p class="muted">暂未扣除法定节假日，后续可接入节假日数据表。</p></div></section>`,
    age: `<section class="card calculator" data-calculator="age"><div><h2>年龄计算器</h2><div class="form-row"><label>出生日期</label><input name="birth" type="date" value="1990-01-01" /></div></div><div class="result"><p>周岁</p><p class="big js-age">--</p><dl><dt>虚岁</dt><dd class="js-virtual">--</dd><dt>出生至今天数</dt><dd class="js-days">--</dd></dl></div></section>`,
    bmi: `<section class="card calculator" data-calculator="bmi"><div><h2>BMI 计算器</h2><div class="form-row"><label>身高（厘米）</label><input name="height" type="number" value="170" /></div><div class="form-row"><label>体重（公斤）</label><input name="weight" type="number" value="65" /></div></div><div class="result"><p>BMI</p><p class="big js-bmi">--</p><dl><dt>状态</dt><dd class="js-status">--</dd></dl></div></section>`
  };
  return blocks[kind] || "";
}
function homePage(){
  const cityLinks = cities.slice(0, 12).map(c => `<a href="/cities/${c.slug}/salary-tax-calculator/">${c.name}税后工资计算器</a>`).join("");
  const toolLinks = tools.map(t => `<a href="/tools/${t.slug}/">${t.name}<br><span class="muted">${t.short}</span></a>`).join("");
  return layout({route:"/",title:"秒算工资工具 - 城市税后工资、社保公积金、个税计算器",description:"秒算工资工具提供城市税后工资计算器、社保计算器、公积金计算器、年终奖个税、退休年龄、房贷车贷等在线工具。",keywords:["税后工资计算器","社保计算器","公积金计算器","个税计算器"],body:`<section class="hero"><div class="container"><h1>城市工资税后、社保公积金，一站秒算</h1><p>面向百度、360、搜狗、微信搜一搜的中文程序化 SEO 工具站 MVP。先覆盖核心城市和高频工具，后续可扩展到 300+ 城市长尾页面。</p><div class="hero-actions"><a class="btn light" href="/cities/">按城市查询</a><a class="btn ghost" href="/tools/">查看全部工具</a></div></div></section><main class="container section"><div class="grid two"><section class="card"><h2>热门城市</h2><div class="list">${cityLinks}</div></section><section class="card"><h2>热门工具</h2><div class="list">${toolLinks}</div></section></div>${adSlot()}<section class="card content"><h2>为什么先做城市工资站？</h2><p>“北京税后工资计算器”“上海社保计算器”“深圳公积金计算器”这类关键词有明确搜索意图，适合批量扩展页面、自动生成 sitemap 和内链，不依赖人工推广。</p></section></main>`})
}
function cityIndex(){return layout({route:"/cities/",title:"城市工资计算器大全",description:"按城市查询税后工资、社保、公积金估算工具。",keywords:["城市工资计算器","税后工资","社保基数"],body:`<main class="container section">${breadcrumb([{label:"城市工资"}])}<h1>城市工资计算器大全</h1><p class="muted">已覆盖 ${cities.length} 个核心城市，每个城市包含税后工资、社保、公积金三个长尾页面。</p><div class="grid">${cities.map(c=>`<article class="card"><h2>${c.name}</h2><p>${c.province} · 参考平均工资 ${c.avgSalary} 元</p><p><a class="btn" href="/cities/${c.slug}/salary-tax-calculator/">税后工资</a></p><p><a href="/cities/${c.slug}/social-security-calculator/">社保计算器</a> · <a href="/cities/${c.slug}/housing-fund-calculator/">公积金计算器</a></p></article>`).join("")}</div></main>`})}
function toolsIndex(){return layout({route:"/tools/",title:"实用计算器工具大全",description:"年终奖个税、退休年龄、房贷、车贷、存款、复利、工作日、年龄、BMI 等在线计算器。",keywords:["在线计算器","年终奖个税","房贷计算器"],body:`<main class="container section">${breadcrumb([{label:"实用工具"}])}<h1>实用计算器工具大全</h1><div class="grid">${tools.map(t=>`<article class="card"><span class="pill">${t.category}</span><h2><a href="/tools/${t.slug}/">${t.name}</a></h2><p>${t.short}</p></article>`).join("")}</div></main>`})}
function cityPage(city, type){
  const title = `${city.name}${type.label}2026 - ${city.name}工资社保公积金在线估算`;
  const desc = `${city.name}${type.label}，支持按工资、缴费基数和公积金比例估算到手工资、社保或公积金，适合查询${city.name}工资税后和五险一金。`;
  const calc = type.kind === "salary" ? salaryCalc(city) : type.kind === "social" ? socialCalc(city) : fundCalc(city);
  const related = cityToolTypes.filter(x=>x.slug!==type.slug).map(x=>`<a href="/cities/${city.slug}/${x.slug}/">${city.name}${x.label}</a>`).join("");
  return layout({route:`/cities/${city.slug}/${type.slug}/`,title,description:desc,keywords:[`${city.name}${type.label}`,`${city.name}税后工资`,`${city.name}社保`,`${city.name}公积金`],schema:{"@context":"https://schema.org","@type":"SoftwareApplication",name:title,applicationCategory:"FinanceApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"CNY"}},body:`<main class="container section">${breadcrumb([{label:"城市工资",href:"/cities/"},{label:city.name}])}<h1>${city.name}${type.label}</h1><p class="muted">${desc}</p>${calc}${adSlot()}<section class="card content"><h2>${city.name}${type.label}说明</h2><p>${cityNote}</p><p>本页按个人常见缴费比例和个税速算扣除数做估算，适合求职谈薪、工资核对和预算规划。正式申报请以公司 HR、税务局、社保局和公积金中心结果为准。</p><h2>相关工具</h2><div class="list">${related}<a href="/tools/annual-bonus-tax/">年终奖个税计算器</a><a href="/tools/retirement-age/">退休年龄计算器</a></div></section>${faq([[`${city.name}${type.label}结果准确吗？`,`本工具用于快速估算，社保基数、专项附加扣除和地方政策会影响最终结果。`],[`税后工资为什么和公司工资条不同？`,`工资条可能包含专项附加扣除、补充公积金、商业保险、迟到扣款、奖金等项目，本页先按标准模型估算。`]])}</main>`})
}
function toolPage(tool){return layout({route:`/tools/${tool.slug}/`,title:`${tool.name}在线计算`,description:`${tool.name}，${tool.short}，无需注册，打开即可使用。`,keywords:[tool.name,tool.category,"在线计算器"],schema:{"@context":"https://schema.org","@type":"SoftwareApplication",name:tool.name,applicationCategory:"UtilityApplication",operatingSystem:"Web",offers:{"@type":"Offer",price:"0",priceCurrency:"CNY"}},body:`<main class="container section">${breadcrumb([{label:"实用工具",href:"/tools/"},{label:tool.name}])}<h1>${tool.name}</h1><p class="muted">${tool.short}。本工具为免费在线估算工具，适合日常快速参考。</p>${generalCalculator(tool.kind)}${adSlot()}<section class="card content"><h2>${tool.name}使用说明</h2><p>输入核心参数后，页面会自动计算结果。为了保持加载速度和隐私，计算过程在浏览器本地完成，不需要上传个人数据。</p><h2>相关城市工资工具</h2><div class="list">${cities.slice(0,8).map(c=>`<a href="/cities/${c.slug}/salary-tax-calculator/">${c.name}税后工资计算器</a>`).join("")}</div></section>${faq([[`${tool.name}需要注册吗？`,`不需要。页面打开即可使用。`],[`计算结果可以作为最终依据吗？`,`不建议。本工具适合估算和对比，最终结果请以官方和机构出具的数据为准。`]])}</main>`})}
function legalPage(route,title,content){return layout({route,title,description:`${siteName}${title}`,body:`<main class="container section">${breadcrumb([{label:title}])}<article class="card content"><h1>${title}</h1>${content}</article></main>`})}
function build(){
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir,"assets"), { recursive: true });
  fs.copyFileSync(path.join(root,"src/assets/style.css"), path.join(outDir,"assets/style.css"));
  fs.copyFileSync(path.join(root,"src/assets/app.js"), path.join(outDir,"assets/app.js"));
  const publicDir = path.join(root, "public");
  if (fs.existsSync(publicDir)) fs.cpSync(publicDir, outDir, { recursive: true });
  write("/", homePage(), 1.0, "daily");
  write("/cities/", cityIndex(), 0.9, "daily");
  write("/tools/", toolsIndex(), 0.9, "daily");
  for (const city of cities) for (const type of cityToolTypes) write(`/cities/${city.slug}/${type.slug}/`, cityPage(city,type), type.priority, "weekly");
  for (const tool of tools) write(`/tools/${tool.slug}/`, toolPage(tool), tool.priority, "weekly");
  write("/about/", legalPage("/about/","关于我们",`<p>${siteName}提供工资税后、社保公积金、个税、贷款和日期类工具，目标是用程序化 SEO 覆盖用户真实搜索需求。</p><p>当前版本为 MVP，后续会持续补充城市数据、政策更新时间和更多长尾页面。</p>`), 0.4, "monthly");
  write("/privacy/", legalPage("/privacy/","隐私政策",`<p>本站工具计算默认在浏览器本地完成，不要求用户注册，不主动收集身份证、手机号、银行卡等敏感个人信息。</p><p>后续接入广告联盟或统计工具时，可能由第三方服务按其隐私政策处理 Cookie、设备信息和访问日志。</p>`), 0.4, "yearly");
  write("/terms/", legalPage("/terms/","使用条款",`<p>本站计算结果仅供参考，不构成税务、法律、金融或人事建议。请以当地官方机构、公司 HR、银行和税务机关的正式结果为准。</p>`), 0.4, "yearly");
  write("/contact/", legalPage("/contact/","联系我们",`<p>如需反馈数据错误、合作或广告位接入，请先使用站点所有者后续提供的联系邮箱。MVP 阶段暂用占位页面。</p>`), 0.4, "monthly");
  write("/affiliate-disclosure/", legalPage("/affiliate-disclosure/","推广披露",`<p>本站后续可能加入广告联盟或 CPS 推广链接。若用户通过相关链接访问第三方服务，本站可能获得广告或推广收益。</p><p>我们会尽量保持工具内容独立，不因商业合作影响基础计算功能。</p>`), 0.4, "yearly");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`  <url><loc>${abs(p.route)}</loc><lastmod>${buildDate}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority.toFixed(2)}</priority></url>`).join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(outDir,"sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(outDir,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");
  fs.writeFileSync(path.join(outDir,"page-manifest.json"), JSON.stringify({ siteName, siteUrl, generatedAt: new Date().toISOString(), pages: pages.length, cities: cities.length, cityLongTailPages: cities.length * cityToolTypes.length, tools: tools.length }, null, 2), "utf8");
  console.log(`Built ${pages.length} HTML pages into ${outDir}`);
  console.log(`Cities: ${cities.length}, city long-tail pages: ${cities.length * cityToolTypes.length}, tools: ${tools.length}`);
}
build();
