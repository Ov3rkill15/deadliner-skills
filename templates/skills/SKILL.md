---
name: lms-course-extractor
description: >-
  Extract, analyze, and synthesize LMS/Moodle course materials across weeks (slides, quizzes,
  assignments, videos, and syllabus), generate comprehensive Q&A with strict LMS source citations,
  and compile into a publication-ready academic study guide PDF using ReportLab. Use when the user
  provides an LMS course URL and session token/cookie to archive, summarize, or produce study guides
  and practice banks.
metadata:
  priority: 8
  tags:
    - lms
    - moodle
    - course-extraction
    - pdf-compilation
    - reportlab
    - academic-summary
---

# LMS Course Extractor & Academic Study Guide Generator

This skill teaches agents how to systematically crawl an LMS course (Moodle, Celoe, Canvas, etc.), extract all educational assets across academic weeks (slides, quizzes, assignments, videos, and syllabus), perform deep multimodal inspection (including video inspection and quiz review harvesting), generate exhaustive Q&A banks with strict source citations, and compile everything into a professional, multi-page academic PDF study guide using ReportLab.

---

## 1. Workflow Overview

```
[LMS Course URL + Session Cookie]
                │
                ▼
1. Authentication & Cookie Injection (PowerShell / Python / Obscura)
                │
                ▼
2. Course Discovery & Asset Harvesting
   ├─ Slides & Files: mod/resource, mod/url (SharePoint/Google Drive download=1)
   ├─ Quizzes: mod/quiz -> review.php attempts (Feedback & Correct Answers)
   ├─ Assignments: mod/assign (briefs, templates, submission formats)
   ├─ Videos: mod/hvp (H5P Interactive Video, YouTube IDs) -> chapters & frames
   └─ Syllabus / RPS: course competencies, Sub-CLOs, evaluation weights
                │
                ▼
3. Deep Multi-Format Extraction
   ├─ PPTX (python-pptx): slides, tables, speaker notes, embedded diagrams
   ├─ PDF (PyMuPDF/fitz): text, vector/raster diagrams
   ├─ Quizzes: regex parsing of questions, choices, feedback, answers
   └─ Video Inspection: yt-dlp chapters + subtitles, ffmpeg frame contact sheets
                │
                ▼
4. Content Synthesis & Bank of Q&A
   ├─ Per-week comprehensive summaries
   ├─ Concept Q&A + Practice Exam Q&A
   └─ Strict LMS Source Citation: `Sumber di LMS: [Activity], slide X / soal Y / menit Z`
                │
                ▼
5. Professional PDF Compilation (ReportLab)
   ├─ Academic typography (Arial / Consolas font family)
   ├─ Two-pass dynamic Table of Contents with bookmarks
   ├─ Structured Q&A cards with color callouts & answer arrow markers
   └─ Header/Footer with running titles and dynamic "Halaman X"
```

---

## 2. Phase 1: Authentication & Course Discovery

### A. Session Cookie Injection
Moodle-based LMS instances protect resources with session cookies (`MoodleSession`).
When provided with a cookie:

1. **Via PowerShell WebRequestSession**:
```powershell
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$cookie = New-Object System.Net.Cookie("MoodleSession", "<COOKIE_VALUE>", "/", "<DOMAIN>")
$s.Cookies.Add($cookie)
$resp = Invoke-WebRequest -Uri $CourseUrl -WebSession $s -UseBasicParsing
```

2. **Via Obscura Browser**:
```powershell
obscura fetch $CourseUrl --cookie "MoodleSession=<COOKIE_VALUE>" --dump links
```

3. **Via Python `requests`**:
```python
import requests
session = requests.Session()
session.cookies.set("MoodleSession", "<COOKIE_VALUE>", domain="<DOMAIN>", path="/")
resp = session.get(course_url)
```

### B. Discovering Activities & External Links
Scan the course HTML (`course/view.php?id=<ID>`) for:
* Sections (`#section-1` to `#section-N` or `collapseSection-<ID>`)
* Activity links:
  * `/mod/url/view.php?id=<id>`: External links (SharePoint, Drive, Box, external sites).
  * `/mod/resource/view.php?id=<id>`: Hosted PDFs, ZIPs, Word docs.
  * `/mod/quiz/view.php?id=<id>`: Quizzes.
  * `/mod/assign/view.php?id=<id>`: Assignments.
  * `/mod/hvp/view.php?id=<id>`: Interactive Videos (H5P).
  * `/mod/forum/view.php?id=<id>`: Announcements.

### C. Resolving External SharePoint / Drive Redirects
* SharePoint links from university instances (`telkomuniversityofficial-my.sharepoint.com/:p:/g/...`):
  Append `&download=1` to force direct binary download of `.pptx`, `.xlsx`, or `.pdf`.

---

## 3. Phase 2: Multi-Format Asset Extraction

### A. Slides in PowerPoint (`python-pptx`)
Extract text, tables, speaker notes, and embedded high-resolution graphics:
```python
from pptx import Presentation

prs = Presentation("slide.pptx")
for i, slide in enumerate(prs.slides, 1):
    texts = []
    for sh in slide.shapes:
        if sh.has_text_frame:
            texts.extend([p.text for p in sh.text_frame.paragraphs if p.text.strip()])
        if getattr(sh, "has_table", False) and sh.has_table:
            for row in sh.table.rows:
                texts.append(" | ".join(c.text.strip() for c in row.cells))
        # Extract embedded raster graphics (shape_type == 13)
        if sh.shape_type == 13:
            with open(f"img_slide_{i}.png", "wb") as f:
                f.write(sh.image.blob)
    notes = slide.notes_slide.notes_text_frame.text if slide.has_notes_slide else ""
```

