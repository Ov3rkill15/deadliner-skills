# Contributing to lms-course-extractor

Thank you for your interest in contributing to **lms-course-extractor**! Whether you want to add support for a new university's LMS, add a new AI coding assistant template, or improve the PDF generation engine, your contributions are very welcome.

---

## 🎯 High-Impact Ideas You Can Help Build

We especially welcome contributions in these areas:

1. **New LMS Platform Adapters**:
   - Currently optimized for **Moodle** (used by Telkom University Celoe/LMS, and hundreds of universities worldwide).
   - Wanted: **Canvas LMS API**, **Blackboard Learn**, **Brightspace (D2L)**, **Google Classroom**.

2. **Campus-Specific Presets**:
   - Automated authentication helpers or SSO scrapers for various campuses.

3. **New Output Formats**:
   - Export Q&A directly to **Anki Flashcards** (`.apkg` or tab-separated TSV).
   - Export weekly summaries to **Obsidian Markdown** (with internal `[[wikilinks]]`).
   - Export to **Notion Pages**.

4. **New AI Assistant Formats**:
   - Keep templates updated for new AI assistants (Cursor `.mdc`, Antigravity skills, Claude Code, Windsurf, Continue.dev).

5. **Local LLM Synthesis Engine**:
   - Offline summarization and question answering using **Ollama** (e.g. `llama3`, `deepseek-r1`, `qwen2.5-coder`).

---

## 🛠️ Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/lms-course-extractor.git
   cd lms-course-extractor
   ```

2. Link package locally for testing:
   ```bash
   npm link
   # Now you can run `lms-course-extractor` or `lms-extractor` directly in terminal!
   ```

3. Ensure Python 3.9+ is installed with required packages:
   ```bash
   pip install requests beautifulsoup4 reportlab python-pptx pymupdf yt-dlp youtube-transcript-api
   ```

---

## 📝 Pull Request Guidelines

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/add-anki-export
   ```
2. **Follow Code Conventions**:
   - Node CLI scripts in `bin/` should stay zero-dependency if possible (using native Node.js APIs) so `npx` remains instantaneous.
   - Python engine scripts in `engine/` should be well-commented and handle encoding errors gracefully.
3. **Commit Messages**: Use conventional commits (`feat: ...`, `fix: ...`, `docs: ...`).
4. **Submit PR**: Open a Pull Request on GitHub describing your changes and testing steps.

---

## 📜 Code of Conduct
Be respectful, constructive, and supportive of fellow students and open-source contributors.
