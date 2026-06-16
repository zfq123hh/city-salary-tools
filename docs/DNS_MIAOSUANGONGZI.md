# 阿里云 DNS 设置：miaosuangongzi.com

目标：把 `miaosuangongzi.com` 绑定到 GitHub Pages 站点。

## 需要添加的 DNS 记录

在阿里云域名解析里添加以下记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 默认 |
| A | @ | 185.199.109.153 | 默认 |
| A | @ | 185.199.110.153 | 默认 |
| A | @ | 185.199.111.153 | 默认 |
| CNAME | www | zfq123hh.github.io | 默认 |

## 阿里云操作入口

```text
https://dns.console.aliyun.com
```

## 操作步骤

1. 打开阿里云 DNS 控制台。
2. 找到域名：`miaosuangongzi.com`。
3. 点击域名右侧的「解析设置」。
4. 点击「添加记录」。
5. 按上表添加 4 条 A 记录和 1 条 CNAME 记录。
6. 如果已有同名的 `@` 或 `www` 记录，先暂停或删除冲突记录，再添加上面的记录。

## 验证命令

```bash
nslookup miaosuangongzi.com
nslookup www.miaosuangongzi.com
```

期望：

- `miaosuangongzi.com` 返回 GitHub Pages 的 4 个 IP。
- `www.miaosuangongzi.com` 指向 `zfq123hh.github.io`。

## 备注

GitHub Pages 自定义域名和 CNAME 已由 Hermes 配置；DNS 生效通常需要几分钟到数小时。HTTPS 证书签发可能也需要等待。
