# doc-style-framework 使用說明

> 文件輸出的統一呈現標準：HTML layout、typography、callout、table、badge、flow diagram。同時負責複雜度判斷，主動建議 md 維持或升級 styled HTML。本文件為使用說明，遵守 `skills-overview.md` 條目標準。

---

## 定位

此 skill 是**文件輸出呈現標準**。任何需要對外呈現的文件，套用同一套樣式系統，確保 sidebar TOC、字體、callout、table、badge、flow diagram（horizontal / vertical / mixed）風格一致。

除了套樣式，它還負責**複雜度判斷**：在產出前分析內容複雜度，主動建議文件該維持 `md` 還是升級為 styled HTML，並在建議與使用者要求不同時明確說明。

樣式資源放在 skill 目錄下：

- `ref/css/style-framework.css` — 完整 stylesheet
- `ref/js/doc-framework.js` — sidebar / theme toggle 邏輯
- `ref/template.html` — 完整頁面結構參考 template

## 觸發方式

當使用者：

- 要求 HTML 文件輸出
- 說「套用文件風格」「用標準樣式」「標準風格」「doc style」「doc style framework」
- 要求 HTML / SVG 格式的 flow diagram
- 要求把 markdown 轉成 styled HTML
- 要求繪製 role / document / process flow diagram

## 複雜度判準

| 訊號 | 格式 |
| --- | --- |
| 單一元件、線性內容、≤1 張流程圖（如單一 skill guide） | md |
| 多張流程 / 架構圖、跨多元件關係、篇幅長到 md 難掃讀（如整份 V-model 說明） | styled HTML |

訊號混合時，傾向採用較高保真的格式（styled HTML），並說明原因。複雜度判準只決定**格式軸**，語言軸（zh-TW / 英文）不受影響。

## Accessibility 設計原則（dyslexia-friendly）

> 依據 British Dyslexia Association (BDA) Style Guide 2023、WCAG 2.2 SC 1.4.12、W3C COGA 認知無障礙指引。

- **字型**：body 用 Atkinson Hyperlegible（Braille Institute 專為可讀性設計，高 x-height、字母區分度強）；code 用 IBM Plex Mono
- **字級**：body baseline `16px`（BDA/WCAG 建議 ≥16px）
- **行高**：`1.75`（dyslexia 建議 1.5–2.0 範圍）
- **字距**：`letter-spacing: 0.02em`、`word-spacing: 0.05em`（WCAG SC 1.4.12 最低門檻；減少字母黏連混淆）
- **對齊**：body `text-align: left`；**禁止 justify**（齊行排版會產生不規則字間空白，加劇閱讀困難）
- **配色**：避免純黑 `#000` / 純白 `#FFF` 的高對比組合（>12:1 會產生字河效應 halation）；dark theme 用暖灰（`#1A1C22` 系）、light theme 用 cream off-white（`#FAF8F5` 系），對比維持 8–10:1（遠超 WCAG AA 4.5:1 門檻）
- **避免**：長段落斜體、全大寫文字段落、底線（連結除外）

### 閱讀錨點（read-anchor）— Bionic Reading 中文化

> **啟用條件（profile-driven）**：
> - **自動啟用**：active CLAUDE.md / 載入的 profile 若聲明使用者為 **ND（neurodivergent：autism / ADHD / AuDHD）或有閱讀相關障礙（dyslexia / CAPD / 閱讀障礙）**，doc-style-framework 產 HTML 時**內文預設**套用 `.read-bionic` + `.read-anchor`（accessibility 個人化；與既有 dyslexia-friendly 字型/對比同精神，只是更強的輔助）。
> - **opt-in（預設 OFF）**：profile 未聲明上述狀況時維持 opt-in——只有使用者要求「bionic reading」「閱讀錨點」該次輸出才套用（既有文件不受影響，遵守 Minimal Intervention）。
> - 兩模式皆可**逐次覆寫**：自動模式可說「這次不要 bionic」關閉；opt-in 模式可當次要求開啟。套用對象為**內文 prose**，不含 code block / identifier。

**概念**：Bionic Reading 原理是把每個英文單字的**前半截字母加粗**，製造人工 fixation point，引導視線、減少 saccade 負擔。Bionic 的效果來自**字內「粗／不粗」對比交替**（眼睛停在粗字頭、大腦補完字尾）。本框架因此**雙語分流**——兩種 script 的資訊密度不同，錨點 granularity 也不同：