### B. Slides / Docs in PDF (`PyMuPDF` / `fitz`)
```python
import fitz

doc = fitz.open("slide.pdf")
for i, page in enumerate(doc, 1):
    text = page.get_text()
    # Extract key diagram pages as images (DPI 100-150 for crisp PDF re-embedding)
    pix = page.get_pixmap(dpi=120)
    pix.save(f"page_{i}.png")
```

### C. Quizzes & Review Extraction (`mod/quiz/review.php`)
Students often have attempts with complete feedbacks. Extract the review page:
```python
url = f"https://<LMS_DOMAIN>/mod/quiz/review.php?attempt={attempt_id}&cmid={cmid}"
resp = session.get(url)
# Parse question blocks:
# - Question text
# - Option choices (a, b, c, d, e)
# - Official feedback / The correct answer is: ...
```

### D. Embedded Videos (H5P / YouTube)
1. **Find Video URL**: Look in `/mod/hvp/embed.php?id=<id>` inside the `H5PIntegration` JSON payload for the video file path or YouTube ID.
2. **Retrieve Subtitles / Chapters**:
```bash
python -m yt_dlp --skip-download --write-auto-subs --sub-langs "id,en" --sub-format vtt --print "%(chapters)s" "https://www.youtube.com/watch?v=<ID>"
```
3. **Visual Inspection When Subtitles Are Disabled**:
   * If subtitles are disabled (`TranscriptsDisabled`), download the low-res video stream (`best[height<=480]`).
   * Extract video frames across timeline intervals:
     ```bash
     ffmpeg -ss <SECONDS> -i video.webm -frames:v 1 -vf "scale=800:-1" frame.png
     ```
   * Combine into contact sheets using `xstack` for quick visual inspection.

---

## 4. Phase 3: Content Synthesis & Bank of Q&A

### Structure of Each Weekly Chapter
1. **Daftar Materi LMS**: Table of activities, file names, URLs, and submission deadlines.
2. **Ringkasan Materi**: Comprehensive conceptual explanation divided into structured sub-sections, covering theory, architectures, configuration commands, and formulas.
3. **Tanya Jawab Konsep**: Detailed conceptual Q&A (10–20 questions per week).
4. **Tanya Jawab Kuis / Tugas**:
   * For quizzes: exact exam question text, multiple choice options, marker `►` on the correct choice, technical explanation, and LMS feedback.
   * For assignments: problem statement, required topology, step-by-step configuration, verification commands, and report template answers.
5. **Kaitan Antar-Minggu & Analisis Video**: Explaining how practical tasks link to previous theory.

### Strict Source Citation Requirement
Every single answer **must** include an explicit green source bar:
```markdown
**Sumber di LMS:** [Nama Aktivitas], slide X (atau soal Y / menit Z / RPS baris W)
```
If additional explanations or general industry context beyond the LMS files are added, explicitly tag them with **`[Tambahan]`**.

---

## 5. Phase 4: Professional PDF Compilation with ReportLab

### A. Document Architecture
Use `reportlab.platypus.BaseDocTemplate` with custom `PageTemplate`, `Frame`, and `TableOfContents`:
* **Geometry**: A4 page, left/right margins 2.0 cm, top margin 2.0 cm, bottom margin 1.8 cm.
* **Header**: Running rule with course code, title, and LMS source disclaimer.
* **Footer**: Right-aligned page counter ("Halaman X") and bottom border.
* **Dynamic TOC**: Two-pass notification via `doc.notify('TOCEntry', (level, title, page, key))`.

### B. Typography & Palette System
* **Font**: System Arial (`arial.ttf`, `arialbd.ttf`, `ariali.ttf`) and Consolas (`consola.ttf` for code).
* **Color Palette**:
  * Navy Primary: `#1F3A5F` (headers, title banners, table headers)
  * Light Blue Accent: `#EEF3F9` (question backgrounds, alternating table rows)
  * Dark Charcoal Body: `#222222` / `#0D2A4D`
  * Source Green: `#1B5E20` (LMS reference links)
  * Code Background: `#F4F4F4` with `#CCCCCC` border.
  * Note Callout: `#FFF8E1` background with `#FFB300` left accent bar.

### C. Safe Character Encoding in ReportLab TTF
Standard Windows TTF (`arial.ttf`) can fail with UnicodeEncodeError or render black boxes on non-Latin-1 glyphs:
* Convert Unicode subscripts (`₀₁₂₃₄₅₆₇₈₉`) to normal digits (`0123456789`).
* Replace unsupported symbols like checkmark `✔` with standard bullet/arrow `►` or `[v]`.
* Sanitize XML entities (`&` $\to$ `&amp;`, `<` $\to$ `&lt;`, `>` $\to$ `&gt;`).

---

## 6. Standard Reusable Scripts in this Skill

The skill includes pre-tested helper scripts under `scripts/`:
* `scripts/moodle_crawler.py`: Authenticated session crawler for Moodle course trees.
* `scripts/media_inspector.py`: Subtitle downloader and keyframe contact sheet generator.
* `scripts/academic_pdf_builder.py`: Base ReportLab pipeline with dynamic TOC, styles, tables, and quiz formatters.
