# 站点上线前，用户只需要做的事

当前 MVP 已在本机完成，目录：

```text
C:\Users\VersaPro\city-salary-tools
```

## 现在状态

- 本地已生成 65 个 HTML 页面。
- 本地检查通过：sitemap、robots、内部链接、JS 语法都正常。
- GitHub Pages 自动部署工作流已写好。
- 但当前电脑上的 GitHub CLI 未登录，所以还没有推送到远程仓库。

## 第一步：先部署到 GitHub Pages

需要用户完成 GitHub 授权，二选一：

### 方式 A：在电脑上登录 GitHub CLI

1. 打开电脑上的 Git Bash 或终端。
2. 输入：

```bash
gh auth login
```

3. 按提示选择：
   - GitHub.com
   - HTTPS
   - Login with a web browser
4. 浏览器打开后登录你的 GitHub 账号。
5. 授权完成后告诉 Hermes：

```text
GitHub 登录好了，继续部署城市工资站
```

### 方式 B：提供 GitHub Token

如果不想网页登录，可以生成 GitHub Token，权限至少需要：

- repo
- workflow
- pages

然后发给 Hermes 处理。注意：Token 是敏感信息，优先建议用方式 A。

## 第二步：买域名

等 GitHub Pages 临时地址能访问后，再买域名。域名建议围绕：

- miaosuangongzi.com
- gongzijisuanqi.com
- shuishougongzi.com
- miaosuan365.com

最终以阿里云可购买结果为准。

## 第三步：备案

不急，先不备案也能用 GitHub Pages 上线测试。

后续如果要接百度联盟、腾讯优量汇或国内广告，再按阿里云备案流程走。备案时 Hermes 会一步一步指导填写。

## 第四步：广告/联盟

流量起来后再做：

- 百度联盟
- 腾讯优量汇
- 京东联盟
- 多多进宝
- 美团联盟

用户本人只做实名和收款；Hermes 负责接广告位代码和推广链接。
