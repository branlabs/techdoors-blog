# Thống kê độc giả TechDoors bằng Umami Cloud

TechDoors sử dụng Umami Cloud thay cho Google Analytics 4. Không còn Google Tag,
Google Tag Manager, popup đồng ý hoặc cookie analytics của GA4.

## Thiết lập Umami Cloud

1. Tạo tài khoản Hobby miễn phí tại https://cloud.umami.is/signup và xác minh email.
2. Chọn vùng lưu trữ dữ liệu US hoặc EU trong bước thiết lập tài khoản.
3. Vào **Websites → Add website**:
   - Name: `TechDoors`
   - Domain: `techdoors.io` (không có `https://`).
4. Trong mục **Tracking code**, Website ID của TechDoors đã được xác nhận là
   `a4d415be-3f00-4e3c-95b9-18ab651767ae`. Đây là mã công khai, không phải API key,
   account token hay mật khẩu.
5. Mã này đã được cấu hình trực tiếp vào job production build trong
   `.github/workflows/deploy.yml`, không cần tạo repository variable thủ công.
6. Sau khi PR được merge, duyệt môi trường `github-pages` để phát hành bản
   chứa Umami tracker.

## Cấu hình được tạo trong site

Docusaurus đọc `UMAMI_WEBSITE_ID` từ môi trường build. Job production
đặt giá trị công khai đã xác nhận; CI/local không đặt biến để tránh gửi dữ liệu thử nghiệm.
Bản production sinh script:

```html
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="a4d415be-3f00-4e3c-95b9-18ab651767ae"
  data-domains="techdoors.io,www.techdoors.io"
  data-exclude-hash="true"
  data-do-not-track="true"
></script>
```

- Trong CI/local không có `UMAMI_WEBSITE_ID` nên build **không nhúng tracker**.
- Khi giá trị `UMAMI_WEBSITE_ID` không đúng định dạng UUID, build lỗi để tránh phát hành cấu hình sai.
- Script mặc định tự đo pageview và chuyển trang SPA của Docusaurus.
  Không cần tự gọi `umami.track()` khi đổi route; làm vậy có thể đếm đôi.
- Giới hạn domain giúp môi trường localhost/staging không tạo event production.
- Không tự bật các tính năng session replay, heatmap hay error tracking.
- Browser có bật tín hiệu Do Not Track (nếu hỗ trợ) sẽ được tôn trọng.

## Đọc báo cáo

Trong https://cloud.umami.is, chọn website **TechDoors** và khoảng thời gian Today,
Yesterday, 7 days, 30 days hoặc ngày tùy chọn. Theo dõi:

- **Visitors / Visits / Views**: khách truy cập ước tính, phiên và lượt xem trang.
- **Countries / Regions / Cities**: quốc gia, vùng/tỉnh và thành phố *ước tính*.
- **Pages**: bài viết/trang nào được xem nhiều.
- **Referrers / UTM**: nguồn như LinkedIn, Medium, Google hoặc trực tiếp.
- Các báo cáo theo khoảng thời gian cho phép so sánh traffic mỗi ngày.

Một IP có thể đại diện nhiều người (NAT, CGNAT), hoặc một người có nhiều IP.
Dữ liệu location không chính xác đến địa chỉ hay tỉnh trong mọi trường hợp.
Umami không dùng cookie web tracker, nhưng vẫn xử lý IP tạm thời; hạ tầng có thể ghi
IP trong security/operational logs. Xem https://umami.is/privacy.

## Kiểm tra sau deploy

1. Kiểm tra nguồn trang trên `https://techdoors.io/` có đúng một script
   `https://cloud.umami.is/script.js` với `data-website-id` phù hợp.
2. Kiểm tra không còn `G-THZSCXZY06`, `gtag.js`, `googletagmanager.com` hoặc
   nút `Tùy chọn thống kê`.
3. Mở DevTools → Network, lọc `umami` và mở website ở trình duyệt cho phép tracking.
4. Xem bảng điều khiển Umami theo thời gian thực; thử mở trang chủ rồi vào `/blog/`.
   Kiểm tra một lượt xem cho mỗi lần điều hướng.
5. Kiểm tra light/dark trên desktop/mobile, không có popup chắn nội dung.

### Loại trừ lượt truy cập của chính mình

Trong Console trên **techdoors.io**, chạy:

```js
localStorage.setItem('umami.disabled', 1);
```

Tải lại trang. Lựa chọn này chỉ áp dụng cho trình duyệt hiện tại.
Để cho phép thống kê lại, dùng:

```js
localStorage.removeItem('umami.disabled');
```

Không có API secret trong source code. Website ID là mã công khai trong HTML,
nên không sử dụng làm thông tin xác thực.

Tham khảo:
- https://docs.umami.is/docs/cloud/sign-up
- https://docs.umami.is/docs/add-a-website
- https://docs.umami.is/docs/collect-data
- https://docs.umami.is/docs/guides/track-single-page-apps
- https://docs.umami.is/docs/exclude-my-own-visits
