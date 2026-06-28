# Case Studies — freelance-ready (EN, anonymized)

> Dạng **Problem → Approach → Result → Stack**. Khách freelance không quan tâm code đẹp;
> họ quan tâm "bạn từng giải đúng bài như bài của tôi chưa". Mỗi case <150 từ, đọc trong 20s.
>
> ⚠️ Đã **ẩn danh** (không tên khách/doanh nghiệp). Bạn xác nhận mức được tiết lộ rồi mới đăng.
> Số liệu "kết quả" để chỗ `[…]` — điền số thật bạn nhớ; nếu không có số, dùng câu định tính đã viết sẵn.

---

## CS1 — Order & Debt Management for a Wholesale Distributor ⭐ (flagship)

**Problem.** A wholesale business tracked customer orders, supplier debt, and
payments across paper and dozens of spreadsheets. Balances drifted, payments
were applied by hand, and producing a supplier statement took hours.

**Approach.** I built a full-stack platform that models orders, payments, and
debt as a single source of truth. Payments auto-allocate across invoices using
**FIFO reconciliation**; every amount uses exact decimal arithmetic (never
floats) so balances can't drift. Added supplier/customer statements with
print-ready and QR-invoice export, plus Excel import to migrate legacy data and
audited edit/undo so a correction never corrupts a balance.

**Result.** Manual reconciliation replaced by one-click statements; balances are
provably correct; staff stopped maintaining parallel spreadsheets. [Add: "cut
statement prep from ~X hours to minutes" if you have the number.]

**Stack.** Node.js · Express · TypeScript · Prisma · PostgreSQL · React · MUI · React Query · Docker.

---

## CS2 — Sales Bot + POS Integration with AI Reporting

**Problem.** A retail/distribution operation managed orders over a messaging app
manually, with no live view of sales and slow, manual payment follow-ups.

**Approach.** Built a bot integrated with the POS API that pushes order updates,
renders sales dashboards with **AI-generated charts**, issues **QR-code payments
(VietQR)**, and sends automated payment reminders on a schedule. Image cards are
server-rendered; the whole service is containerized and deployed on Railway.

**Result.** Real-time sales visibility, automated reminders replacing manual
chasing, and self-serve QR payments. [Add a number if you have one.]

**Stack.** Node.js · Express · TypeScript · React · SQLite · Gemini API · Puppeteer · Docker · Railway.

---

## CS3 — Offline-First Voice Expense Ledger (PWA)

**Problem.** Users needed to log expenses on the go, including with no signal,
without fighting a clunky form.

**Approach.** A Progressive Web App that captures expenses by voice and stores
them locally in **IndexedDB**, working 100% offline via service workers and
syncing in the background when connectivity returns. Installable, app-like.

**Result.** A ledger that works anywhere, instantly, with zero data loss offline.

**Stack.** React · TypeScript · Dexie (IndexedDB) · Workbox · Vite · PWA.

---

## CS4 — Smart Logistics Platform (Backend + Native Mobile)

**Problem.** A regional logistics operation needed real-time driver tracking,
flexible pricing, and multi-stop delivery — across web and native mobile.

**Approach.** Designed a NestJS backend with **real-time tracking over Socket.io
(<3s latency)**, dynamic pricing rules, and empty-return matching to cut costs.
Paired with native Android/iOS apps including maps, push notifications, KYC, and
QR payments.

**Result.** Live tracking and route-aware pricing in one platform; a foundation
built for compliance and scale.

**Stack.** NestJS · TypeScript · Socket.io · PostgreSQL · native Android/iOS · maps SDK.

---

## CS5 — High-Performance E-commerce Storefront

**Problem.** An e-commerce storefront needed top-tier SEO and load performance to
compete.

**Approach.** Built a storefront engineered for **Core Web Vitals**, reaching a
**Lighthouse score near 100**, with clean SEO structure and fast first paint.

**Result.** Near-perfect performance scores and SEO-ready out of the box.

**Stack.** React · performance & SEO engineering.

---

### Cách dùng case study khi viết proposal
1. Khách có bài về **hoá đơn/công nợ/kế toán** → dẫn **CS1** (+ CS2).
2. Khách cần **bot / tích hợp / tự động hoá / AI** → dẫn **CS2** (+ CS1).
3. Khách cần **mobile / offline / realtime** → dẫn **CS3 / CS4**.
4. Khách cần **web nhanh / SEO / e-commerce** → dẫn **CS5**.
> Luôn chọn 1 case GẦN NHẤT với bài của khách, đừng liệt kê cả 5.
