# Phát hành TechDoors qua GitHub Pages

Địa chỉ chính: **https://techdoors.io/**. `https://www.techdoors.io/` sẽ redirect về apex khi cả hai DNS record và custom domain của Pages được cấu hình đúng. DNS tiếp tục được quản lý tại **iNET**; không đổi nameserver hoặc chuyển DNS sang dịch vụ khác.

## Trạng thái và ranh giới phê duyệt

Chủ repo đã phê duyệt phát hành lần đầu, merge PR #1 và cấu hình DNS iNET vào ngày 06/11/2026. GitHub Pages dùng GitHub Actions, custom domain `techdoors.io`, và biến `PAGES_DEPLOY_APPROVED=true`. Các thay đổi DNS hoặc quyền phát hành tiếp theo vẫn cần chủ domain đồng ý.

`deploy.yml` chỉ chạy cho PR có `merged=true` vào `main`. Biến repo `PAGES_DEPLOY_APPROVED` phải có giá trị chính xác `true`; khi chưa tạo hoặc bằng `false`, job deploy bị bỏ qua. Không có trigger `push` hay `workflow_dispatch`. PR validation không có quyền ghi Pages hay OIDC.

## 1. Chuẩn bị GitHub sau khi được phê duyệt

1. Giữ repo `branlabs/techdoors-blog` ở chế độ public để dùng GitHub Pages miễn phí.
2. Trong **Settings → Environments**, tạo `github-pages`. Bật **Required reviewers**, chọn chủ repo hoặc người được ủy quyền. Khi có một người tự triển khai và tự duyệt, giữ tùy chọn ngăn self-review tắt; nếu có người duyệt độc lập, có thể bật tùy chọn đó. Với workflow `pull_request: closed`, cho phép hai deployment branch pattern `main` và `refs/pull/*/merge`: GitHub gắn sự kiện PR với merge ref, dù PR đã được merge. Workflow vẫn chỉ build/deploy khi `merged=true` vào `main` và checkout đúng `merge_commit_sha`. Nếu chỉ cho phép `main` trong environment, GitHub sẽ chặn deploy trước khi chạy step. Giữ required reviewer; tắt bypass nếu tài khoản hỗ trợ.
3. Tạo branch rule cho `main`: yêu cầu PR, ít nhất một approval phù hợp nhóm làm việc và check **TypeScript, production build and browser checks** phải xanh. Không bật auto-merge cho PR khởi tạo khi chưa review.
4. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
5. Xác minh quyền sở hữu domain theo bước 2 dưới đây. Sau khi DNS đã được chấp thuận và trỏ đúng, đặt **Custom domain: `techdoors.io`**. Bản build vẫn chứa `CNAME` cho tính rõ ràng; với Actions, trường Custom domain trong Settings là cấu hình hosting cần thiết.
6. Chỉ sau khi chủ repo đồng ý phát hành, đặt repository variable **Settings → Secrets and variables → Actions → Variables → `PAGES_DEPLOY_APPROVED=true`**.
7. Merge PR đã được review vào `main`. Workflow build đúng `merge_commit_sha`, tạo artifact, rồi chờ phê duyệt job trong environment `github-pages`. Duyệt job để phát hành.

Nếu đã merge trong lúc biến vẫn `false`, workflow đã skip sẽ không trở thành một lần phát hành được duyệt. Sau khi hoàn tất cấu hình, mở một PR nhỏ có thay đổi thực sự (ví dụ cập nhật nội dung), review và merge để tạo sự kiện phát hành mới.

Để giữ quy trình có review mỗi lần phát hành, giữ required reviewer của environment. Đặt biến về `false` để tạm khóa toàn bộ phát hành mới.

## 2. Xác minh domain trước khi đổi bản ghi website

Trong **GitHub personal account Settings → Pages**, dùng **Add a domain** để nhận tên TXT và mã xác minh do GitHub cấp. Thông thường tên bắt đầu bằng `_github-pages-challenge-branlabs`; dùng **chính xác tên và giá trị GitHub hiển thị**, không dùng mã mẫu.

Tại iNET, thêm TXT đó vào zone `techdoors.io`. Nếu iNET tự thêm hậu tố domain, chỉ nhập phần host để tránh lặp `techdoors.io.techdoors.io`. Chờ phân giải DNS rồi bấm Verify trên GitHub. Giữ TXT sau khi xác minh để bảo vệ domain.

