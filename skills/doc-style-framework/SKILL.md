---
name: doc-style-framework
description: Apply unified document style system. Trigger when user requests HTML documents, flow diagrams, or says "套用文件風格", "用標準樣式", "標準風格", "doc style". Covers: document layout with sidebar TOC, typography, callouts, tables, badges, and flow diagram components (horizontal, vertical, mixed layouts).
---

# Doc Style Framework Skill

Unified HTML document and flow diagram style system.

## Supporting files (in this skill directory)

- `ref/css/style-framework.css` — complete stylesheet
- `ref/js/doc-framework.js` — sidebar / theme toggle logic
- `template.html` — reference template showing full page structure

---

## Trigger Conditions

Apply this skill when the user:
- Requests an HTML document output
- Says "套用文件風格", "用標準樣式", "標準風格", "doc style framework"
- Requests a flow diagram in HTML/SVG format
- Asks to convert markdown to styled HTML
- Asks to draw a role/document/process flow diagram

---

## Complexity Judgment Responsibility

Beyond applying style, this skill MUST analyze the target content's complexity and
**proactively recommend** whether the document should stay as plain `md` or be upgraded
to styled HTML. Perform this judgment before producing output; state the recommendation
explicitly, especially when it differs from what the user asked for.

| Signal | Format |
| --- | --- |
| Single component, linear content, ≤1 flow diagram (e.g. a single skill guide) | md |
| Multiple flow / architecture diagrams, cross-component relationships, length too long for md to skim (e.g. a full V-model explainer) | styled HTML |

If signals are mixed, prefer the higher-fidelity format (styled HTML) and note why.

---

## Output Rules

**Rule 1 — Standalone HTML (most common case)**

Produce a fully **self-contained single `.html` file**:
1. Read `${CLAUDE_SKILL_DIR}/ref/css/style-framework.css` → embed in `<style>` block inside `<head>`
2. Read `${CLAUDE_SKILL_DIR}/ref/js/doc-framework.js` → embed in `<script>` block at bottom of `<body>`
3. Use `template.html` at `${CLAUDE_SKILL_DIR}/template.html` as structural reference

The output file must open correctly with no external dependencies.

**Rule 2 — Snippet for existing doc**

Use the CSS classes and HTML patterns documented below. Do not re-embed CSS/JS.

**Rule 3 — Always**
- Import `Atkinson Hyperlegible Next` (body) + `IBM Plex Mono` (code) via Google Fonts in `<head>`
- Default theme: `data-theme="dark"` on `<html>`
- Default accent: Green `#1D9E75` unless user specifies otherwise
- Define full accent scale in `:root` whenever writing inline CSS
- Section IDs: `sec-[slug]`; section markers: `§ [number]`

**Rule 4 — AI-readable summary block (design / spec HTML — doc↔code sync)**

For any HTML that documents a **design or specification** (architecture docs, design docs, spec
sheets — NOT one-off snippets or purely presentational pages), embed a machine-readable
`AI-SUMMARY` block as an **HTML comment inside `<head>`** (invisible to readers). Its purpose is to
let an AI quickly **locate and update** the HTML when the underlying spec later expands or changes,
so the document and the code do not drift apart.

The block MUST contain:
- `purpose`, `component`, `repo`, `doc-type`, `last-sync` (date)
- `sources-of-truth` — the authoritative files this HTML projects from (e.g. ADR / plan / register /
  headers). **The HTML is a narrative projection, NOT the source of truth.**
- `canonical-facts` — the drift-prone values gathered in one place (schemas, paths, contracts,
  rejected options, gate / defect IDs, key thresholds).
- `sections` — `<section id>` → topic → which source it derives from (the update lookup map).
- `update-protocol` — the steps to keep it synced: change the source first → locate the affected
  `<section id>` via the map → update visible content + `canonical-facts` + `last-sync`; if a diagram
  is affected, update **both** the README Mermaid and the in-doc SVG.

Keep the block in sync on **every** edit and bump `last-sync`. Format the body as readable YAML-style
key/value lines inside the comment.

```html
<!-- ═══ AI-SUMMARY (machine-readable; keep in sync with visible content + code) ═══
purpose: ...
component: ...
last-sync: YYYY-MM-DD
sources-of-truth: [ ... ]
canonical-facts: { ... }          # drift-prone values, single place
sections: { sec-id: {topic, src}, ... }
update-protocol: |
  1. change source-of-truth first (this HTML is a projection)
  2. locate affected <section id> via the map
  3. sync visible content + canonical-facts + last-sync
  4. if a diagram changed: update README Mermaid AND in-doc SVG
═══ -->
```

