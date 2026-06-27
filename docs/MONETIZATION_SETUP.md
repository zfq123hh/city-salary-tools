# 变现接入说明

当前站点已经具备广告/合作接入的代码结构，但是否真正产生收入取决于搜索收录、真实访问量、广告账号审核和广告平台填充率。

## 当前现实状态

- Google Search Console：已成功读取 `/sitemap.xml` 并发现 1145+ 页面，但目前 Google 搜索点击几乎为 0。
- Microsoft Clarity：已有少量访问记录，但停留短、点击少，不能视为稳定商业流量。
- 因此：现在应先完成广告技术准备和收录增长，不应承诺收入。

## Google AdSense 接入变量

在 GitHub 仓库变量（Repository variables）中设置以下值后，GitHub Pages 构建会自动把广告代码和 `ads.txt` 生成进 `dist/`：

| 变量 | 示例 | 用途 |
|---|---|---|
| `ADSENSE_CLIENT` | `ca-pub-1234567890123456` | AdSense 发布商客户端 ID，用于页面 `<head>` 自动广告脚本和 `google-adsense-account` meta |
| `ADSENSE_SLOT` | `1234567890` | 可选，展示广告单元 slot；不填时只接入 Auto Ads 脚本 |
| `ADSENSE_PUBLISHER_ID` | `pub-1234567890123456` | 可选；不填时会从 `ADSENSE_CLIENT` 自动推导并生成 `ads.txt` |
| `CONTACT_EMAIL` | `name@example.com` | 可选；用于联系页和广告合作页展示商务联系邮箱 |

## 生成结果

设置有效 `ADSENSE_CLIENT` 后：

- 页面头部会出现：
  - `meta name="google-adsense-account"`
  - `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` 脚本
- 若能推导出 `pub-...`，会生成：
  - `/ads.txt`
- 若同时设置 `ADSENSE_SLOT`，页面中的广告合作位会渲染为 `<ins class="adsbygoogle">` 展示广告单元。

## 不要做的事

- 不要伪造点击。
- 不要买垃圾流量。
- 不要在无真实访问时承诺赞助曝光。
- 不要把无效的 `ca-pub` 或 `pub` 写进代码；无效 ID 会导致广告不展示或审核失败。

## 判断是否值得正式接广告

建议满足以下任一条件后再正式投入广告优化：

1. Google / 百度 / Bing 自然搜索每天稳定带来真实点击；
2. Clarity 最近 7 天有明显真实用户行为：多页访问、点击、停留时间提升；
3. 百度资源平台出现稳定索引量和搜索展现；
4. AdSense/百度联盟后台站点审核通过。

目前更优先的任务是：百度收录、搜索曝光、页面内容质量和内链优化。不要为了“看起来能赚钱”而提前制造无意义广告位。
