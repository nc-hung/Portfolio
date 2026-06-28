# Bản đồ đa nguồn thu nhập từ kỹ năng Dev — Nguyễn Công Hưng

> Trả lời đầy đủ câu hỏi gốc: *"các nguồn tiền tôi tiếp cận được từ kỹ năng dev, làm sao có nhiều nguồn thu nhập"*.
> Triết lý: **1 chân tiền-ngay (freelance) nuôi 2–3 chân tài sản (thu nhập tích luỹ/thụ động)**.
> Đừng làm cả 8 hướng. Chọn theo thứ tự ưu tiên đã chấm điểm bên dưới.

---

## A. Xếp hạng theo độ phù hợp VỚI BẠN (không phải lý thuyết chung)

Chấm trên: tốc độ ra tiền · trần thu nhập · bạn đã có bằng chứng/tài sản chưa.

| # | Nguồn thu | Ra tiền | Trần | Bạn đã có sẵn? | Ưu tiên |
|---|---|---|---|---|---|
| 1 | **Freelance ngách** (billing/AI-automation) | Nhanh (4–6 tuần) | $60–90/h | ✅ 5 case study + portfolio | 🟢 LÀM NGAY |
| 2 | **Productize "Check Toa" → micro-SaaS** cho vựa sỉ | 1–3 tháng | Cao, định kỳ | ✅ MVP chạy thật + 1 khách | 🟢 CHÂN TÀI SẢN |
| 3 | **AI-dev consulting/training** (Claude Code/MCP cho team VN) | 2–8 tuần | Cao/buổi | ✅ thành thạo Claude Code, MCP, codegraph | 🟡 SONG SONG |
| 4 | **Open-source → sponsor/ecosystem** (taste-skill) | Chậm | Trung, uy tín | ✅ đã có sponsor (Vercel OSS, animations.dev) | 🟡 NUÔI BRAND |
| 5 | **Bán template/boilerplate** (admin công nợ, Excel export, MUI) | 1–2 tháng | Trung, thụ động | 🟠 cần trích từ code có sẵn | 🟡 PHỤ |
| 6 | **Shopify app / Shop Minis** (đã có imersian-shop-minis) | 2–4 tháng | Cao, định kỳ | 🟠 có nền tảng, cần publish | ⚪ TUỲ HỨNG |
| 7 | **Nội dung tiếng Việt** (LinkedIn → khoá học) | 3–6 tháng | Cao nếu trụ | 🟠 chưa bắt đầu | ⚪ DÀI HẠN |
| 8 | **Bug bounty / contest / hackathon** | Bấp bênh | Bấp bênh | ⚪ chưa | ⚪ chỉ nếu thích |

---

## B. Chi tiết 3 hướng đáng đầu tư nhất

### 1. Freelance ngách — *chân tiền-ngay* 🟢
Đã có bộ kit đầy đủ ở `00`–`03`. Đây là dòng tiền nuôi mọi thứ còn lại. Bắt đầu tuần này.

### 2. Micro-SaaS từ Check Toa — *chân tài sản lớn nhất* 🟢
Bạn đã hiểu nỗi đau vựa sỉ + có sản phẩm chạy thật. Đây là khác biệt mà 99% dev không có.
- **Khách:** vựa hoa/cây/nông sản, đại lý phân phối đang dùng giấy/Excel để ghi công nợ.
- **Mô hình:** thuê bao 200k–500k₫/tháng/shop. 30 shop = 6–15tr₫/tháng *định kỳ* (passive dần).
- **Việc cần làm để bán được (không phải code lại):**
  1. Multi-tenant (mỗi khách 1 không gian dữ liệu tách biệt) + đăng ký/đăng nhập self-serve.
  2. Trang giới thiệu + bảng giá + nút dùng thử.
  3. Onboarding 1 khách trả tiền đầu tiên ngoài người hiện tại → chứng minh "có người lạ chịu trả".
- **Cảnh báo:** đừng build 6 tháng rồi mới bán. Bán *trước*: cho 3 vựa khác dùng thử bản hiện tại, thu phí tay, rồi mới tự động hoá.

### 3. AI-dev consulting/training — *premium, ít người làm được* 🟡
Bạn dùng Claude Code/MCP/codegraph/subagents ở mức ít dev VN chạm tới. 2026 cực "nóng".
- **Sản phẩm:** buổi training 2–3h cho team dev cách dùng Claude Code hiệu quả; hoặc setup AI workflow cho 1 công ty (audit, SOP, automation script — bạn đã viết `ux_audit.py`, `lint_runner.py`).
- **Giá:** buổi training nội bộ doanh nghiệp 3–10tr₫/buổi; gói setup workflow theo dự án.
- **Kênh:** LinkedIn (viết về cách bạn dùng AI để build Check Toa/ivy-bot) → khách tự đến.

---

## C. Chiến lược "xếp chồng" (cách các chân nuôi nhau)

```
        ┌─────────────────────────────────────────────┐
        │  Freelance ngách (tiền mặt đều, tuần này)    │ ──┐
        └─────────────────────────────────────────────┘   │ case study + uy tín + vốn
                                                            ▼
        ┌─────────────────────────────────────────────┐
        │  Micro-SaaS Check Toa (thu nhập định kỳ)     │ ──┐
        └─────────────────────────────────────────────┘   │ "tôi tự build & vận hành SaaS"
                                                            ▼
        ┌─────────────────────────────────────────────┐
        │  LinkedIn/nội dung (AI-dev, fintech-lite)    │ ──┐
        └─────────────────────────────────────────────┘   │ inbound leads giá cao
                                                            ▼
        ┌─────────────────────────────────────────────┐
        │  Consulting/training + template (passive)    │
        └─────────────────────────────────────────────┘
```
- Freelance → tiền + case study → tăng giá freelance + làm vốn nuôi SaaS.
- SaaS → bằng chứng "builder thật" → bán consulting/training đắt hơn.
- Nội dung → inbound cho cả 3 → giảm phụ thuộc sàn (khách trực tiếp +25–30%).

---

## D. Sự thật thẳng thắn (để không vỡ mộng)

- **Không có AI/ai tự kiếm tiền hộ bạn.** Tôi tăng tốc 5–10× phần soạn/dựng/nghiên cứu, nhưng *bạn* phải gửi proposal, gọi khách, ký hợp đồng, nhận tiền. Bất kỳ thứ gì hứa "thu nhập thụ động không cần làm gì" đều là bẫy.
- **Đa nguồn ≠ làm 8 thứ cùng lúc.** Người mới làm nhiều thứ một lúc thường = 0 thứ ra tiền. Tháng 1–2: **chỉ freelance**. Có dòng tiền rồi mới mở chân thứ 2.
- **Tiền định kỳ > tiền theo giờ.** Freelance trả hoá đơn; SaaS/sản phẩm mới là thứ giải phóng bạn khỏi đổi-giờ-lấy-tiền. Ưu tiên xây tài sản ngay khi có dư địa.

---

## E. Nếu chỉ làm 1 việc trong 90 ngày tới

> **Freelance ngách (tuần 1–6) → có dòng tiền + 3 review → song song khởi động Micro-SaaS Check Toa (từ tuần 4).** Bỏ qua mọi thứ khác cho tới khi 2 chân này chạy.

*Cập nhật: 28/06/2026.*
