# AChaoBlog

这是一个无需构建步骤的 GitHub Pages 静态博客。当前 UI 参考了 [blog.ddlyt.top](https://blog.ddlyt.top/) 的布局气质：拼图纹理背景、顶部极简导航、欢迎区、分类条、文章列表和右侧信息卡。

## 发布

1. 将本目录内容提交并推送到 GitHub。
2. 在仓库 Settings -> Pages 中选择 `Deploy from a branch`，分支选 `main`，目录选 `/root`。
3. 等待 Pages 部署完成后访问站点。

如果仓库位于 GitHub 账号 `AChaoRepo` 下，并命名为 `AChaoRepo.github.io`，个人主页地址通常是 `https://achaorepo.github.io`。

## 编辑文章

- 首页文章列表在 `index.html` 的 `#posts` 区域。
- 归档列表在 `archive.html`。
- 文章正文在 `posts/*.html`。
- 站点样式在 `assets/styles.css`，交互逻辑在 `assets/script.js`。