- **英文**：保留原版 bionic——每個英文單字**只加粗字頭**（約前 40–50% 字母；短字 ≤3 字母加 1 個），字尾留 baseline。**不可整詞加粗**：拉丁文字是長字母串，整詞加粗會殺掉字內對比，一段英文糊成一片粗體（反效果）。
- **中文**：方塊字無空格、無「字頭字母」，改錨在「**有意義的詞語（content word）**」整詞做**加粗（全亮）**，function word（的／了／在／和／與／這…）與標點留 baseline。中文一個詞才 2–4 字、本身夠密，整詞錨不會糊。

**對比機制（官方 bionic = bold + opacity，非高亮色）**：查證 bionic-reading.com method 頁，bionic 三參數為 Fixation（加粗程度）、Saccade（跳躍間距）、Opacity（fixation 可見強度），**官方完全不用高亮色**；emphasis 純靠**字重 + opacity（壓暗周邊）**。本框架照此做，且不引入高亮色（高彩度/高亮文字會違反本框架 dyslexia halation 原則）：

- **錨點**：`color: var(--text-primary)`（全亮）+ `font-weight: 700`。
- **周邊（field）**：容器 `.read-bionic` 把非錨點文字壓暗到 `var(--text-secondary)`（＝ Opacity 旋鈕）。是否套用由上方「啟用條件」決定。
- 對比來自「**全亮粗體 vs 壓暗常規**」，純英文也成立、中英一致，theme-aware（dark/light 各自的 primary/secondary 自動套用）。**不需新增 `--text-anchor` 色變數**。

**套用模型**：作者 / AI 在產 HTML 時，把內文包進 `.read-bionic` 容器，再把錨點包成 `<b class="read-anchor">…</b>`——**中文包整個 content word，英文只包字頭字母**。純 CSS class，**不需 JS、不需 CJK 斷詞 library**，維持 self-contained 鐵則。

```html
<!-- 容器壓暗 field；中文錨整詞、英文錨字頭，皆全亮＋700 -->
<p class="read-bionic">這個 <b class="read-anchor">控制迴圈</b> 以 <b class="read-anchor">1 ms 週期</b>
   運行，超時會 <b class="read-anchor">觸發</b> <b class="read-anchor">fai</b>lover。</p>
```

**標記準則**：

- **英文**：每個單字字頭（前 40–50%）→ 錨點，字尾 baseline。全大寫縮寫 / identifier（`SCHED_FIFO`、`CPU`、`RT`）視為單一 token，整體加粗或留 baseline，**不硬切字頭**（切了更糊）。
- **中文**：錨點 = 帶意義單位（名詞、動詞、關鍵技術詞、數值＋單位）；function word（的／了／在／和／與／也／就／而／這／那／嗎…）、助詞、標點留 baseline。
- **勿過度標記**：全標等於沒標。中文準則 = 把句子壓成電報時會保留的字（約每個子句一個錨點）。

## 核心能力

- 單一變數色彩控制（只改 `--accent`，其餘色階自動推導）
- 內容區 **置中且寬鬆**（`.doc-content` `max-width:1280px` + `margin:0 auto`，避免靠左貼 sidebar 或過窄換行）
- Sidebar TOC layout（desktop 可收合、mobile overlay）
- Component library：document header、section anchor、callout（info / warn / danger / success）、badge、diagram wrapper
- **分析型內容元件**（適合分析報告、學習型文件的內容呈現）：
  - 摘要卡片 `.summary-grid` + `.card`（KPI / 統計 / 概覽格子，icon / label / value / desc 四層結構）
  - 標籤藥丸 `.tag`（行內分類標籤，六色 dark / light 感知，pill 形狀）
  - Mermaid 圖框 `.diagram-box`（Mermaid.js 整合容器，需外部引入 mermaid CDN；與 SVG 用的 `.diagram-wrap` 並存）
  - 區段框 `.section-box`（內容分組容器，卡片式背景）
  - 重點框 `.highlight-box`（關鍵重點強調，accent 色邊框）
  - CSS 流程步驟 `.flow-row` + `.step` + `.arrow`（純 CSS 水平流程，不需 SVG；可搭配 `.step.green` / `.step.blue` / `.step.orange` 填色變體）
  - 版本標記 `.new-badge`（行內版本 / 新增標記，accent 底色白字）
