---
name: ai-style-detector
description: >-
  Phát hiện văn phong do AI/LLM sinh ra trong văn bản (song ngữ Việt + Anh):
  CV, portfolio, bài marketing, README, blog, mô tả sản phẩm, email. Dùng khi
  người dùng hỏi "văn này có phải AI viết không", "check AI writing", "soi văn
  phong AI", "chỗ nào giống ChatGPT/Claude viết", hoặc muốn rà một repo/thư mục
  xem đoạn nào nghe máy móc, sáo rỗng, giống AI. Trả về danh sách bằng chứng +
  mức độ tin cậy + gợi ý viết lại cho tự nhiên.
---

# AI Style Detector — Phát hiện văn phong do AI viết

## Mục đích

Chấm điểm khả năng một đoạn văn bản do **LLM sinh ra hoặc chỉnh sửa nặng**, dựa
trên các dấu hiệu văn phong (stylometric signals), rồi chỉ ra **chính xác câu/đoạn**
đáng ngờ kèm lý do. Hoạt động cho cả **tiếng Việt và tiếng Anh**.

## Nguyên tắc cốt lõi (đọc trước khi kết luận)

1. **Dấu hiệu là xác suất, KHÔNG phải bằng chứng.** Một buzzword không kết tội ai.
   Kết luận "AI" chỉ khi **nhiều dấu hiệu độc lập chồng lên nhau** trong cùng một đoạn.
2. **Người viết giỏi cũng dùng vài mẫu này.** Marketing thật, người viết SEO, hoặc
   người song ngữ dịch sát có thể trúng dấu hiệu mà không phải AI. Luôn nêu độ tin cậy.
3. **Chấm theo đoạn, không theo cả file.** Một file có thể trộn phần người viết
   (nhật ký, ý kiến cá nhân, số liệu cụ thể) và phần AI (đoạn mô tả trơn tru, sáo rỗng).
4. **Ưu tiên counter-signals** (dấu hiệu con người) trước khi buộc tội — xem mục cuối.
5. Đây là công cụ **hỗ trợ phán đoán**, không phải máy phát hiện tuyệt đối. Không có
   công cụ nào (kể cả cái này) chứng minh chắc chắn 100% văn do AI viết.

## Bộ dấu hiệu (signal catalog)

Đánh trọng số: 🔴 mạnh (2đ) · 🟡 vừa (1đ) · ⚪ yếu/ngữ cảnh (0.5đ).

### A. Từ vựng sáo rỗng (lexical tells)

**Tiếng Anh** 🟡 — cụm/ từ AI lạm dụng:
`delve`, `leverage`, `robust`, `seamless(ly)`, `elevate`, `unlock`, `harness`,
`streamline`, `tapestry`, `testament to`, `realm`, `landscape` (nghĩa bóng),
`navigate the complexities`, `ever-evolving`, `fast-paced world`, `game-changer`,
`cutting-edge`, `state-of-the-art`, `holistic`, `synergy`, `empower`, `foster`,
`facilitate`, `underscore`, `pivotal`, `crucial`, `vibrant`, `bespoke`,
`meticulous(ly)`, `sustainable software ecosystem`, `usable ... on day one`,
`architecting the future`.

**Tiếng Việt** 🟡 — cụm marketing/AI lạm dụng:
`giải pháp toàn diện`, `tối ưu hoá` (nhồi nhét), `nâng tầm`, `đột phá`, `vượt trội`,
`chuyên nghiệp` (rỗng), `đáng tin cậy`, `hàng đầu`, `tiên phong`, `bền vững`,
`hệ sinh thái`, `kiến tạo`, `kiến tạo tương lai`, `chuẩn ngành`, `mượt mà`,
`trong thời đại số`, `trong bối cảnh ... ngày càng`, `không ngừng phát triển`,
`mang đến trải nghiệm`, `đồng hành cùng`, `cam kết mang đến`.

> ⚠️ Thuật ngữ kỹ thuật cụ thể (FIFO, Prisma, Socket.io, IndexedDB, Decimal(19,4))
> KHÔNG tính là buzzword — đó là dấu hiệu **người trong nghề**, ngược dấu.

