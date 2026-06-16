# 搜索引擎收录下一步

当前站点：

```text
http://miaosuangongzi.com/
```

HTTPS 正在等待 GitHub Pages 证书生成。证书好以后，最终使用：

```text
https://miaosuangongzi.com/
```

Sitemap：

```text
https://miaosuangongzi.com/sitemap.xml
```

当前已生成 299 个页面，其中包括 94 个城市 × 3 个长尾工资页。

## Hermes 已完成

- 生成 299 个 SEO 页面。
- 生成 sitemap.xml。
- 生成 robots.txt。
- 添加 IndexNow key 文件：

```text
https://miaosuangongzi.com/a783b6b8058144ba8575c8fd26d21350.txt
```

- 添加 IndexNow 提交脚本：

```bash
npm run submit:indexnow
```

注意：IndexNow 建议等 HTTPS 证书生效后再提交。

## 用户下一步最重要：百度资源平台

百度自然搜索对中文站更重要。用户需要本人登录百度账号并添加站点。

入口：

```text
https://ziyuan.baidu.com/
```

建议步骤：

1. 打开 `https://ziyuan.baidu.com/`。
2. 登录百度账号。
3. 点击「用户中心」或「站点管理」。
4. 点击「添加网站」。
5. 网站地址填：

```text
https://miaosuangongzi.com/
```

如果 HTTPS 还未生效，就先等；不要用 http 作为最终站点。

6. 站点类型选择类似：

```text
生活服务 / 工具 / 其他
```

7. 验证方式优先选择：

```text
HTML 标签验证
```

8. 把百度给出的验证代码发给 Hermes，Hermes 负责写入首页并重新部署。
9. 验证通过后，在百度资源平台提交 sitemap：

```text
https://miaosuangongzi.com/sitemap.xml
```

## 第二优先：Bing Webmaster

入口：

```text
https://www.bing.com/webmasters/
```

用途：Bing、部分海外搜索和 IndexNow。

添加站点：

```text
https://miaosuangongzi.com/
```

验证方式也优先选 HTML meta 标签，把代码发给 Hermes。

## 第三优先：Google Search Console

入口：

```text
https://search.google.com/search-console
```

添加 URL 前缀：

```text
https://miaosuangongzi.com/
```

验证方式选 HTML 标签，把代码发给 Hermes。

## 不要做

- 不要刷点击。
- 不要买垃圾外链。
- 不要短时间提交大量垃圾内容。
- 不要在广告未审核前放诱导点击文案。
