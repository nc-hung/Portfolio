# CV Builder & Job Tracker Automation

## Overview

**Dự án:** Xây dựng hệ thống tự động hóa quy trình tìm việc - từ thu thập JD, phân tích yêu cầu, tạo CV tùy biến đến theo dõi trạng thái ứng tuyển.

**Tại sao:** Thay vì copy-paste thủ công từ Master CV, hệ thống sẽ dùng AI (Gemini) phân tích JD → chọn "khối lego" phù hợp → tạo CV tối ưu cho từng vị trí → xuất PDF chuẩn A4.

**Đối tượng:** Cá nhân (Nguyễn Công Hưng) — thiết kế scalable để mở rộng multi-user sau này.

---

## Project Type

**WEB** — Next.js Full-stack Application

---

## Success Criteria

- [ ] Paste URL từ itviec/careerviet/topcv/vietnamworks → tự động extract JD
- [ ] AI phân tích JD → match với Master CV → tạo CV tùy biến (VI + EN)
- [ ] Upload bất kỳ CV PDF mẫu → AI extract cấu trúc → dùng làm template
- [ ] Export PDF chuẩn A4, layout dynamic theo template đã chọn
- [ ] Dashboard hiển thị: tiến trình thu thập, JD đã phân tích, CV đã tạo
- [ ] Track trạng thái ứng tuyển (Applied/Interview/Offer/Rejected)
- [ ] Lưu lịch sử CV, so sánh version
- [ ] Đánh giá tỉ lệ match CV vs JD (%)  
- [ ] Đề xuất job nên apply dựa trên match score
- [ ] Rà soát job theo 3 chủ đề: IT/Mobile, Pháp lý/Legal, Custom keywords
- [ ] Copy nhanh thông tin CV
- [ ] **KHÔNG BAO GIỜ** truy cập vieclam24h

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 15 (App Router) | Full-stack, SSR/SSG, API routes |
| **Language** | TypeScript | Type safety, DX |
| **Database** | SQLite (Prisma) | Local-first, portable, migrate lên PostgreSQL khi scale |
| **AI** | Google Gemini API | Phân tích JD, match skills, generate CV content |
| **PDF Generate** | `@react-pdf/renderer` | Generate PDF trực tiếp từ React components |
| **PDF Parse** | `pdf-parse` + Gemini Vision | Extract text + layout structure từ uploaded PDF |
| **Scraping** | Cheerio + Fetch | Extract JD từ HTML (lightweight, no headless browser) |
| **State** | Zustand | Client-side state management |
| **Styling** | Tailwind CSS v4 | Rapid UI development |
| **Validation** | Zod | Schema validation cho forms & API |

---

## File Structure