---

## Design System Rules

### Single Variable Color Control
All colors derive from ONE variable. Only change `--accent`:
```css
:root {
  --accent: #1D9E75; /* default: Green */
}
```

Color scheme reference:
- Green:  `#1D9E75` (default)
- Blue:   `#378ADD`
- Purple: `#7F77DD`
- Coral:  `#D85A30`
- Amber:  `#EF9F27`
- Teal:   `#0F6E56`
- Gray:   `#888780`
- Pink:   `#D4537E`

### Required accent scale variables
Always define these in `:root` alongside `--accent`:
```css
--accent-50:  (lightest tint)
--accent-100: (light tint)
--accent-200: (medium tint)
--accent-600: (dark shade)
--accent-800: (darker shade)
--accent-900: (darkest shade)
--accent-dim: color-mix(in srgb, var(--accent) 15%, transparent)
--accent-soft: color-mix(in srgb, var(--accent) 30%, transparent)
```

### Typography (dyslexia-friendly)
- Body font: Atkinson Hyperlegible Next (Google Fonts) — high legibility, strong letter differentiation
- Mono font: IBM Plex Mono (Google Fonts)
- Base size: 16px, line-height: 1.75
- letter-spacing: 0.02em, word-spacing: 0.05em (WCAG SC 1.4.12)
- text-align: left only — never justify (irregular spacing worsens reading difficulty)
- Avoid: long italic blocks, all-caps paragraphs, underlines (except links)
- Contrast: 8–10:1 (no pure black/white — prevents halation for dyslexic readers)
- Reading aid: `.read-anchor` + `.read-bionic` (Bionic Reading, profile-driven: auto for ND/dyslexia, else opt-in) — bold anchor + dimmed field; see Component Reference

---

## Page Structure

Every document uses this layout:

```html
<div class="sidebar-overlay" id="sidebar-overlay"></div>
<div class="doc-layout">
  <aside class="doc-sidebar" id="doc-sidebar">
    <!-- sidebar content -->
    <button class="sidebar-collapse-btn" id="btn-collapse">‹ 收起目錄</button>
  </aside>
  <button class="sidebar-expand-tab" id="btn-expand">›</button>
  <div class="doc-main">
    <header class="doc-topbar">
      <button class="btn-hamburger" id="btn-hamburger"><!-- 3 spans --></button>
      <button class="btn-theme" id="btn-theme"><!-- theme toggle --></button>
    </header>
    <main class="doc-content">
      <!-- document content -->
    </main>
  </div>
</div>
```

### Sidebar behavior
- Desktop: default expanded, collapse button at bottom collapses to 0px, expand tab appears on left edge
- Mobile (≤768px): default hidden, hamburger (☰) opens as overlay, overlay click closes

### Nav item pattern
```html
<a class="nav-item" data-target="sec-id" href="#sec-id">
  <span class="nav-item-dot"></span>Section Name
</a>
```
`data-target` must match the `id` on the section for scroll spy to work.

### Required JS element IDs
- `doc-sidebar` — sidebar element
- `sidebar-overlay` — mobile overlay div
- `btn-hamburger` — mobile open button
- `btn-collapse` — desktop collapse button
- `btn-expand` — desktop expand tab
- `btn-theme` — theme toggle button
- `theme-icon` — icon span inside theme button
- `theme-label` — label span inside theme button

---

## Component Reference

### Document header
```html
<header class="doc-header">
  <span class="doc-tag">TAG</span>
  <h1 class="doc-title">Title</h1>
  <p class="doc-subtitle">Subtitle</p>
  <div class="doc-meta">
    <span class="doc-meta-item">📅 date</span>
    <span class="doc-meta-item">✍️ author</span>
  </div>
</header>
```

### Section anchor (place before every h2)
```html
<span class="section-id" id="sec-xxx">§ 01</span>
<h2>Section Title</h2>
```

### Callout types
- `.callout.info` + ℹ️
- `.callout.warn` + ⚠️
- `.callout.danger` + 🚫
- `.callout.success` + ✅

### Badge classes
- `.badge-green` `.badge-blue` `.badge-orange` `.badge-red` `.badge-gray`

