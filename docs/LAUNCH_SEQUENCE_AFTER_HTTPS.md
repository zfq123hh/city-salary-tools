# miaosuangongzi.com 上线后续顺序

当前状态：

- GitHub Pages 自定义域名已绑定。
- DNS 已正确解析到 GitHub Pages。
- HTTP 可访问。
- HTTPS 证书等待 GitHub Pages 签发。
- 百度验证文件已部署：`/baidu_verify_codeva-i03h89ROGe.html`。
- 当前站点已生成 299 个 SEO 页面。

## 等 HTTPS 时可以先做的事

### 1. 保持 DNS 不变

不要删除或修改以下记录：

| 类型 | 主机记录 | 值 |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | zfq123hh.github.io |

### 2. 准备百度资源平台

HTTPS 生效后，回到百度资源平台第三步：

```text
验证网站
```

点击：

```text
完成验证
```

验证通过后，提交 sitemap：

```text
https://miaosuangongzi.com/sitemap.xml
```

### 3. 准备其他搜索平台账号

后续建议添加：

- Bing Webmaster Tools：`https://www.bing.com/webmasters/`
- Google Search Console：`https://search.google.com/search-console`
- 360 站长平台：`https://zhanzhang.so.com/`
- 搜狗站长平台：如可用则添加

这些平台一般也会给 HTML meta 标签或文件验证，验证码发给 Hermes 处理。

### 4. 准备备案/广告资料

广告联盟通常会看站点真实性、内容量、联系方式和备案/资质要求。先准备：

- 域名：`miaosuangongzi.com`
- 站点名称：`秒算工资工具`
- 站点类型：工具服务及在线查询
- 站点简介：提供城市税后工资、社保、公积金、个税、贷款和日期类在线计算工具
- 身份证实名信息
- 手机号
- 收款账户
- 可用邮箱

## 必须等 HTTPS 后才能做的事

### 1. 百度完成验证

当前百度添加的是：

```text
https://miaosuangongzi.com/
```

所以必须等 HTTPS 证书正常后再点「完成验证」。

### 2. 提交正式 sitemap

最终 sitemap 用 HTTPS：

```text
https://miaosuangongzi.com/sitemap.xml
```

不要提交 HTTP 版作为最终版本。

### 3. IndexNow 提交

已准备好脚本：

```bash
npm run submit:indexnow
```

等 HTTPS 可用后再提交。

## Hermes 自动任务

Hermes 已设置 HTTPS 检查任务。证书生效后会自动尝试：

1. 开启 GitHub Pages 强制 HTTPS。
2. 提交 IndexNow。
3. 通知用户继续百度验证。

## 后续变现顺序

建议顺序：

1. 百度资源平台验证。
2. 提交 sitemap。
3. 等待收录。
4. 每周扩展更多城市和长尾工具页。
5. 有自然搜索流量后申请广告联盟。
6. 如果广告联盟要求 ICP，再迁移到国内静态托管或云服务器并办理备案。

不要一开始就为了广告买服务器；先让搜索收录跑起来，再决定是否迁移。