### B. Kết cấu & định dạng (structural tells)

- 🔴 **"Rule of three" lặp lại**: mọi thứ đóng gói thành cụm 3 ("nhanh, sạch, an toàn";
  "money math, audit trails, and a real deployment"). Một lần thì bình thường; xuất hiện
  liên tục khắp văn bản là tell mạnh.
- 🟡 **Bullet song song hoàn hảo**: mọi gạch đầu dòng cùng độ dài, cùng cấu trúc ngữ pháp,
  cùng bắt đầu bằng động từ — đều tăm tắp một cách phi tự nhiên.
- 🟡 **Em-dash (—) dày đặc** chèn mệnh đề bổ nghĩa giữa câu, nhiều câu liền nhau cùng kiểu.
- 🟡 **Bold từ khoá + dấu hai chấm + giải thích**: `**Khả năng mở rộng:** hệ thống ...`
  lặp lại thành khuôn.
- ⚪ **Heading gắn emoji** đều đặn (🎯, 🚀, ✅, 💡) theo mẫu.
- 🟡 **Đoạn kết tổng kết** kiểu "Tóm lại", "Nhìn chung", "In conclusion", "Overall" khi
  không cần thiết.
- ⚪ **Nhịp câu quá đều**: độ dài câu ít biến thiên, không có câu cụt, không câu chạy dài
  ngẫu hứng — thiếu "burstiness" của người thật.

### C. Tu từ (rhetorical tells)

- 🔴 **"Không chỉ X mà còn Y" / "It's not just X, it's Y" / "I don't just ..., I ..."**:
  mẫu tương phản yêu thích của LLM. Rất mạnh khi lặp lại.
- 🔴 **Khẩu hiệu hùng hồn rỗng nghĩa**: "Kiến tạo tương lai", "Architecting the future",
  "Empowering businesses to thrive" — nghe kêu nhưng không nói gì cụ thể.
- 🟡 **Superlative không kèm bằng chứng**: "hiệu quả vượt trội", "chất lượng hàng đầu",
  "world-class", "best-in-class" mà không có số liệu/ví dụ.
- 🟡 **Cân bằng giả tạo / rào đón thừa**: "Tuy nhiên, điều quan trọng cần lưu ý là...",
  "It's worth noting that...", "While ..., it's also important to...".
- 🟡 **Mô tả trơn tru nhưng trống rỗng**: câu ngữ pháp hoàn hảo, đọc xuôi tai nhưng
  không thêm thông tin mới, không có chi tiết kiểm chứng được.

### D. Nội dung (content tells)

- 🟡 **Chung chung, thiếu cụ thể**: nói "cải thiện đáng kể hiệu suất" nhưng không có con số,
  không tên hệ thống, không tình huống thật.
- 🟡 **Placeholder lộ liễu**: `[Add a number if you have one]`, `[X hours]`, `Lorem`,
  `<insert ...>` còn sót — dấu hiệu bản nháp do AI dựng khung.
- ⚪ **Định nghĩa lại điều hiển nhiên**, giải thích quá kỹ thứ không cần.

### E. Counter-signals — dấu hiệu CON NGƯỜI (trừ điểm nghi ngờ)

Thấy các dấu hiệu này thì **hạ mức nghi ngờ**, dù có vài buzzword:

- ✅ **Số liệu / chi tiết cụ thể, riêng biệt**: tên thật, ngày tháng, phiên bản, đường dẫn
  file, số đo (`60fps`, `<3s latency`, `Decimal(19,4)`, `2022–2024`).
- ✅ **Giọng cá nhân, ý kiến, cảm xúc**: đùa cợt, chửi yêu, ẩn dụ đời thường
  ("hộp lego", "nhặt khối", "đừng nhảy cóc", "Sai lầm chết người"), quan điểm chủ quan.
- ✅ **Lỗi chính tả/ngữ pháp tự nhiên, viết tắt, tiếng lóng, code-switch** giữa Việt–Anh
  theo kiểu người trong nghề.