### Diagram wrapper (SVG)
```html
<div class="diagram-wrap">
  <div class="diagram-label">▸ label</div>
  <svg width="100%" viewBox="0 0 680 H" role="img">
    <title>description</title>
    <!-- nodes and arrows -->
  </svg>
</div>
```

### Summary grid + card
```html
<div class="summary-grid">
  <div class="card">
    <div class="icon">📦</div>
    <div class="label">LABEL</div>
    <div class="value">Value</div>
    <div class="desc">Description text</div>
  </div>
  <!-- more cards -->
</div>
```

### Tag pills
```html
<div class="tags">
  <span class="tag">default</span>
  <span class="tag green">green</span>
  <span class="tag blue">blue</span>
  <span class="tag orange">orange</span>
  <span class="tag red">red</span>
  <span class="tag purple">purple</span>
  <span class="tag accent">accent</span>
</div>
```

### Diagram box (Mermaid)
For Mermaid.js diagrams. Requires CDN script — NOT self-contained (unlike SVG `diagram-wrap`).
```html
<div class="diagram-box">
  <div class="mermaid">
    graph TD
      A[Start] --> B[End]
  </div>
</div>
<!-- requires: <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js"></script> -->
```

### Section box
```html
<div class="section-box">
  <h3>Grouped content</h3>
  <p>Content inside a card-style container.</p>
</div>
```

### Highlight box
```html
<div class="highlight-box">
  <strong>Key point:</strong> Important information highlighted with accent border.
</div>
```

### Reading anchor (`.read-anchor`) — Bionic Reading, profile-driven

**Activation (profile-driven):**
- **Auto-enable** when the active CLAUDE.md / loaded profile declares the user as neurodivergent (ND — autism/ADHD/AuDHD) or having a reading-related disability (dyslexia/CAPD): apply `.read-bionic` + `.read-anchor` to generated **body prose BY DEFAULT** (accessibility personalization; same spirit as the always-on dyslexia-friendly font/contrast, just a stronger aid).
- **Opt-in (default OFF)** otherwise: apply only when the user explicitly requests "bionic reading" / "閱讀錨點" for that output (existing docs unchanged).
- Either mode is **per-output overridable** (turn off in auto mode; turn on in opt-in mode). Applies to body prose only — never code blocks / identifiers.

Bionic Reading bolds word-initial letters so the eye fixates on the bold prefix and the brain completes the rest — the effect comes from the **bold/non-bold contrast WITHIN each word**. So the anchor granularity is **bilingual / script-dependent**:

- **English**: keep original Bionic — bold ONLY the word prefix (~40–50% of letters; 1 letter for ≤3-letter words), leave the tail at baseline. **Never bold the whole word** — Latin words are long letter-strings; whole-word bold kills the intra-word contrast and a run of English blurs into solid bold (anti-effect).
- **Chinese**: no spaces, no letter-prefix — anchor the whole **content word (有意義的詞語)** (full strength + bold); function words (的/了/在/和/與/這…) + punctuation stay baseline. A zh word is 2–4 dense chars, so whole-word anchoring does not blur.

