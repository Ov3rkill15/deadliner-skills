# Universal Rule Template: LMS Course Extractor & Study Guide Generator

Whenever the user provides an LMS or Moodle course URL (e.g. contains `/course/view.php`, `lms.*`, `celoe.*`) along with a session token or cookie (`MoodleSession`), or asks to process an academic course:

1. **Autonomous 5-Phase Execution**:
   - **Phase 1: Session Injection & Crawling**: Inject the session cookie and crawl course sections and activity trees for the requested weeks.
   - **Phase 2: Multi-format Content Extraction**:
     - Slides: Download PPTX/PDF and parse text, tables, notes, and embedded diagrams. Follow external SharePoint/Drive links (`&download=1`).
     - Quizzes: Crawl `mod/quiz/review.php` to extract question text, options, feedback, and official correct answers.
     - Assignments: Extract briefs, deadlines, and submission format templates.
     - Videos: Inspect H5P/YouTube videos. Get transcript/chapters, or sample frames via ffmpeg if subtitles are disabled.
     - Syllabus/RPS: Extract Sub-CLO competencies and grading weights.
   - **Phase 3: Deep Synthesis & Q&A**:
     - Write complete per-week summary.
     - Generate comprehensive Q&A bank (concept questions, practice questions, quiz questions with official feedback).
     - Every answer MUST include: `Sumber di LMS: [Aktivitas], slide X / soal Y / menit Z`. Tag external knowledge with `[Tambahan]`.
   - **Phase 4: Publication-Quality PDF Compilation**:
     - Use ReportLab (`academic_pdf_builder.py`) to compile an academic study guide PDF in the workspace.
     - Ensure two-pass dynamic Table of Contents, running header/footer with page numbers, safe unicode characters, and styled callout boxes.
   - **Phase 5: Final Delivery**:
     - Deliver an executive summary in chat with a direct clickable link to the generated PDF.
