# TechDoors

Blog kỹ thuật cá nhân bằng tiếng Việt tại **https://techdoors.io**. Docusaurus **3.10.2**, React 19, TypeScript strict và CSS Modules; xuất thành website tĩnh, không backend, database hay dịch vụ trả phí. Giao diện editorial ưu tiên nền sáng, có dark mode và tìm kiếm local.

**Cấu hình phát hành:** mã nguồn đã merge vào `main`, GitHub Pages dùng GitHub Actions và custom domain `techdoors.io`. DNS được quản lý tại iNET. Chủ repo đã bật `PAGES_DEPLOY_APPROVED`; mỗi lần deploy vẫn cần phê duyệt environment `github-pages`.

## Chạy local

Yêu cầu Node.js 24 LTS (xem `.nvmrc`) và npm.

```sh
npm ci
npm start
```

Mở http://127.0.0.1:3000. Docusaurus hỗ trợ hot reload cho nội dung và giao diện. Tìm kiếm local được tạo ở bước build, nên hãy kiểm tra chức năng này bằng bản production preview:

```sh
npm run build
npm run serve
```

`build/` là toàn bộ artifact để host. `npm run build` chỉ tạo file local, không publish và không gọi GitHub Pages.

## Kiểm chứng

```sh
npx playwright install chromium
npm run typecheck
npm run build
npm run check:site
npm run test:e2e
```

Hoặc dùng `npm run verify` sau khi đã cài Chromium. Trên Linux CI, dùng `npx playwright install --with-deps chromium`.

Xem [bản ghi kiểm chứng và phạm vi đã kiểm tra](docs/validation.md).

- TypeScript strict và Docusaurus kiểm tra liên kết/anchor khi build.
- `check:site` kiểm tra HTML, liên kết nội bộ, ảnh, canonical, metadata, sitemap, RSS/Atom và CNAME trong artifact.
- Playwright kiểm tra desktop/mobile, điều hướng, tìm kiếm tiếng Việt, light/dark và lưu lựa chọn, code copy, TOC, 404, lỗi console và a11y với axe.
- `playwright-report/` và `test-results/` là artifact local, không commit.

## Viết và publish bài

1. Copy `templates/blog-post.md` vào `blog/YYYY-MM-DD-ten-bai/index.md`. Dùng `.mdx` khi cần JSX; không import package chỉ để định dạng văn bản đơn giản.
2. Điền `title`, `description`, `date` có timezone, `slug`, `authors`, `tags`. `image` là tùy chọn; ảnh mặc định là `static/img/og-default.png` (1200 × 630).
3. Khai báo tag mới trong `blog/tags.yml`, tác giả mới trong `blog/authors.yml`. Tag trong front matter dùng key YAML, ví dụ `ci-cd`.
4. Đặt đoạn mở đầu trước `<!-- truncate -->`. Bài nháp dùng `draft: true` và sẽ không được đưa vào production build.
5. Dùng liên kết nội bộ `/blog/ten-bai/` hoặc liên kết Markdown tương đối. Cất ảnh riêng của bài ngay cạnh file Markdown.
6. Chạy các kiểm tra, commit trên feature branch rồi mở PR vào `main`. Merge/publish production cần chủ repo phê duyệt theo hướng dẫn deploy.

Trang chủ và bài liên quan tự lấy nội dung từ blog plugin. Phân trang là **6 bài/trang**; với một bài hiện tại, không hiển thị nút sang trang không tồn tại. RSS ở `/blog/rss.xml`, Atom ở `/blog/atom.xml`; reading time, tags, TOC và code highlighting do Docusaurus xử lý.

## Chỉnh sửa website

```text
blog/                    Bài Markdown/MDX, tác giả và tags
templates/blog-post.md   Khung bài viết tái sử dụng
src/pages/               Home, About, Projects
src/components/          PostCard, Portal, Arrow
src/theme/               Blog listing, related content, footer, 404
src/css/custom.css       Font local, màu, typography, theme và a11y
plugins/content.ts       Dữ liệu bài mới/bài liên quan từ blog plugin
static/                  CNAME, robots, favicon, ảnh Open Graph
scripts/                 Kiểm tra artifact và tạo ảnh Open Graph
tests/                   Playwright + axe
.github/workflows/       PR validation và deploy có phê duyệt
docs/deployment.md       GitHub Pages, DNS iNET, HTTPS và rollback
```

- Tiểu sử chờ nội dung: `src/pages/about.tsx`.
- Khung dự án chờ nội dung: `src/pages/projects.tsx`. Không đổi chúng thành tuyên bố về dự án thật khi chưa có thông tin xác thực.
- URL, SEO, navigation, Prism và cấu hình blog: `docusaurus.config.ts`.
- Font được đóng gói local, không tải từ Google Fonts. Không có analytics hay network API cho tìm kiếm.
- Plugin `@cmfcmf/docusaurus-search-local` 2.0.1 tạo index tĩnh với tokenizer tiếng Việt. Giao diện `src/theme/SearchBar` dùng `dialog` native và liên kết thông thường để hỗ trợ bàn phím và tránh control lồng nhau trong UI mặc định. Adapter kiểu dữ liệu ở `src/types/search.d.ts` cần được kiểm tra khi nâng plugin. Index và bộ tìm kiếm chỉ được tải khi mở hộp tìm kiếm; không gọi Algolia hoặc dịch vụ bên ngoài. Tìm có dấu và thuật ngữ kỹ thuật được kiểm tra; chưa cam kết tìm không dấu tương đương.
- Muốn tạo lại ảnh Open Graph từ thiết kế bằng code: `npm run generate:og` (cần Chromium), sau đó commit PNG mới.
- Chỉ locale `vi` được bật. Khi có bản dịch thật, thêm `en` vào `i18n.locales`, thêm locale config và bản dịch theo quy ước Docusaurus. Chưa có trang English hay language switcher giả.

## CI/CD và domain

Repo: https://github.com/branlabs/techdoors-blog (public).

PR vào `main` chạy typecheck, production build, kiểm tra artifact và Playwright. Workflow deploy chỉ nhận sự kiện **PR đã merge vào `main`**, và chỉ chạy khi chủ repo đã bật biến `PAGES_DEPLOY_APPROVED=true`. Job phát hành dùng environment `github-pages`, cần cấu hình required reviewer trước khi bật biến này. Push trực tiếp vào `main` không deploy.

Đọc **[hướng dẫn GitHub Pages, iNET DNS và HTTPS](docs/deployment.md)** khi vận hành hoặc thay đổi cấu hình production. Workflow không tự sửa DNS; GitHub quản lý chứng chỉ HTTPS. Không cần PAT hoặc secret tự tạo; deploy dùng `GITHUB_TOKEN` và OIDC ngắn hạn của Actions.

Các security override trong `package.json` ghim bản vá `tinypool` và `serialize-javascript`, cùng bản `uuid` tương thích cho `sockjs`. Kiểm tra lại chúng bằng build/browser tests và `npm audit` khi nâng Docusaurus. Chỉ cài các plugin/theme cần dùng; không cài preset chứa các tích hợp analytics và search bên ngoài không sử dụng.