- ✅ **Cấu trúc lộn xộn có chủ đích**, câu cụt, xuống dòng bất quy tắc, chú thích ngoặc đơn
  cá nhân ("(bắt buộc)", "→ tôi cần bạn xác nhận").
- ✅ **Kiến thức ngầm/độc quyền**: chi tiết chỉ người làm thật mới biết, quyết định đánh đổi
  cụ thể, "vì sao chọn cái này thay cái kia".

## Cách chấm điểm

Với **mỗi đoạn** đáng ngờ, cộng điểm dấu hiệu (A–D), trừ điểm counter-signals (E), rồi
xếp mức:

| Tổng điểm | Mức | Ý nghĩa |
|---|---|---|
| ≥ 5, nhiều loại dấu hiệu khác nhau | 🔴 **Cao** | Rất giống AI viết/chỉnh nặng |
| 2–4 | 🟡 **Trung bình** | Có mùi AI hoặc marketing máy móc; nên viết lại |
| 0.5–1.5 | ⚪ **Thấp** | Vài mẫu lẻ; nhiều khả năng người viết |
| ≤ 0 (counter-signals áp đảo) | ✅ **Người** | Giọng người rõ |

**Quy tắc chặn:** không xếp 🔴 nếu chỉ có 1 loại dấu hiệu (vd chỉ toàn buzzword). Cần
**≥ 2 loại độc lập** (vd C + B) cùng xuất hiện.

## Quy trình áp dụng cho một repo / thư mục

1. **Khoanh vùng văn bản người-đọc**: README, docs/, *.md, *.txt, phần text hiển thị trong
   *.html (bỏ code/script/style), mô tả trong JSON i18n, chuỗi UI. **Bỏ qua** code nguồn,
   config, lockfile — trừ khi người dùng yêu cầu soi comment/commit message.
2. **Trích text sạch**: với HTML, tách phần hiển thị (gỡ `<script>`, `<style>`, tag). Với
   JSON, lấy các chuỗi văn xuôi dài.
3. **Quét từng đoạn** theo bộ dấu hiệu, ghi lại **trích dẫn nguyên văn** (câu cụ thể) làm
   bằng chứng — không nói chung chung "đoạn này giống AI".
4. **Chấm điểm & xếp mức** cho từng đoạn có dấu hiệu.
5. **Xuất báo cáo** theo định dạng bên dưới, sắp theo mức tin cậy giảm dần.
6. (Tuỳ chọn) Nếu người dùng muốn, **đề xuất câu viết lại** tự nhiên hơn cho từng phát hiện.

## Định dạng báo cáo

Xuất một bảng, kèm trích dẫn bằng chứng. Ví dụ khung:

```
### <đường-dẫn-file>

| Mức | Đoạn/câu (trích nguyên văn) | Dấu hiệu | Vì sao |
|-----|------------------------------|----------|--------|
| 🔴 Cao | "I don't just write code; I design sustainable software ecosystems" | C (not-just-X), A (buzzword) | Mẫu tương phản LLM + "sustainable ... ecosystem" rỗng |
| 🟡 TB | "A curated selection demonstrating architectural complexity and quality" | A, D | Marketing chung chung, không có chủ ngữ/bằng chứng |
```

Sau bảng, thêm:
- **Tổng kết mỗi file**: mức chung + tỉ lệ đoạn nghi ngờ.
- **Xếp hạng toàn repo**: file nào "AI" nhất → ít nhất.
- **Lưu ý trung thực**: nhắc lại rằng đây là phán đoán xác suất, không phải bằng chứng
  tuyệt đối; nêu rõ phần nào rõ ràng do người viết (counter-signals mạnh).

## Điều KHÔNG làm

- Đừng buộc tội cả file chỉ vì 1–2 buzzword.
- Đừng bỏ qua counter-signals để câu kết luận kêu hơn.
- Đừng tính thuật ngữ kỹ thuật/con số cụ thể là dấu hiệu AI — chúng thường ngược lại.
- Đừng khẳng định chắc nịch "cái này 100% do AI" — luôn kèm độ tin cậy.
