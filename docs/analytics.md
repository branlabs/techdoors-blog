# Thống kê độc giả TechDoors bằng Google Analytics 4

- Website: https://techdoors.io/
- Measurement ID: `G-THZSCXZY06` (public, không phải API secret)
- Nền tảng: Docusaurus 3 / GitHub Pages
- DNS: giữ nguyên iNET, không cần Google Tag Manager
- Múi giờ báo cáo: đặt `Asia/Ho_Chi_Minh` trong GA4 property

## Cách hoạt động

Không hiện popup thống kê khi người đọc mở TechDoors.
Mặc định không tải Google Analytics và không ghi nhận lượt truy cập của khách chưa chọn.
Chỉ khi người đọc chủ động mở **Tùy chọn thống kê** ở footer và chọn
**Cho phép thống kê**, trang mới chèn `gtag.js` và gửi page views.
Lựa chọn được lưu trong localStorage dưới khóa `techdoors.ga4-consent.v1`.
Người đọc có thể đổi lựa chọn bất cứ lúc nào ở footer.
Từ chối sau khi đã chấp thuận sẽ cập nhật consent, xóa các cookie GA có thể truy cập
và tải lại trang để gỡ script khỏi phiên làm việc hiện tại.

Để tránh lượt kiểm tra/test làm sai lệch báo cáo, analytics chỉ hoạt động trên
`techdoors.io` và `www.techdoors.io`, không hoạt động trên localhost hay preview.
Vì Docusaurus điều hướng theo SPA, mỗi lần đổi đường dẫn ghi nhận một `page_view`,
và tắt automatic page view để tránh đếm đôi.

## Đọc báo cáo

- **Realtime**: xem hoạt động trong vòng 30 phút gần nhất sau khi bật tag và đồng ý.
- **Reports → User attributes → Demographic details**: chọn Country, Region, City hoặc Continent để so sánh địa lý.
- **Reports → Engagement → Pages and screens**: xem bài viết nào được đọc.
- **Reports → Acquisition → Traffic acquisition**: chọn Session source / medium để phân biệt LinkedIn, Medium, Google.
- Dùng date range để so sánh hôm nay với hôm qua, hoặc 7/30 ngày; các báo cáo chi tiết có độ trễ xử lý.

Không kỳ vọng dữ liệu của người không đồng ý hiển thị trong GA4.
Địa điểm ước tính qua mạng và IP nên có thể sai khi dùng VPN, mạng di động hoặc CGNAT.
Measurement ID có thể công khai trong mã trang; **không** đưa credentials, API key có quyền quản trị
hay service account vào repository.

## Kiểm chứng sau deploy

1. Truy cập trang ở chế độ ẩn danh, mở DevTools → Network, lọc `googletagmanager` hoặc `google-analytics`.
2. Khi vừa mở trang: không có popup, script hoặc request Google Analytics.
3. Bấm **Tùy chọn thống kê** ở footer → **Cho phép thống kê** và kiểm tra script `gtag/js?id=G-THZSCXZY06` được tải.
4. Trong GA4, xem Realtime hoặc dùng DebugView/Tag Assistant để xác nhận page_view.
5. Chuyển từ /blog/ sang một bài viết: mỗi page view chỉ ghi một lần.
6. Chọn **Tùy chọn thống kê** rồi **Không đồng ý**: tag ngừng tải ở lượt mở trang kế tiếp.

Cấu hình PR vẫn phải được review, merge và phê duyệt environment `github-pages` trước khi phát hành.
Không cài thêm thủ công đoạn Google Tag hoặc GTM trong giao diện Analytics, tránh đo trùng.

Tham khảo:
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://support.google.com/analytics/answer/14009635
- https://support.google.com/analytics/answer/14218557
