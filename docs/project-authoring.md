# Viết và cập nhật dự án trên TechDoors

## Bốn lớp nội dung

- Card ở `/projects/` là lối vào, không phải toàn bộ nội dung dự án.
- Project Hub ở `/projects/<id>/` phản ánh trạng thái hiện tại, kiến trúc logic, kết quả có phạm vi, milestone và bước tiếp theo.
- Nhật ký ở `/projects/<id>/updates/` giữ lịch sử. Thêm mục mới ở đầu; không ghi đè kết quả cũ để làm như lúc nào dự án cũng đã thành công.
- Bài trong `blog/` là một câu chuyện hoặc phân tích tại thời điểm xuất bản. Bài hành trình giữ ngày và số liệu lịch sử; dẫn tới hub để xem hiện trạng mới.

## Nguồn dữ liệu và file cần sửa

Metadata chung ở `src/data/projects.ts`: tên, mô tả card, trạng thái, ngày cập nhật nội dung và các URL. Trang danh sách và phần metadata hub dùng cùng nguồn này. Đây là registry dự án, không phải danh sách bài blog thứ hai. Homepage và bài liên quan vẫn lấy bài từ plugin blog hiện có.

CloudPlay:

- `src/pages/projects/cloudplay/index.mdx`: nội dung hiện trạng và milestone.
- `src/pages/projects/cloudplay/updates.mdx`: nhật ký.
- `blog/2026-11-08-cloudplay-hanh-trinh/index.md`: câu chuyện đến 08/11/2026.
- `docs/content/cloudplay-sources.md`: sổ đối chiếu nguồn đã làm sạch, không chứa log thô.

Nội dung dự án viết bằng MDX. Không phải chỉnh component React chỉ để thêm một đoạn nhật ký hoặc cập nhật mục tiêu. Component `ProjectInfo` chỉ lo metadata/điều hướng dùng chung.

## Một lần cải tiến mới

1. Ghi điều kiện thử, thay đổi, kết quả và giới hạn. Chỉ công bố thông tin được phép chia sẻ.
2. Thêm một mục theo `templates/project-update.md`. Giữ anchor cũ, phân biệt ngày thực hiện và ngày ghi chép.
3. Cập nhật hub nếu năng lực hoặc kiến trúc hiện tại thay đổi. Dùng `templates/project-milestone.md` để chốt mốc có bằng chứng.
4. Cập nhật ngày/trạng thái trong registry. Thay 2-3 link cập nhật gần nhất trên hub. Không sửa bài hành trình cũ để biến số liệu lịch sử thành số liệu mới; đính chính có ghi ngày khi cần.
5. Khi có nội dung đủ giá trị độc lập, viết bài blog mới và thêm `project_id` tương ứng. Khai báo tag trong `blog/tags.yml`.
6. Chạy kiểm tra, tạo PR, review nội dung rồi mới merge/deploy theo cơ chế đã có. Không tự duyệt deployment environment.

## Giọng văn và độ chính xác

Viết bằng tiếng Việt, xưng "mình". Mở bài bằng nhu cầu con người, giải thích thuật ngữ khi cần. Hóm hỉnh ở tình huống, không đùa trong cảnh báo. Dùng dấu gạch nối `-`, không dùng em dash trong nội dung mới.

CloudPlay là tên hiển thị; không đổi GitHub organization, remote, URL repo hoặc lịch sử chỉ để bỏ tiền tố thương hiệu. Không công bố IP thật, UUID, token, khóa, tài khoản hoặc đường dẫn riêng.

Phân biệt streaming FPS và game FPS, host processing và độ trễ toàn tuyến, phiên quan sát và benchmark. Không khẳng định game/reboot/WAN/multi-VM đã đạt khi chưa thử. Không biến kế hoạch trong runbook thành kết quả. ISO build không đủ xác nhận OS build đang cài. Các báo cáo khác thời điểm có thể mô tả tiến triển khác nhau; ghi thời điểm thay vì xóa lịch sử.

## Kiểm tra

Dùng Node theo `.nvmrc`, `npm ci`, cài Chromium khi cần và chạy `npm run verify`. Các bài kiểm thử CloudPlay kiểm tra card -> hub -> nhật ký/bài viết, tìm kiếm, sitemap/feed, light/dark, overflow, console, axe và chụp ảnh. Browser suite hiện dùng Chromium emulation; không coi đó là nghiệm thu Safari, máy thật hoặc screen reader.

Không sửa `build/`, `.docusaurus/` hoặc mở thêm CMS/plugin chỉ để viết nội dung. Các tài liệu trong `docs/` và `templates/` ở repo, không tự tạo route công khai.
