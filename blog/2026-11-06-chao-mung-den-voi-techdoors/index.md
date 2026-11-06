---
title: Chào mừng đến với TechDoors
description: Một cánh cửa nhỏ để cùng tìm hiểu DevOps, hạ tầng và cách những hệ thống phía sau màn hình hoạt động.
date: 2026-11-06T08:00:00+07:00
slug: chao-mung-den-voi-techdoors
authors: [techdoors]
tags: [devops, sre, kubernetes, platform-engineering, observability, ci-cd, linux, infrastructure, homelab, openstack]
image: /img/og-default.png
---

Có những câu hỏi bắt đầu rất nhỏ: một tiến trình đang dùng bao nhiêu bộ nhớ, vì sao một container liên tục khởi động lại, hay điều gì thực sự xảy ra sau một lần `git push`?

**TechDoors** bắt đầu từ sự tò mò đó. Đây là blog kỹ thuật cá nhân bằng tiếng Việt, dành cho việc ghi lại cách tìm hiểu, xây dựng và vận hành hệ thống — từng cánh cửa một.

<!-- truncate -->

## Vì sao có TechDoors?

Một ghi chép tốt giúp biến điều vừa đọc hoặc vừa thử thành điều có thể xem lại. Khi chia sẻ ghi chép ấy, chúng ta cũng tạo thêm cơ hội để nhận câu hỏi, phát hiện chỗ chưa hiểu và tìm một cách giải thích rõ hơn.

TechDoors được tạo ra để làm một nơi như vậy: lưu lại bối cảnh, cách tiếp cận và những đánh đổi kỹ thuật. Mục đích của blog là cùng học và chia sẻ kiến thức có thể kiểm chứng.

## Những cánh cửa sẽ cùng mở

Các bài viết sẽ xoay quanh những nhóm chủ đề có liên hệ với nhau:

- **DevOps và CI/CD:** tự động hóa các bước lặp lại, kiểm thử thay đổi và tìm hiểu đường đi từ mã nguồn đến bản phát hành.
- **SRE và Observability:** hiểu độ tin cậy, sử dụng logs, metrics và traces để đặt câu hỏi đúng về hệ thống.
- **Kubernetes và Platform Engineering:** khám phá việc điều phối container, các thành phần nền tảng và trải nghiệm của người phát triển.
- **Linux và Infrastructure:** đi từ tiến trình, mạng và lưu trữ đến cách mô tả hạ tầng bằng mã nguồn.
- **Homelab và OpenStack:** dành một không gian thực hành để thử nghiệm, quan sát và ghi lại giới hạn của từng cấu hình.

Một bài viết có thể chỉ giải quyết một câu hỏi nhỏ. Điều quan trọng là người đọc hiểu **đang thử điều gì, vì sao thử và kết quả nói lên điều gì**.

## Cách những ghi chép được viết

Các nội dung kỹ thuật sẽ hướng đến một cấu trúc đơn giản:

1. Nêu câu hỏi và bối cảnh.
2. Ghi rõ môi trường, phiên bản và giả định liên quan.
3. Trình bày cách thực hiện cùng giải thích cho các lựa chọn.
4. Chỉ ra cách kiểm chứng, giới hạn và những điều còn cần tìm hiểu.

Ví dụ, một lệnh chẩn đoán nên đi cùng mục đích sử dụng. Lệnh dưới đây chỉ hiển thị thông tin bộ nhớ trên Linux; nó chưa đủ để kết luận nguyên nhân của một sự cố:

```bash title="Kiểm tra bộ nhớ trên Linux"
free -h
```

Khi có ví dụ về lab hoặc cấu hình thử nghiệm, bài viết sẽ nêu rõ phạm vi. Một kết quả trong homelab cần được đánh giá thêm trước khi áp dụng cho môi trường có yêu cầu vận hành khác.

> Hiểu rõ một giả định thường hữu ích hơn việc sao chép một cấu hình dài.

## Bắt đầu từ đâu?

Bạn có thể duyệt [tất cả bài viết](/blog), chọn một [chủ đề](/blog/tags/) hoặc ghé trang [giới thiệu](/about) để hiểu thêm định hướng của blog. Khu vực [dự án](/projects) hiện có các khung nội dung mẫu và sẽ được cập nhật khi có dự án thực tế để chia sẻ.

Để theo dõi bài mới, thêm <a href="/blog/rss.xml">RSS</a> hoặc <a href="/blog/atom.xml">Atom</a> vào trình đọc bạn đang dùng. Không cần tạo tài khoản.

TechDoors vừa mở cửa. Cảm ơn bạn đã ghé qua — và hẹn gặp lại ở một câu hỏi kỹ thuật tiếp theo.