```
cv-builder/
├── prisma/
│   └── schema.prisma              # DB schema
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Dashboard home
│   │   ├── api/
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts       # CRUD jobs
│   │   │   │   └── scrape/
│   │   │   │       └── route.ts   # Scrape JD from URL
│   │   │   ├── cv/
│   │   │   │   ├── route.ts       # CRUD CVs
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts   # AI generate CV
│   │   │   │   └── pdf/
│   │   │   │       └── route.ts   # Export PDF
│   │   │   ├── templates/
│   │   │   │   ├── route.ts       # CRUD CV templates
│   │   │   │   └── parse/
│   │   │   │       └── route.ts   # Upload PDF → AI extract structure
│   │   │   ├── analyze/
│   │   │   │   └── route.ts       # AI analyze JD + match score
│   │   │   └── search/
│   │   │       └── route.ts       # Search jobs by topic/keyword
│   │   ├── jobs/
│   │   │   ├── page.tsx           # Job listing & search
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Job detail + generated CV
│   │   ├── cv/
│   │   │   ├── page.tsx           # CV history & versions
│   │   │   └── [id]/
│   │   │       └── page.tsx       # CV detail + edit + PDF preview
│   │   ├── tracker/
│   │   │   └── page.tsx           # Application tracker board
│   │   └── settings/
│   │       └── page.tsx           # Master CV editor + API keys
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   └── Header.tsx         # Top bar
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx        # Job listing card
│   │   │   ├── JobScrapeForm.tsx  # URL input + scrape trigger
│   │   │   ├── JobAnalysis.tsx    # AI analysis display
│   │   │   ├── MatchScore.tsx     # Match % visualization
│   │   │   └── TopicFilter.tsx    # Topic tabs (IT, Legal, Custom)
│   │   ├── cv/
│   │   │   ├── CVPreview.tsx      # Live CV preview (HTML)
│   │   │   ├── CVEditor.tsx       # Edit CV sections form
│   │   │   ├── CVPdfTemplate.tsx  # PDF layout component (@react-pdf)
│   │   │   ├── CVComparison.tsx   # Side-by-side version compare
│   │   │   └── QuickCopy.tsx      # Copy section to clipboard
│   │   ├── templates/
│   │   │   ├── TemplateUpload.tsx  # Drag & drop PDF upload
│   │   │   ├── TemplatePreview.tsx # Preview extracted structure
│   │   │   ├── TemplateCard.tsx   # Template selection card
│   │   │   └── TemplateEditor.tsx # Edit extracted layout config
│   │   ├── tracker/
│   │   │   ├── TrackerBoard.tsx   # Kanban-style tracker
│   │   │   └── StatusBadge.tsx    # Status pills
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── Tabs.tsx
│   ├── lib/
│   │   ├── db.ts                  # Prisma client
│   │   ├── gemini.ts              # Gemini API wrapper
│   │   ├── scraper/
│   │   │   ├── index.ts           # Scraper router
│   │   │   ├── itviec.ts          # ITviec parser
│   │   │   ├── careerviet.ts      # CareerViet parser
│   │   │   ├── topcv.ts           # TopCV parser
│   │   │   └── vietnamworks.ts    # VietnamWorks parser
│   │   ├── template-parser.ts     # PDF → layout structure extraction
│   │   ├── cv-generator.ts        # CV assembly from Master CV blocks
│   │   ├── pdf-generator.ts       # Dynamic PDF creation from template
│   │   ├── match-scorer.ts        # JD vs CV matching algorithm
│   │   └── constants.ts           # Blocked sites, topic configs
│   ├── data/
│   │   └── master-cv.ts           # Master CV data (from nguyen_cong_hung.md)
│   ├── types/
│   │   └── index.ts               # All TypeScript types
│   └── stores/
│       └── app-store.ts           # Zustand store
├── public/
├── .env.local                     # GEMINI_API_KEY
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Task Breakdown

### Phase 1: Foundation (P0)

- [x] **T1.1** — Init Next.js project + cài dependencies
  - **Agent:** `@backend-specialist`
  - **Skill:** `app-builder/templates/nextjs-fullstack`
  - **INPUT:** `npx create-next-app@latest cv-builder --ts --tailwind --app --src-dir`
  - **OUTPUT:** Project chạy được `npm run dev`
  - **VERIFY:** `localhost:3000` hiện Next.js default page

- [x] **T1.2** — Setup Prisma + SQLite schema
  - **Agent:** `@database-architect`
  - **Skill:** `database-design`
  - **INPUT:** Design schema cho: Job, CV, CVVersion, Application, MasterCVBlock, ScrapeTopic
  - **OUTPUT:** `prisma/schema.prisma` + migration thành công
  - **VERIFY:** `npx prisma studio` mở được, tables hiển thị đúng
  - **Schema:**
    ```
    Job: id, url, source(itviec|careerviet|topcv|vietnamworks), title, company, 
         location, salary, requirements[], skills[], rawContent, analyzedData(JSON),
         matchScore, topic(IT|LEGAL|CUSTOM), status, scrapedAt
    
    CV: id, jobId?, templateId?, language(VI|EN), title, summary, skills, experience, 
        education, achievements, version, pdfUrl, createdAt
    
    CVVersion: id, cvId, diff(JSON), createdAt
    
    Application: id, jobId, cvId, status(SAVED|APPLIED|INTERVIEW|OFFER|REJECTED),
                 appliedAt, notes, nextAction, nextActionDate
    
    MasterCVBlock: id, category(TITLE|SUMMARY|SKILL|PROJECT|EDUCATION|ACHIEVEMENT),
                   variant(A|B|C), content, keywords[], language(VI|EN)
    
    CVTemplate: id, name, originalFileName, originalPdfPath,
                layoutConfig(JSON), sections(JSON), colorScheme(JSON),
                typography(JSON), isDefault, createdAt
    
    ScrapeTopic: id, name, keywords[], isDefault, createdAt
    ```
  - **CVTemplate.layoutConfig schema:**
    ```json
    {
      "columns": 1 | 2,
      "hasPhoto": boolean,
      "photoPosition": "top-left" | "top-right" | "top-center" | null,
      "hasSidebar": boolean,
      "sidebarPosition": "left" | "right" | null,
      "margins": { "top": 20, "right": 20, "bottom": 20, "left": 20 },
      "headerAlignment": "left" | "center" | "right",
      "sectionOrder": ["summary", "skills", "experience", "education", "achievements"],
      "sectionSeparator": "line" | "space" | "border" | "none",
      "colorScheme": {
        "primary": "#007bff",
        "secondary": "#333333",
        "background": "#ffffff",
        "accent": "#f0f0f0"
      },
      "typography": {
        "headingFont": "Arial",
        "bodyFont": "Arial",
        "nameSize": 24,
        "titleSize": 14,
        "sectionHeaderSize": 12,
        "bodySize": 10,
        "sectionHeaderStyle": "uppercase-bold" | "bold" | "underline"
      }
    }
    ```

- [x] **T1.3** — Import Master CV data vào `data/master-cv.ts`
  - **Agent:** `@backend-specialist`
  - **INPUT:** Dữ liệu từ `info-cv/nguyen_cong_hung.md`
  - **OUTPUT:** Structured TypeScript object với các "khối lego"
  - **VERIFY:** Import không lỗi, data đầy đủ 4 dự án + 3 summary variants

- [x] **T1.4** — Build CV Template Parser (Upload PDF → Extract Structure)
  - **Agent:** `@backend-specialist`
  - **Skill:** `nodejs-best-practices`
  - **INPUT:** Uploaded PDF file (any CV template)
  - **OUTPUT:** CVTemplate record với layoutConfig JSON
  - **VERIFY:** Upload sample CV → extracted layout matches actual structure
  - **Flow:**
    1. User uploads PDF → save to `public/templates/`
    2. `pdf-parse` extracts raw text + metadata (page count, fonts)
    3. Gemini Vision API analyzes PDF image → detect layout:
       - Số cột (1 hay 2?), có sidebar không?
       - Có ảnh không? Vị trí ảnh?
       - Thứ tự sections?
       - Color scheme (từ header/text colors)
       - Typography (font families, sizes)
       - Section separators (lines, borders, spacing)
    4. Save extracted `layoutConfig` JSON to DB
    5. User có thể chỉnh sửa config trước khi dùng
  - **Gemini prompt:**
    ```
    Analyze this CV/Resume PDF image and extract the layout structure:
    1. Number of columns (1 or 2)
    2. Does it have a sidebar? If yes, left or right?
    3. Does it have a photo? If yes, where?
    4. Header alignment (left, center, right)
    5. List all sections in order (e.g., Summary, Skills, Experience...)
    6. Section header style (uppercase-bold, bold, underline)
    7. Section separator type (horizontal line, space, border, none)
    8. Primary color (hex from headers/accents)
    9. Font style (serif or sans-serif)
    10. Margin estimation (narrow, normal, wide)
    Return as JSON matching the CVTemplate.layoutConfig schema.
    ```

---

### Phase 2: Core Backend — Scraping & AI (P1)

- [x] **T2.1** — Build scraper cho 4 trang tuyển dụng
  - **Agent:** `@backend-specialist`
  - **Skill:** `nodejs-best-practices`
  - **INPUT:** URL từ user
  - **OUTPUT:** Parsed JD data (title, company, location, requirements, skills)
  - **VERIFY:** Test với 1 URL từ mỗi source → data extract đúng
  - **Chi tiết parsers:**
    - `itviec.ts` — Extract từ itviec.com job page
    - `careerviet.ts` — Extract từ careerviet.vn job page  
    - `topcv.ts` — Extract từ topcv.vn job page
    - `vietnamworks.ts` — Extract từ vietnamworks.com job page
  - **BLOCKED:** vieclam24h ❌ (throw error nếu URL chứa "vieclam24h")

- [x] **T2.2** — Integrate Gemini API wrapper
  - **Agent:** `@backend-specialist`  
  - **INPUT:** Raw JD text
  - **OUTPUT:** Structured analysis (required skills, experience level, keywords, match suggestions)
  - **VERIFY:** API call thành công, response parse được
  - **Prompts cần build:**
    1. `analyzeJD` — Phân tích JD → extract requirements, skills, seniority
    2. `matchCV` — So sánh JD requirements vs Master CV → match score + recommendations
    3. `generateCV` — Chọn khối lego + customize content theo JD (VI hoặc EN)
    4. `suggestJobs` — Đánh giá & đề xuất nên apply hay không

- [x] **T2.3** — Build CV generator engine
  - **Agent:** `@backend-specialist`
  - **INPUT:** JD analysis + Master CV blocks + language preference
  - **OUTPUT:** Complete CV data object ready for rendering
  - **VERIFY:** Generated CV chứa đúng blocks phù hợp với JD

- [x] **T2.4** — Build Dynamic PDF generator (Template-aware)
  - **Agent:** `@backend-specialist`
  - **Skill:** `nodejs-best-practices`
  - **INPUT:** CV data object + CVTemplate.layoutConfig
  - **OUTPUT:** PDF buffer matching selected template layout
  - **VERIFY:** PDF mở được, layout khớp với template đã chọn
  - **Dynamic rendering:**
    - Đọc `layoutConfig` từ CVTemplate → render `@react-pdf` components
    - Support 1-column & 2-column layouts
    - Support sidebar variants (left/right)
    - Support photo placement (top-left/right/center)
    - Colors, fonts, sizes từ `layoutConfig.colorScheme` & `typography`
    - Section order từ `layoutConfig.sectionOrder`
  - **Default template (fallback nếu chưa upload):**
    - Font: Arial/Helvetica (sans-serif)
    - Header: Tên (bold, #007bff, 24pt), Chức danh (bold, #007bff, 14pt)
    - Contact (12pt, dot-separated)
    - Sections: ALL CAPS bold headers, no horizontal rules
    - Margin: 2cm tất cả các cạnh

- [x] **T2.5** — Build match scoring algorithm
  - **Agent:** `@backend-specialist`
  - **INPUT:** JD requirements + CV skills/experience
  - **OUTPUT:** Match score (0-100%) + breakdown by category
  - **VERIFY:** Score hợp lý khi test với JD thật

---

### Phase 3: Frontend Dashboard (P2)

- [x] **T3.1** — Layout + Navigation
  - **Agent:** `@frontend-specialist`
  - **Skill:** `frontend-design`, `tailwind-patterns`
  - **INPUT:** Design spec
  - **OUTPUT:** Sidebar + Header + responsive shell
  - **VERIFY:** Navigation hoạt động, responsive mobile
  - **Pages:** Dashboard, Jobs, CV History, Tracker, Settings

- [x] **T3.2** — Job Scrape & Analysis Page
  - **Agent:** `@frontend-specialist`
  - **INPUT:** API endpoints từ Phase 2
  - **OUTPUT:** URL input form → scrape → hiển thị JD + analysis + match score
  - **VERIFY:** Paste URL → hiện kết quả phân tích + % match
  - **Features:**
    - URL input với validation (chỉ accept 4 sources)
    - Error message nếu paste vieclam24h
    - Topic tabs: IT/Mobile | Pháp lý/Legal | Custom keywords
    - Hiển thị rõ ràng: **Vị trí** + **Công ty** + **Địa điểm** (tránh nhầm lẫn)
    - Match score với circular progress indicator
    - AI recommendation: nên apply hay không

- [x] **T3.3** — CV Generator & Preview Page
- [x] **T3.5** — Application Tracker Board (Kanban)
- [x] **T3.6** — Master CV Settings (Lego Blocks Editor)
- [x] **T3.7** — Dashboard Overview (Stats & Recent Activities)
- [x] **T3.8** — CV Template Management (PDF Parse & Layout Mapping), PDF download OK
  - **Features:**
    - **Template selector** — chọn template trước khi generate
    - Split view: Form (left) + Preview (right)
    - Toggle VI/EN
    - Quick copy từng section (clipboard)
    - Export PDF button
    - Version history dropdown
    - Drag & drop PDF upload area
    - Grid view tất cả templates (cards với thumbnail)
    - Preview: hiển thị original PDF bên cạnh extracted layout config
    - Edit: form chỉnh sửa layoutConfig (colors, fonts, order, columns...)
    - Set default template
    - Delete template

--- Status: 🟢 Production Ready (Backend & Frontend Complete)

### Phase 4: Polish & Integration (P3)

- [ ] **T4.1** — Job search by topic
  - **Agent:** `@backend-specialist`
  - **INPUT:** Topic config (IT/Legal/Custom keywords)
  - **OUTPUT:** Filtered jobs + keyword highlighting
  - **VERIFY:** Filter đúng theo topic, custom keywords hoạt động
  - **Default topics:**
    - **IT:** `["frontend", "mobile", "react native", "flutter", "chuyển đổi số", "digital transformation", "cải tiến hệ thống"]`
    - **Legal:** `["pháp lý", "legal", "VIAC", "tranh chấp", "dispute", "luật", "compliance"]`

- [ ] **T4.2** — Quick actions & UX improvements
  - **Agent:** `@frontend-specialist`
  - **INPUT:** UX requirements
  - **OUTPUT:** Copy buttons, toast notifications, keyboard shortcuts
  - **VERIFY:** Ctrl+C copy nhanh, toast hiển thị

- [ ] **T4.3** — CV continuous improvement tracking
  - **Agent:** `@backend-specialist`
  - **INPUT:** Multiple generated CVs per job
  - **OUTPUT:** Improvement suggestions based on match score trends
  - **VERIFY:** AI suggests improvements to increase match score

---

### Phase X: Verification ✅

- [ ] `npm run lint && npx tsc --noEmit` — No errors
- [ ] `npm run build` — Build thành công
- [ ] `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` — API key không exposed
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .` — UX pass
- [ ] Manual test: Paste URL → Scrape → Analyze → Generate CV → Export PDF → Track status
- [ ] Verify vieclam24h blocked
- [ ] Verify location display rõ ràng trên mọi job card

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Trang tuyển dụng thay đổi HTML structure | Scraper fail | Fallback: manual paste JD text, modular parser design |
| Gemini API rate limit | Generate chậm | Cache results, batch processing, retry logic |
| PDF layout không khớp mẫu | UX kém | Unit test PDF output, pixel comparison |
| Site block scraping | Không extract được | User-Agent rotation, delay, manual paste fallback |

---

## Blacklist Sites

```typescript
const BLOCKED_SITES = ['vieclam24h.vn', 'vieclam24h.com'];
// Throw error: "Trang web này không được hỗ trợ."
```

---

## Notes

- **Local-first:** SQLite → dễ backup, portable. Khi scale lên multi-user thì migrate sang PostgreSQL
- **AI API Key:** Lưu trong `.env.local`, KHÔNG commit lên git
- **Master CV:** Source of truth là `info-cv/nguyen_cong_hung.md`, import vào DB khi setup
- **Đa ngôn ngữ CV:** Gemini sẽ translate và adapt content, không chỉ dịch word-by-word
- **Hiển thị vị trí:** Mọi job card PHẢI hiển thị rõ: Chức danh | Công ty | Địa điểm làm việc
- **CV Template:** Hỗ trợ upload bất kỳ PDF CV mẫu → Gemini Vision phân tích layout → lưu config → dùng render PDF. Default template fallback nếu chưa upload.
- **Template Storage:** PDF gốc lưu `public/templates/`, layout config lưu DB (JSON). Thumbnail auto-generate để hiển thị trên grid.