- Flow diagram node class，**兩套並存**：
  - 單色 `flow-*`（`flow-role` / `flow-doc` / `flow-act` / `flow-dec` / `flow-arr`）—— 顏色跟隨 `--accent`，品牌一致，適合線性 / 單一概念流程
  - 多色 `fn-*`（`fn-blue` / `fn-green` / `fn-orange` / `fn-purple` / `fn-coral` / `fn-gray` + `fn-tx` / `fn-sub` / `fn-arr`）—— **以顏色區分節點類別**，適合多類別架構 / pipeline 圖；用**明確 hex**（非 `color-mix`，舊瀏覽器 / 其他團隊環境都保證上色），dark / light 各一組
- 三種 layout pattern：horizontal、vertical（含 decision）、mixed
- Responsive breakpoints（xs / sm / md / lg / xl）

## 輸出規則重點

- **Rule 1（最常見）**：產出完全 self-contained 單一 `.html`，css / js inline 嵌入，開檔無外部相依
- **Rule 2**：在既有文件內套用 class，不重複嵌入 css / js
- **Rule 3**：固定 import Atkinson Hyperlegible（body）/ IBM Plex Mono（code）；預設 `data-theme="dark"`；預設 accent 綠 `#1D9E75`
- **Rule 4（design / spec HTML — 防 doc↔code 漂移）**：產出**設計/規格類**長青文件（design doc、architecture、spec、reference；**非**一次性 snippet 或純展示頁）時，須在 `<head>` 內嵌一段**機器可讀的 `AI-SUMMARY` HTML comment**（對讀者隱形），讓 AI 在來源變更時能定位回更新。必含四欄：
  - `sources-of-truth` — 本 HTML 投影自哪些權威檔（ADR / plan / register / summary.yaml…）
  - `canonical-facts` — 易漂移的值集中一處（schema、路徑、contract、門檻）
  - `sections` — `<section id>` → 主題 → 來源 的對照（更新查找表）
  - `update-protocol` — 同步步驟：**先改來源** → 用對照表定位 affected `<section id>` → 更新可見內容 + `canonical-facts` + `last-sync`
  > 精神：**HTML 是投影，來源才是 source of truth**。`project-analysis` 的 as-built 回補模式即依賴此 block。

## Content Template（依文件類型的章節結構建議）

> 依據 Diataxis (diataxis.fr) 文件分類學 + Good Docs Project (thegooddocsproject.dev) per-type template + Arc42 架構文件模板 + Google Design Doc 慣例。

本 skill 除了 CSS 元件庫，也提供**依文件類型的內容結構建議**——告訴使用者「這種文件應該有哪些章節、搭配哪些元件」。

支援四種文件類型：

- **Analysis Report**（分析文件）—— Diataxis "Explanation" 型：理解導向、提供脈絡。章節：Overview → Scope & Method → Key Findings → Architecture → Detail Sections → Gaps & Risks → Recommendations → Appendix
- **User Guide**（使用者指南）—— Diataxis "Tutorial" + Good Docs how-to：任務導向、步驟明確。章節：Overview → Prerequisites → Quick Start → Feature Walkthrough → Configuration → Troubleshooting → FAQ → Glossary
- **Design Document**（設計文件）—— Google Design Doc + Arc42 subset：強調 trade-off 與決策。章節：Context & Problem → Goals & Non-goals → Design Overview → System Architecture → Key Decisions → Alternatives Considered → Risks & Open Questions
- **System Documentation**（系統說明文件）—— Arc42 full + Diataxis "Reference"：完整、準確、可查閱。章節：Introduction & Goals → System Context → Architecture Overview → Building Blocks → Runtime Behavior → Deployment → Crosscutting Concerns → API Reference → Quality & Performance → Glossary

每種類型的詳細章節 → 元件對應見 SKILL.md。

## 不會做的事

- 不改文件的語言（語言由其他規則決定）
- flow diagram 元素禁用 inline `fill=` / `stroke=`，一律走 CSS class（單色 `flow-*` 跟隨 `--accent`，或多色 `fn-*` 語意分類色）；`stroke-dasharray` 屬幾何、可 inline
