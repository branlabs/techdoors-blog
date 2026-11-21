# Prompt gửi cho code agent — Under the Hood #02

> Sử dụng skill `$techdoors-under-the-hood-writer`, đọc đầy đủ `SKILL.md` và hai reference `literary-craft-playbook.md`, `under-the-hood-02-brief.md`, đồng thời tham khảo chính bài #01 trong repository (bản Việt và Anh).
>
> Tôi muốn viết **Under the Hood #02 — Máy ảo bên trong máy ảo**, theo hướng **technical storytelling giàu chất văn học**. Học các *kỹ thuật kể chuyện* như gieo chi tiết, hé lộ có chủ đích, sự tò mò tăng dần và payoff ở cuối, nhưng tạo **giọng văn TechDoors riêng**, không bắt chước câu chữ của nhà văn cụ thể.
>
> **Mục tiêu sau bài đọc:** người đọc hiểu vì sao L1 (một VM) có thể chạy L2 khi L0 cung cấp đúng khả năng ảo hóa, phân biệt QEMU emulation với nested KVM, và thấy mọi tài nguyên cuối cùng vẫn dựa trên phần cứng thật. Giới thiệu **hypervisor** vừa đủ để tiếp nối bài #01, không deep dive taxonomy.
>
> **Cấu trúc:** mở bằng một tình huống bình thường nhưng gây thắc mắc, dẫn độc giả lần lượt khám phá, có một chi tiết được gieo và giải đáp, rồi kết luận bằng việc quay lại câu hỏi mở đầu. Đưa Terraform/libvirt/cloud-init gần cuối như **một thí nghiệm kiểm chứng ngắn**, không biến bài thành hướng dẫn Terraform. Bỏ OpenStack khỏi phạm vi giải thích và provisioning. Nếu lab chưa chạy thật, ghi rõ kết quả kỳ vọng và không bịa output.
>
> **Trước khi viết bài hoàn chỉnh**, hãy gửi tôi: (1) một câu hỏi trung tâm, (2) “aha moment” của người đọc, (3) story beats khoảng 5–7 nhịp, (4) ý tưởng foreshadowing → payoff, (5) khái niệm nào cần xác minh và bằng nguồn gì, (6) chỗ đặt thí nghiệm và giới hạn chứng minh. Đừng tạo PR hoặc merge lúc này. Chờ tôi duyệt outline trước.

Sau khi duyệt outline, có thể yêu cầu agent viết bản tiếng Việt rồi biên tập tiếng Anh riêng, kiểm tra hai bản khớp nhau về kỹ thuật và tuân thủ quy ước của repo.
