# ⚡ deadliner-skills
> **Penyelamat Mahasiswa H-1 Ujian & Tugas Kuliah**  
> Universal Multi-Agent Skills & Standalone CLI for Google Antigravity, Cursor, Claude Code, Windsurf, GitHub Copilot, and Roo Code/Cline.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Agents](https://img.shields.io/badge/AI%20Agents-Antigravity%20%7C%20Cursor%20%7C%20Claude%20%7C%20Windsurf%20%7C%20Copilot-blue)](README.md)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](package.json)

---

## ⚡ Quick Start via NPX

Tinggal jalankan satu baris ini di terminal:

```bash
npx deadliner-skills
```
*(Atau alias singkat: `npx deadliner`)*

An interactive menu will guide you to configure your preferred AI coding assistant:
1. **Google Antigravity** (`~/.gemini/config/skills/` & `GEMINI.md`)
2. **Cursor IDE** (`.cursorrules` & `.cursor/rules/lms-course-extractor.mdc`)
3. **Anthropic Claude Code** (`CLAUDE.md` & `~/.claude/`)
4. **Windsurf / Codeium IDE** (`.windsurfrules`)
5. **GitHub Copilot** (`.github/copilot-instructions.md`)
6. **Roo Code / Cline** (`.clinerules`)
7. **Install to ALL Platforms at once**

Or directly via CLI flag:
```bash
# Setup for all AI agents:
npx lms-course-extractor setup all

# Setup specific editor:
npx lms-course-extractor setup cursor
npx lms-course-extractor setup claude
npx lms-course-extractor setup antigravity
```

---

## 🤖 How It Works with Your AI Assistant

Once installed in your project or global config, you **never need to write long prompts again**. In any supported editor, simply send your agent a minimal prompt:

```text
https://lms.telkomuniversity.ac.id/course/view.php?id=1609
pg6vho8lpbpmbbhski8n8hlmda
minggu 1 sampai 7
```

Your AI Assistant will immediately:
1. **Authenticate & Crawl**: Inject the `MoodleSession` cookie and map out all sections and activities.
2. **Download & Extract**:
   - Slides (`.pptx` / `.pdf`): extract slide text, tables, presenter notes, and architecture diagrams.
   - External links: resolve SharePoint / OneDrive links (`&download=1`) automatically.
   - Quizzes: parse questions, choices, feedback, and official correct answers.
   - Assignments: extract briefs, deadlines, and submission templates.
   - Videos: inspect H5P interactive videos, YouTube chapters, and extract keyframes via ffmpeg.
3. **Synthesize & Q&A**: Generate weekly in-depth summaries and Q&A with mandatory citations (`Sumber di LMS: [Activity], slide X`).
4. **Compile Academic PDF**: Build a publication-ready PDF using ReportLab with dynamic 2-pass Table of Contents, running header/footer with page numbers, and custom styled callouts.

---

## 🖥️ Standalone CLI (Without an AI Editor)

You can also run the extraction engine directly in terminal without any AI coding assistant:

```bash
npx lms-course-extractor run --url "<LMS_COURSE_URL>" --cookie "<MOODLE_SESSION_COOKIE>" --weeks "1-7"
```

---

## 📁 Repository Structure

```text
lms-course-extractor/
├── bin/
│   └── cli.js                     # Zero-dependency interactive NPX runner
├── engine/                        # Python extraction & ReportLab engines
│   ├── moodle_crawler.py          # Authenticated Moodle tree crawler
│   ├── media_inspector.py         # Subtitle & keyframe contact sheet extractor
│   └── academic_pdf_builder.py    # ReportLab 2-pass dynamic TOC academic PDF template
├── templates/
│   ├── rules/
│   │   └── UNIVERSAL_RULE.md      # Rule specification across all AI agents
│   └── skills/
│       └── SKILL.md               # Standard Skill specification
├── package.json
└── README.md
```

---

## 📄 License
MIT License. Built for students, researchers, and developers.
