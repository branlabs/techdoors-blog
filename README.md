# TechDoors

**Ghi chép về những hệ thống mình xây dựng, vận hành và học hỏi.**

TechDoors là blog kỹ thuật cá nhân của **Brandon**. Mình viết về Linux, hạ tầng, ảo hóa và những câu hỏi xuất hiện trong lúc làm việc, thử nghiệm hoặc đơn giản là vì tò mò.

[Đọc blog](https://techdoors.io/) · [Bài viết](https://techdoors.io/blog/) · [Giới thiệu](https://techdoors.io/about/)

## Bắt đầu từ đâu?

**[Chiếc máy tính vô hình](https://techdoors.io/blog/the-invisible-computer/)** — bài đầu tiên của series [Under the Hood](https://techdoors.io/blog/tags/under-the-hood/), kể cách QEMU và KVM giúp một chiếc máy tính chạy thêm một hệ điều hành bên trong nó.

Ngoài bài viết, trang [Dự án](https://techdoors.io/projects/) là nơi mình ghi lại các thử nghiệm và những điều đã kiểm chứng.

## Chạy local

Cần **Node.js 24 LTS** và npm.

```bash
npm ci
npm start
```

Mở `http://127.0.0.1:3000/`. Muốn xem bản production build, bao gồm tìm kiếm nội bộ:

```bash
npm run build
npm run serve
```

## Viết bài và kiểm tra

Bài viết nằm trong `blog/` dưới dạng Markdown hoặc MDX. Tiêu đề có thể bằng tiếng Việt, còn `slug` ưu tiên tiếng Anh để dùng chung khi có phiên bản song ngữ. Giao diện chung hiện vẫn dùng tiếng Việt. Bài đầu tiên đã có bản English tại [The Invisible Computer](https://techdoors.io/en/blog/the-invisible-computer/), với nút chuyển VI / EN ngay trong bài. Chưa bật chuyển ngôn ngữ toàn website khi các trang khác chưa được viết bằng tiếng Anh.

Dùng [mẫu bài viết](templates/blog-post.md) và khai báo tác giả, thẻ chủ đề trong `blog/authors.yml`, `blog/tags.yml`. Bài chưa sẵn sàng có thể dùng `draft: true`; bài chỉ muốn giữ đường dẫn trực tiếp có thể dùng `unlisted: true`.

Trước khi mở pull request:

```bash
npx playwright install chromium
npm run verify
```

## Công nghệ và phát hành

Website được xây bằng **Docusaurus 3, React 19 và TypeScript**, xuất ra trang tĩnh và triển khai qua **GitHub Pages**. Giao diện hỗ trợ sáng/tối, tìm kiếm nội bộ, RSS/Atom và đọc trên thiết bị di động.

Thay đổi được kiểm tra qua GitHub Actions trước khi merge. Việc triển khai production vẫn tuân theo bước phê duyệt của chủ repository.

Chi tiết dành cho người phát triển và vận hành:

- [Cấu trúc và quy ước trong dự án](AGENTS.md)
- [Quy trình triển khai, domain và rollback](docs/deployment.md)
- [Nhật ký kiểm chứng ban đầu (06/11/2026)](docs/validation.md)
