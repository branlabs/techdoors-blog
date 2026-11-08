# CloudPlay - đối chiếu nội dung ngày 08/11/2026

Tài liệu biên tập đã làm sạch, được commit trong repo công khai. Không kèm tài liệu thô hoặc thông tin truy cập. Nguồn riêng được chủ dự án cung cấp qua quá trình làm việc; không có URL công khai giả thay cho chúng.

## Cơ sở cho câu chuyện

| Nhóm nguồn | Điều hỗ trợ | Điều không được suy ra |
| --- | --- | --- |
| Xác nhận chủ dự án 08/11/2026 | Tên CloudPlay; bắt đầu đầu tháng 11; tận dụng server/GPU để giải trí và nghiên cứu cloud gaming; OpenStack có sẵn; client Windows 11, Wi-Fi, cùng LAN; chưa chơi game | Trải nghiệm gameplay, WAN, thời lượng hoặc bitrate không được cung cấp |
| Kiểm kê 31/10/2026 | CPU Xeon E5-2686 v4; homelab có OpenStack | Mọi thông số đều còn nguyên hoặc đã được tái đo ngày viết bài |
| Báo cáo IOMMU 01/11/2026 | Một reboot được phép; 95 nhóm; kiểm tra dịch vụ/phân bổ đạt; driver giữ nguyên | VFIO hoặc Nova đã xong trong cùng lần này |
| Báo cáo tiếp nối VFIO/Nova | Các chức năng GPU được vfio-pci nhận sau boot; Nova GPU Scheduling chưa triển khai tại thời điểm báo cáo | Các kế hoạch recovery/Nova trong tài liệu đã được chạy; an toàn reset toàn hệ thống |
| Cấu hình VM đã được người thực hiện cung cấp | Windows 10 x64; 8 vCPU; 16 GiB RAM; 128 GiB disk; GTX 1650 SUPER | Edition và OS build hiện tại từ thông tin ISO |
| Ảnh streaming đầu tháng 11 | Một ảnh 16,85 FPS H.264; ảnh khác 17,29 FPS, Code 43, lỗi encoder D3D11 | Benchmark đồng điều kiện; Code 43 là nguyên nhân duy nhất; H.264 luôn chậm |
| Báo cáo Single Display do người thực hiện gửi | NVIDIA Virtual Display 1920×1080@60Hz; QEMU DISPLAY1 disconnect; HEVC NVENC; 60,03-60,11 FPS; host processing 4,0-4,2 ms; mất gói 0% trong phiên; rollback display qua SSH đã thử; không reboot lần cuối | Gaming acceptance, end-to-end latency 4 ms, độ ổn định dài hạn, cold boot với cấu hình cuối |

Không đưa chi tiết BAR3/efifb hay chuỗi lệnh sửa Code 43 vào bài, vì chưa đủ bằng chứng trong nguồn đã đối chiếu để tái dựng giải pháp một cách tin cậy. Báo cáo Single Display là kết quả được cung cấp, không phải phép đo mới do lượt biên soạn này chạy.

## Tài liệu bên ngoài

Đối chiếu 08/11/2026, chỉ dùng để giải thích cơ chế/phạm vi hỗ trợ:

- OpenStack Nova 2024.2, PCI passthrough: https://docs.openstack.org/nova/2024.2/admin/pci-passthrough.html
- Sunshine: https://docs.lizardbyte.dev/projects/sunshine/latest/
- Microsoft, CPU Intel Windows 11: https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/windows-11-supported-intel-processors
- Microsoft, Windows 10 Home/Pro lifecycle: https://learn.microsoft.com/en-us/lifecycle/products/windows-10-home-and-pro
- NVIDIA, MIG supported GPUs: https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-gpus.html
- NVIDIA, vGPU supported GPUs: https://docs.nvidia.com/vgpu/gpus-supported-by-vgpu.html

Xeon E5-2686 v4 không xuất hiện trong danh sách Windows 11 đã xem; không diễn giải thành chứng minh Windows 10 nhanh hơn hoặc xác nhận toàn bộ VM được hỗ trợ. Windows 10 Home/Pro kết thúc hỗ trợ thông thường 14/10/2025; không khẳng định VM đã đăng ký hỗ trợ mở rộng hoặc thuộc LTSC.

GTX 1650 SUPER không có MIG và không thuộc danh sách NVIDIA vGPU chính thức đã xem. Không đồng nhất khả năng chia CUDA/compute với hỗ trợ Windows graphics/encoding. Chia GPU và môi trường chơi game như dịch vụ là định hướng nghiên cứu.

## Quy tắc duyệt

Không có raw logs, secrets, IP riêng, UUID máy ảo, đường dẫn cá nhân hay ảnh chưa làm sạch trong thay đổi này. Chưa thêm gallery vì ảnh cuối và quyền công bố từng ảnh chưa được xử lý; không dùng ảnh dựng làm bằng chứng. Lịch sử được ghi theo mốc có nguồn hoặc khoảng thời gian, không gán ngày chính xác khi không chắc.

PR nội dung chưa là quyết định merge hoặc phát hành. Sau review, giữ deployment gate hiện hữu.