**Contrast = bold + opacity, NOT a highlight color.** Per bionic-reading.com, the Bionic method uses Fixation (bold amount) + Saccade + Opacity; it uses **no highlight color**. So the anchor pops via "full-strength bold vs dimmed field," which works in pure English too (a brighter same-family anchor color is invisible there, and brightening toward white violates this framework's halation rule):

- **Anchor**: `color: var(--text-primary)` (full) + `font-weight: 700`.
- **Field**: container `.read-bionic` dims non-anchor text to `var(--text-secondary)` (= the Opacity knob); whether it is applied is governed by Activation above. Theme-aware via existing primary/secondary; **no `--text-anchor` variable**.

Wrap content in `.read-bionic`, then mark anchors — whole content word for zh; prefix letters for English:

```html
<!-- container dims the field; zh = whole word, English = prefix; both full + 700 -->
<p class="read-bionic">這個 <b class="read-anchor">控制迴圈</b> 以 <b class="read-anchor">1 ms 週期</b>
   運行，超時會 <b class="read-anchor">觸發</b> <b class="read-anchor">fai</b>lover。</p>
```

- CSS rules: `.read-anchor { color: var(--text-primary); font-weight: 700; }` · `.read-bionic { color: var(--text-secondary); }`

**Markup rules:**
- **English**: bold each word's prefix (~40–50%), tail baseline. All-caps acronyms / identifiers (`SCHED_FIFO`, `CPU`, `RT`) = one token: bold whole or skip, **never split the prefix** (splitting blurs more).
- **Chinese**: anchor = meaning-bearing units (nouns, verbs, key tech terms, number+unit); function words (的/了/在/和/與/也/就/而/這/那/嗎…), particles, punctuation stay baseline.
- **Don't over-anchor** — if everything is anchored, nothing is. zh rule of thumb: anchor the words you'd keep compressing the sentence to a telegram (≈ one per clause head).

### Flow row (CSS-only horizontal flow)
No SVG needed. For simple linear flows.
```html
<div class="flow-row">
  <div class="step">Step 1</div>
  <span class="arrow">→</span>
  <div class="step green">Step 2</div>
  <span class="arrow">→</span>
  <div class="step blue">Step 3</div>
</div>
```
Filled variants: `.step.green` `.step.blue` `.step.orange`

### New badge
Inline version / new marker.
```html
<h2>Feature Name <span class="new-badge">NEW</span></h2>
```

---

## Flow Diagram Node Classes

All SVG nodes use CSS classes — colors auto-follow `--accent`.

| Class           | Shape                             | Use                     |
| --------------- | --------------------------------- | ----------------------- |
| `flow-role`     | rect rx=10                        | Role / Agent node       |
| `flow-role-tx`  | text                              | Role node title text    |
| `flow-role-sub` | text                              | Role node subtitle text |
| `flow-doc`      | rect rx=4, stroke-dasharray="4 2" | Document node           |
| `flow-doc-tx`   | text                              | Document node text      |
| `flow-act`      | rect rx=4, solid border           | Action step node        |
| `flow-act-tx`   | text                              | Action node text        |
| `flow-dec`      | polygon (diamond)                 | Decision node           |
| `flow-dec-tx`   | text                              | Decision node text      |
| `flow-arr`      | line / path                       | Arrow connector         |

**Critical:** Never use inline `fill=` or `stroke=` on flow diagram elements. Always use CSS classes (either the single-accent `flow-*` set, or the semantic `fn-*` set below).

### Semantic category colors (`fn-*`) — for diagrams that need type distinction

The single-accent `flow-*` set keeps a diagram monochrome (brand-consistent). When a diagram
benefits from **distinguishing node categories by color** (e.g. scm / build / test / base / tool
each its own color), use the `fn-*` set instead. Both are CSS-class-driven (no inline fill/stroke);
`fn-*` simply does not follow `--accent`. Defined in `style-framework.css`, theme-aware (dark/light).

| Class        | Color   | Typical use                      |
| ------------ | ------- | -------------------------------- |
| `fn-purple`  | purple  | scm / download-upload            |
| `fn-green`   | green   | build / packing                  |
| `fn-orange`  | orange  | test                             |
| `fn-blue`    | blue    | base image / infra               |
| `fn-coral`   | coral   | tool / dispatcher / entry        |
| `fn-gray`    | gray    | neutral step / artifact          |
| `fn-tx`      | —       | node title text (text-primary)   |
| `fn-sub`     | —       | node subtitle text (text-secondary) |
| `fn-arr`     | —       | arrow connector (neutral muted)  |

Node = an explicit hex tint of the category color (dark default + `[data-theme="light"]` override,
hardcoded — NOT `color-mix`, so it renders on every browser incl. older / other-team environments)
+ that color as stroke; title uses `text-primary` so it stays readable in both themes. For dashed
(document / planned) nodes add the geometry attribute `stroke-dasharray="4 2"` (geometry, not color
— allowed inline).

**Guidance:** linear / single-concern flow → `flow-*`; multi-category architecture or pipeline
diagram where readers must tell node types apart → `fn-*`.

### Arrow marker (always include in SVG defs)
```svg
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
```
Use unique marker IDs per SVG if multiple diagrams on page: `arr-h`, `arr-v`, `arr-m`.

### Required flow CSS block
```css
.flow-role    { fill: var(--accent); stroke: var(--accent-600); }
.flow-role-tx { fill: var(--accent-50); }
.flow-role-sub{ fill: var(--accent-100); }
.flow-doc     { fill: var(--accent-50); stroke: var(--accent-200); }
.flow-doc-tx  { fill: var(--accent-800); }
.flow-dec     { fill: var(--accent-100); stroke: var(--accent); }
.flow-dec-tx  { fill: var(--accent-900); }
.flow-act     { fill: var(--bg-elevated); stroke: var(--border); }
.flow-act-tx  { fill: var(--text-primary); }
.flow-act-sub { fill: var(--text-secondary); }
.flow-arr     { stroke: var(--accent-600); fill: none; }
[data-theme="light"] .flow-role-tx { fill: #fff; }
[data-theme="light"] .flow-role-sub{ fill: var(--accent-50); }
```

---

## Three Layout Patterns

### Horizontal (left → right)
```
viewBox="0 0 680 120"
[role] → [doc] → [role] → [doc] → [end-ellipse]
```
Node spacing: role width 90px, doc width 100px, gap 20px between nodes.

### Vertical (top → bottom, with decision)
```
viewBox="0 0 680 400"
[start-ellipse]
      ↓
   [role]
      ↓
  <decision>
  /        \
[act-no]  [act-yes]
  ↓  loop    ↓
            [doc]
              ↓
           [end]
```

### Mixed (multi-role vertical → converge → horizontal)
```
viewBox="0 0 680 260"
[role1] → [doc1] \
[role2] → [doc2]  → [SE] → [SyRS] → [SWA]
[role3] → [doc3] /
[role4] → [doc4] /
```

---

## Content Template — Section Structure by Document Type

Based on Diataxis taxonomy + Good Docs Project templates + Arc42 + Google Design Doc conventions.

### Analysis Report (Diataxis "Explanation")

| Section | Suggested components |
| --- | --- |
| Overview | `.doc-header` + `.summary-grid` (KPI cards) |
| Scope & Method | `.callout.info` + `.tags` (scope tags) |
| Key Findings | `.highlight-box` + `.flow-row` (finding flow) |
| Architecture | `.diagram-box` (Mermaid) or `.diagram-wrap` (SVG) |
| Detail Sections | `.section-box` + tables + `.tag` pills |
| Gaps & Risks | `.callout.warn` / `.callout.danger` |
| Recommendations | `.callout.success` + `.badge-*` (priority) |
| Appendix | tables, code blocks |

### User Guide (Diataxis "Tutorial" + Good Docs how-to)

| Section | Suggested components |
| --- | --- |
| Overview | `.doc-header` + `.callout.info` (audience) |
| Prerequisites | `.callout.warn` + checklist table |
| Quick Start | `.flow-row` (numbered steps) + `.highlight-box` |
| Feature Walkthrough | `.section-box` per feature + screenshots |
| Configuration | tables + code blocks + `.callout.info` |
| Troubleshooting | `.callout.danger` + `.callout.success` (fix) |
| FAQ | `.section-box` per Q&A |
| Glossary | definition table |

### Design Document (Google Design Doc + Arc42 subset)

| Section | Suggested components |
| --- | --- |
| Context & Problem | `.doc-header` + `.callout.info` |
| Goals & Non-goals | two-column table or `.highlight-box` |
| Design Overview | `.diagram-box` (Mermaid) + `.summary-grid` |
| System Architecture | `.diagram-wrap` (SVG) + `.section-box` |
| Key Decisions | `.callout.info` (ADR style) + `.tags` |
| Alternatives Considered | comparison table + `.badge-*` (verdict) |
| Risks & Open Questions | `.callout.warn` + `.tag.red` |

### System Documentation (Arc42 full + Diataxis "Reference")

| Section | Suggested components |
| --- | --- |
| Introduction & Goals | `.doc-header` + `.summary-grid` |
| System Context | `.diagram-box` (context diagram) |
| Architecture Overview | `.diagram-wrap` (SVG building blocks) |
| Building Blocks | `.section-box` per module + `.tags` |
| Runtime Behavior | `.diagram-box` (sequence diagram) + `.flow-row` |
| Deployment | `.diagram-wrap` (deployment view) + tables |
| Crosscutting Concerns | `.callout.info` / `.callout.warn` per concern |
| API Reference | tables + code blocks + `.badge-*` |
| Quality & Performance | `.summary-grid` (metrics) + `.highlight-box` |
| Glossary | definition table |

---

## Responsive Breakpoints

| Name | Width    | Sidebar behavior        |
| ---- | -------- | ----------------------- |
| xs   | < 480px  | Mobile, minimal padding |
| sm   | < 768px  | Mobile overlay sidebar  |
| md   | < 1024px | Tablet, reduced padding |
| lg   | < 1280px | Small desktop           |
| xl   | ≥ 1280px | Full desktop            |