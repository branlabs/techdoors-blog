# Bản ghi kiểm chứng — 06/11/2026

Môi trường local: Windows, Node.js 24.14.1, npm 11.11.0. Phiên bản Docusaurus 3.10.2; browser tự động là Chromium của Playwright 1.65.0.

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run verify` | Qua: TypeScript strict, production build, kiểm tra artifact, 10 browser tests |
| HTML và liên kết | 19 trang HTML, 440 liên kết/ảnh nội bộ; không có liên kết hoặc anchor bị hỏng trong artifact |
| SEO và phân phối nội dung | Canonical apex HTTPS, Open Graph PNG 1200 × 630, 18 URL sitemap, RSS và Atom có bài chào mừng |
| Desktop / mobile | Chromium 1440 × 1000 và mobile emulation 390 × 844; không tràn ngang ở các luồng được kiểm tra |
| Responsive bổ sung | Home và article ở 320, 768 và 1024 px đều không tràn ngang |
| A11y | axe với WCAG 2 A/AA và 2.1 AA trên các route kiểm thử; light/dark, dark article và hộp tìm kiếm đều qua |
| Tương tác | Navigation, skip link, lưu lựa chọn theme, TOC desktop/mobile, syntax highlighting, copy code và phục hồi từ 404 đều qua |
| Tìm kiếm | Từ khóa có dấu và thuật ngữ Kubernetes; Ctrl/⌘ K, Esc khi đã nhập nội dung, phím mũi tên và Enter; trạng thái không có kết quả |
| Console và network | Không có console error/page error trong các luồng kiểm thử; tìm kiếm không tạo HTTP request đến dịch vụ ngoài |
| Dev server | `npm start` phục vụ Home và bài Markdown; không có page error trong smoke test |
| Dependency | `npm audit --audit-level=high`: 0 vulnerabilities tại thời điểm kiểm tra |

## Kiểm chứng thêm với nội dung tạm

Một build riêng ngoài artifact bàn giao sử dụng sáu bài MDX tạm và một bài nháp để kiểm tra:

- Phân trang 6 bài ở trang đầu, 1 bài ở trang hai; liên kết đi và quay lại đúng.
- JSX trong MDX được render.
- Bài nháp không có trong build hoặc RSS.
- Nội dung liên quan tự xuất hiện khi có bài cùng tag.
- RSS chứa đúng các bài đã xuất bản.

Các file nguồn tạm đã được xóa. Repo và artifact bàn giao chỉ có một bài thật: **Chào mừng đến với TechDoors**.

## Phạm vi kiểm chứng và phát hành

Các kiểm tra local phía trên được thực hiện trước phát hành. Sau khi chủ repo/domain phê duyệt ngày 06/11/2026, PR #1 đã merge, GitHub Pages đã deploy thành công và DNS iNET đã được cập nhật. Tham khảo [deployment.md](deployment.md) cho cấu hình và cách kiểm tra TLS/redirect sau khi GitHub cấp chứng chỉ.

Mobile được kiểm tra bằng Chromium emulation; chưa xác nhận riêng bằng thiết bị iOS, Safari hoặc Firefox. Kiểm tra tự động không thay thế hoàn toàn trải nghiệm với trình đọc màn hình và thiết bị thật.
