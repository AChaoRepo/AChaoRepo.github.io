# AChao Blog

这是一个无需构建步骤的 GitHub Pages 静态博客。仓库根目录的 `index.html` 是首页入口，`assets/` 存放样式、脚本和视觉资源，`posts/` 存放文章页。

## 发布

1. 将本目录内容提交并推送到 GitHub。
2. 在仓库 Settings -> Pages 中选择 `Deploy from a branch`，分支选 `main`，目录选 `/root`。
3. 等待 Pages 部署完成后访问站点。

要让地址是 `https://achao.github.io`，仓库需要位于 GitHub 账号或组织 `achao` 下，并命名为 `achao.github.io`。如果推送到当前远程 `AChaoRepo/achao.github.io`，GitHub Pages 默认地址通常会是 `https://achaorepo.github.io/achao.github.io/`。

## 编辑文章

- 首页文章卡片在 `index.html` 的 `#posts` 区域。
- 归档列表在 `archive.html`。
- 文章正文在 `posts/*.html`。
- 站点样式在 `assets/styles.css`，交互逻辑在 `assets/script.js`。