## 3. Bản ghi cần chuẩn bị tại iNET

Xuất hoặc chụp lại zone hiện tại trước khi sửa. Chỉ thay các bản ghi web ở apex và `www` gây xung đột; giữ nguyên MX, SPF, DKIM, DMARC và TXT của dịch vụ khác. Không tạo wildcard trỏ về Pages.

| Loại | Host trong iNET | Giá trị | Ghi chú |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Apex, bản ghi 1 |
| A | `@` | `185.199.109.153` | Apex, bản ghi 2 |
| A | `@` | `185.199.110.153` | Apex, bản ghi 3 |
| A | `@` | `185.199.111.153` | Apex, bản ghi 4 |
| CNAME | `www` | `branlabs.github.io` | Dùng hostname GitHub account, không thêm `/techdoors-blog` |

Có thể dùng TTL 300–3600 giây nếu iNET hỗ trợ. Apex không dùng CNAME. Host `www` không được có đồng thời CNAME với A/AAAA khác.

IPv6 là tùy chọn. Nếu thêm, tạo bốn AAAA tại `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`. Nếu đang có AAAA trỏ sang dịch vụ cũ, cần xử lý bản ghi xung đột sau khi được phê duyệt để tránh người dùng IPv6 đi nhầm host.

Nếu có CAA hạn chế tổ chức cấp chứng chỉ, đối chiếu tài liệu GitHub Pages hiện hành trước khi chỉnh. Không xóa CAA hoặc cấu hình bảo vệ chỉ để vượt qua lỗi mà chưa hiểu nguyên nhân.

## 4. HTTPS và redirect

1. Kiểm tra A/CNAME đã phân giải đúng và Pages báo DNS check thành công.
2. Chờ GitHub cấp chứng chỉ cho apex và `www`; nút **Enforce HTTPS** có thể cần thời gian mới khả dụng. Theo tài liệu GitHub, việc cấp chứng chỉ có thể mất tới 24 giờ; DNS tùy TTL và cache có thể lâu hơn.
3. Bật **Enforce HTTPS** khi khả dụng.
4. Giữ custom domain của Pages là `techdoors.io`. Khi apex và `www` đều trỏ đúng, GitHub Pages tự redirect `www` về apex; DNS CNAME tự nó không phải HTTP redirect.

Kiểm tra từ PowerShell (chỉ đọc):

```powershell
Resolve-DnsName techdoors.io -Type A
Resolve-DnsName www.techdoors.io -Type CNAME
curl.exe -I https://techdoors.io/
curl.exe -I https://www.techdoors.io/
curl.exe -I http://techdoors.io/
```

Kỳ vọng HTTPS apex trả `200`, `www` trả redirect về `https://techdoors.io/`, HTTP chuyển sang HTTPS. Kiểm tra thêm một URL bài viết và một URL không tồn tại: bài viết trả `200`, URL sai hiển thị 404 tiếng Việt và server trả `404`. Canonical, sitemap và feeds luôn dùng apex HTTPS.

## 5. Rollback và xử lý lỗi

- Muốn rollback nội dung: revert thay đổi bằng PR, chạy CI, review và merge; duyệt environment để phát hành bản đã revert. Không force-push `main`.
- Build/link/typecheck lỗi: deploy không chạy. Sửa trên feature branch và để CI kiểm tra lại.
- Pages `404`: kiểm tra Source là Actions, artifact `build/`, domain và `baseUrl: '/'`; không đổi thành `/techdoors-blog/` cho custom apex.
- HTTPS chưa có: kiểm tra các A/AAAA xung đột, CNAME `www`, CAA và thông báo ở Settings → Pages; đợi provisioning rồi thử lại. Không bỏ xác thực TLS để kiểm tra.
- Muốn dừng phát hành tiếp: đặt `PAGES_DEPLOY_APPROVED=false`. Việc này không gỡ website đang phục vụ. Unpublish hoặc đổi DNS là thay đổi riêng cần chủ domain cho phép.

## Tài liệu chính thức

- [GitHub: custom domain và các địa chỉ IP](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: xác minh custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub: bảo mật website bằng HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [GitHub: deploy bằng custom Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
