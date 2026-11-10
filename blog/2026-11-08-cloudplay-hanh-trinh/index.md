---
title: "CloudPlay: từ 15 FPS đến 60 FPS trên OpenStack"
description: "Tận dụng GPU trong server để thử cloud gaming. Hành trình từ các phiên stream khoảng 15 FPS đến 1080p60 trong LAN, trước khi thử game."
date: 2026-11-08T17:00:00+07:00
slug: cloudplay-tu-card-trong-server-den-stream-60fps
authors: [techdoors]
tags: [homelab, openstack, gpu-passthrough, cloud-gaming]
project_id: cloudplay
---

Đầu tháng 11/2026, mình muốn có một cách chơi game để giải trí sau giờ làm.

Card đồ họa thì đã có. Chỉ có điều, nó đang nằm trong một server đã trở thành một phần của hệ thống thử nghiệm tại nhà. Không còn cảnh ngồi xuống trước chiếc máy đó, mở game rồi chơi như một PC thông thường nữa.

Mình tự hỏi: có thể để server làm phần việc nặng, còn chiếc PC đang ngồi sử dụng chỉ cần nhận hình ảnh và gửi thao tác điều khiển về hay không?

**CloudPlay bắt đầu từ câu hỏi ấy.** Mình định tìm một cách giải trí sau giờ làm. Kết quả trước mắt là có thêm một dự án để làm sau giờ làm.

<!-- truncate -->

*Bài ghi lại hành trình đến ngày 08/11/2026. Hiện đã có phiên streaming 1080p60 trong mạng nội bộ; mình chưa chơi thử game thực tế. [Trang dự án](/projects/cloudplay/) phản ánh hiện trạng mới nhất, còn [nhật ký cải tiến](/projects/cloudplay/updates/) giữ lại những thay đổi theo thời gian.*

## Bắt đầu từ những gì đang có

Mục tiêu đầu tiên của mình không phải xây ngay một dịch vụ cho nhiều người. Mình muốn tận dụng server và chiếc card sẵn có để thử làm một nền tảng cloud gaming riêng.

Server đã nằm trong homelab OpenStack. Homelab ở đây đơn giản là hệ thống máy móc mình dùng tại nhà để học, thử và vận hành những thứ mình quan tâm. Vì nền tảng đã có sẵn, mình chọn mở rộng nó thay vì bỏ sang một hệ thống hoàn toàn mới.

Đó cũng là lý do chọn OpenStack. Không phải một kết luận rằng nó là lựa chọn tốt nhất cho tất cả mọi người, mà là lựa chọn có bối cảnh rõ ràng với mình: đã có hạ tầng, giờ thử xem hạ tầng ấy có thể làm thêm điều gì.

Hình dung ban đầu khá gọn: tạo một máy Windows chạy bên trong server, cho nó sử dụng chiếc card đồ họa, rồi truyền hình ảnh về PC. Từ góc nhìn người sử dụng, mình muốn ngồi ở máy này nhưng dùng sức mạnh của máy kia.

Trên giấy có thể viết trong một câu. Phần triển khai thì không có nghĩa vụ phải ngắn như vậy.

## Có GPU rồi, nhưng chưa đến lượt Windows dùng

Chiếc card của dự án là **NVIDIA GeForce GTX 1650 SUPER**. Nó vẫn nằm nguyên trong Server 01; phạm vi triển khai ban đầu không dựa vào việc di chuyển card hay mua thêm phần cứng.

Một máy ảo không tự nhiên được sử dụng trực tiếp mọi thiết bị đang cắm trên server. Với bài toán này, mình dùng **PCI passthrough**: giao thiết bị vật lý cho máy ảo sử dụng trực tiếp, thay vì chỉ cung cấp một bộ hiển thị giả lập. OpenStack có cơ chế quản lý việc cấp phát thiết bị theo cách đó. [Tài liệu OpenStack](https://docs.openstack.org/nova/2024.2/admin/pci-passthrough.html) giải thích chi tiết hơn phần này.

Nhưng trước khi nghĩ đến Windows, mình cần chuẩn bị phía máy chủ. GPU ban đầu vẫn do host quản lý và còn được ghi nhận là boot VGA. Mặt khác, server không chỉ chứa GPU mà còn đảm nhiệm các dịch vụ OpenStack. Thử cho vui nhưng làm ảnh hưởng cả hệ thống thì không vui lắm.

Vì vậy, quá trình được tách thành từng bước: kiểm tra hiện trạng, chuẩn bị cơ chế quản lý thiết bị, kiểm chứng sau khởi động rồi mới chuyển sang bước tiếp theo.

### Một bước đạt không có nghĩa cả dự án đã xong

Bước đầu là bật **IOMMU**, cơ chế liên quan đến việc quản lý truy cập bộ nhớ của thiết bị khi sử dụng trực tiếp trong môi trường ảo hóa. Trong báo cáo ngày 01/11, hệ thống đã khởi động lại thành công, xuất hiện **95 nhóm IOMMU** và các kiểm tra dịch vụ chính đạt.

Nhưng báo cáo đó cũng nói rất rõ: GPU vẫn giữ driver cũ, chưa chuyển sang VFIO, chưa thay phần cấp GPU của OpenStack. Đây là một bước tiến, không phải đích đến.

Ở giai đoạn sau, báo cáo tiếp nối ghi nhận **VFIO**, cơ chế dùng để chuẩn bị thiết bị cho passthrough trong cấu hình này, đã nhận các chức năng thuộc nhóm GPU tự động sau boot. Tuy vậy, tại thời điểm báo cáo đó, phần Nova cấp phát GPU vẫn chưa triển khai.

Chi tiết này đáng giữ lại vì nó giải thích một điều dễ nhầm: **host đã chuẩn bị được GPU không đồng nghĩa OpenStack đã tạo được máy Windows sử dụng GPU**.

Các bản ghi được tổng hợp theo thứ tự trong [nhật ký chuẩn bị host](/projects/cloudplay/updates/#cp-u01) và [nhật ký VFIO/Nova](/projects/cloudplay/updates/#cp-u02). Mình không biến các lệnh còn nằm trong kế hoạch cũ thành những bước được khẳng định là đã thực hiện.

## Máy Windows ở trong server, mình ngồi ở PC

Cấu hình máy ảo được ghi nhận cho CloudPlay gồm **Windows 10 x64, 8 vCPU, 16 GiB RAM và ổ hệ thống 128 GiB**, sử dụng GTX 1650 SUPER. CPU của máy chủ là **Intel Xeon E5-2686 v4**.

Mình chọn Windows 10 cho giai đoạn thử nghiệm vì cân nhắc khả năng tương thích với phần cứng hiện có. Khi đối chiếu, model Xeon này không nằm trong [danh sách CPU Intel cho Windows 11 của Microsoft](https://learn.microsoft.com/en-us/windows-hardware/design/minimum/supported/windows-11-supported-intel-processors). Tuy nhiên, điều đó không chứng minh Windows 10 chạy nhanh hơn, cũng không thay thế việc kiểm tra yêu cầu và hỗ trợ cho toàn bộ cấu hình máy ảo.

Một lưu ý cần ghi lại: [Windows 10 Home/Pro đã hết hỗ trợ thông thường từ 14/10/2025](https://learn.microsoft.com/en-us/lifecycle/products/windows-10-home-and-pro). Edition đang cài và phương án cập nhật bảo mật cần được kiểm tra riêng trước khi dùng lâu dài. Mình không lấy số build của bộ cài để khẳng định build đang chạy, và cũng không coi lựa chọn của một homelab là khuyến nghị hệ điều hành cho mọi người.

Ở phía còn lại, mình dùng **PC Windows 11, kết nối Wi-Fi trong cùng mạng LAN**. Nói cách khác, thử nghiệm hiện tại vẫn diễn ra trong mạng nội bộ, chưa phải truy cập từ một nơi khác qua Internet.

Hai phần mềm nối hai đầu là **Sunshine và Moonlight**. Sunshine chạy trong máy Windows cần truyền hình ảnh; Moonlight chạy trên PC để nhận hình và gửi thao tác trở lại. Sunshine hỗ trợ mã hóa video bằng phần cứng, trong đó có GPU NVIDIA, như mô tả trong [tài liệu chính thức](https://docs.lizardbyte.dev/projects/sunshine/latest/).

Đến đây, hệ thống đã có hình hài dễ hiểu hơn: chiếc card vẫn ở trong server, máy Windows sử dụng nó ở đó, còn mình kết nối từ PC bên ngoài.

## Đã lên hình, nhưng mới khoảng 15 FPS

Phần khiến mình mất thời gian nhất không phải đặt tên dự án. Đó là đưa luồng hình ảnh từ khoảng **15 FPS lên 60 FPS**.

FPS là số khung hình mỗi giây. Ở đây, mình đang nói đến **luồng video truyền về Moonlight**, chưa phải số khung hình do một trò chơi tạo ra.

Trong một ảnh thử nghiệm đầu tháng 11, Moonlight hiển thị video 1920×1080, H.264, **16,85 FPS**. Một ảnh khác ghi **17,29 FPS**, đồng thời Windows báo **Code 43** cho GTX 1650 SUPER và log xuất hiện lỗi tạo encoder D3D11. Các quan sát này được lưu trong [nhật ký phiên lên hình ban đầu](/projects/cloudplay/updates/#cp-u03).

Như vậy, có desktop hiện lên không đủ để kết luận rằng mọi thứ đã dùng GPU đúng như mong muốn. Một phần mềm báo đang chạy cũng chưa nói hết chuyện gì đang xảy ra phía sau.

Mình đã đi từ câu hỏi "kết nối được chưa?" sang những câu hỏi cụ thể hơn: Windows đang nhìn thấy thiết bị nào, màn hình nào đang được dùng, phần mềm streaming có sử dụng được bộ mã hóa phần cứng hay không, và phía nhận thực sự quan sát được bao nhiêu khung hình?

Đó là lúc dự án chơi game tạm thời trở thành dự án đọc thông số. Cũng có hình ảnh chuyển động, nhưng chưa phải loại giải trí mình dự tính ban đầu.

Điều cần tránh khi kể lại là gom tất cả thành một nguyên nhân duy nhất. Các ảnh cũ cho thấy Code 43 và lỗi encoder từng xuất hiện; chúng không đủ để khẳng định đây là nguyên nhân duy nhất của mọi phiên FPS thấp. Mình cũng không có một thí nghiệm giữ nguyên mọi điều kiện để chứng minh chỉ đổi codec hoặc chỉ đổi màn hình đã tạo ra toàn bộ mức cải thiện.

## Một màn hình chính và một kết quả đáng mừng

Trong báo cáo cấu hình cuối, **NVIDIA Virtual Display** là màn hình chính trong Windows VM ở **1920×1080@60Hz**. QEMU DISPLAY1 đã disconnect, nhưng adapter vẫn được giữ lại. Phương án khôi phục cấu hình màn hình qua SSH đã được kiểm thử trong phiên desktop thực.

Sunshine lúc này dùng **HEVC NVENC**. Hiểu ngắn gọn, HEVC là định dạng nén video, còn NVENC là bộ mã hóa phần cứng của NVIDIA. Quan trọng với dự án không phải gom thêm tên công nghệ, mà là có kết quả quan sát được ở đầu nhận.

Báo cáo Single Display ghi nhận:

| Chỉ số | Kết quả trong phiên đã báo cáo |
| --- | --- |
| Luồng hình ảnh | 1920×1080 |
| FPS trên Moonlight | 60,03-60,11 FPS |
| Mã hóa phía Sunshine | HEVC NVENC |
| Host processing | 4,0-4,2 ms |
| Mất gói | 0% trong phiên quan sát |

Với mình, đây là bước tiến đáng kể so với các phiên khoảng 15-17 FPS trước đó. Không phải vì nó chứng minh mọi vấn đề đã được giải quyết, mà vì mục tiêu truyền hình ảnh ban đầu đã có một kết quả cụ thể để bám vào.

Chiếc card vẫn là chiếc card ấy. Lần này, con số trên Moonlight đã dễ chịu hơn nhiều.

Những số liệu trên được lấy từ báo cáo lab đã lưu, không phải phép đo mới khi viết bài. Thời lượng, bitrate và kịch bản tải của phiên cuối chưa đủ thông tin để trình bày như một benchmark có thể lặp lại. [Nhật ký Single Display](/projects/cloudplay/updates/#cp-u04) giữ phạm vi và giới hạn của kết quả này.

## Khoan đã, mình vẫn chưa chơi thử game

Đây là câu quan trọng nhất để không kể quá đà về CloudPlay: **đến thời điểm viết bài, mình chưa chơi thử game thực tế**.

Vì vậy, 60 FPS trong luồng video không có nghĩa một trò chơi bất kỳ sẽ chạy ở 60 FPS. Host processing 4 ms không có nghĩa từ lúc bấm phím đến lúc nhìn thấy phản hồi chỉ mất 4 ms. Mất gói 0% trong một phiên cũng không bảo đảm Wi-Fi sẽ luôn giữ nguyên điều kiện đó.

Kết quả hiện tại cho phép nói rằng mình đã có một bản thử nghiệm truyền hình ảnh 1080p60 trong LAN. Chưa có cơ sở để kết luận trải nghiệm chơi lâu dài, âm thanh hoặc tay cầm trong game đã được nghiệm thu.

Phần khởi động lại cũng chỉ cần ghi ngắn: VFIO đã có kiểm tra sau boot ở một giai đoạn trước, nhưng chưa đủ kết quả để chốt khả năng tự phục hồi của toàn bộ chuỗi với cấu hình màn hình cuối. Lần thao tác Single Display cuối không bao gồm reboot.

Mình muốn giữ những giới hạn đó ngay trong bài. Chúng không làm mất giá trị của kết quả; chúng giúp biết chính xác bước tiếp theo phải kiểm tra điều gì.

## Đích đến xa hơn một máy ảo

Ban đầu mình muốn tận dụng chiếc card để giải trí. Đi xa hơn, mình muốn CloudPlay có thể **cung cấp các máy ảo với tài nguyên GPU theo nhu cầu**, thay vì luôn dành cả chiếc card cho một máy.

Đây là một bài toán khác với passthrough đang dùng. Trong cấu hình hiện tại, GPU được giao cho một VM tại một thời điểm. Chia tài nguyên cho nhiều VM đồng thời cần cơ chế và phần cứng phù hợp, không chỉ thêm một ô nhập số CUDA core.

Khi đối chiếu tài liệu, GTX 1650 SUPER không thuộc [danh sách GPU hỗ trợ MIG](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-gpus.html) và không nằm trong [danh sách GPU hỗ trợ chính thức của NVIDIA vGPU](https://docs.nvidia.com/vgpu/gpus-supported-by-vgpu.html). Do đó, mình xem đây là hướng nghiên cứu có thể đòi hỏi thay đổi phần cứng/phần mềm, không hứa làm được chỉ bằng cấu hình hiện có.

Với mục tiêu chơi game, việc đánh giá cũng phải bao gồm đồ họa, bộ nhớ, mã hóa video, mức cách ly và hiệu năng khi dùng chung. Khả năng chia tài nguyên cho tác vụ tính toán chưa tự chứng minh một cấu hình phù hợp cho Windows gaming.

Xa hơn nữa là cung cấp môi trường chơi game như một dịch vụ: người sử dụng nhận một môi trường đã chuẩn bị sẵn mà không cần tự quản lý mọi thành phần bên dưới. Ý tưởng một game trên một instance cũng thuộc phạm vi nghiên cứu đó, chưa phải tính năng đã triển khai. Ngoài kỹ thuật, còn phải xem xét điều kiện sử dụng phần mềm/game và chi phí vận hành trước khi nghĩ đến dịch vụ công khai.

Mục tiêu có thể lớn, nhưng trạng thái trên trang dự án nên trung thực với thứ đang chạy hôm nay.

## Chặng tiếp theo: cuối cùng cũng nên mở một game

Ưu tiên gần nhất của mình là chọn một game để thử thật, ghi lại thiết lập, khoảng thời gian chơi, hình ảnh, âm thanh và cảm giác điều khiển. Sau đó là kiểm tra kết nối lại và phục hồi, để biết phần nào còn cần thao tác thủ công.

Những thay đổi có ảnh hưởng đến máy chủ sẽ được thực hiện như các lần thử riêng. Mình không khởi động lại hệ thống chỉ để có thêm một dòng "đã test" trong bài viết.

Hướng chia sẻ GPU cho nhiều VM sẽ có mốc nghiên cứu riêng, không gộp với việc một VM đã stream được 60 FPS. Mỗi lần cải tiến sẽ được bổ sung vào [nhật ký dự án](/projects/cloudplay/updates/), còn [trang tổng quan CloudPlay](/projects/cloudplay/) được cập nhật để người đọc biết hệ thống hiện ở đâu.

CloudPlay chưa phải một nền tảng cloud gaming hoàn chỉnh. Nhưng nó đã đi từ một chiếc card trong server đến một máy Windows có thể truyền hình ảnh về PC ở 1080p60 trong mạng nội bộ.

Một nền móng đủ cụ thể để tiếp tục thử, đo và cải tiến. Và hy vọng lần cập nhật tới, mình có thêm chuyện để kể về game, chứ không chỉ về công tác chuẩn bị để chơi game.

## Nguồn và phạm vi bài viết

Các tình tiết, cấu hình và số đo được tổng hợp từ báo cáo lab, ảnh chụp và xác nhận của mình trong quá trình làm dự án. [Phần nguồn trong nhật ký](/projects/cloudplay/updates/#sources) phân biệt từng giai đoạn và những điểm chưa đủ bằng chứng. Không công bố log thô hoặc thông tin truy cập hệ thống.

Tài liệu OpenStack, Sunshine, Microsoft và NVIDIA được liên kết tại đoạn liên quan để giải thích cơ chế và kiểm tra phạm vi hỗ trợ, không thay thế bằng chứng thử nghiệm của CloudPlay. Đây là bài kể lại quá trình, không phải runbook để sao chép lệnh lên một hệ thống khác.
