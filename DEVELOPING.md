# ⚡ DEADLINER-SKILLS — Development Roadmap & Next Steps
> **Penyelamat Mahasiswa H-1 Ujian & Tugas Kuliah**  
> Progres saat ini, ide-ide upgrade fitur, dan langkah kerja berikutnya.

---

## 📌 Status Saat Ini (Versi 1.0 — Selesai & Terverifikasi)

- [x] **Pipeline Ekstraksi LMS Telkom University (Moodle/Celoe)**:
  - Otomatisasi crawling halaman course, resource PDF, PPTX (SharePoint `&download=1`), dan review kuis.
- [x] **Multi-format Content Parser**:
  - Ekstraksi slide PowerPoint (`python-pptx`) beserta tabel, catatan presenter, dan diagram.
  - Ekstraksi PDF materi (`PyMuPDF`).
  - Parsing soal kuis resmi LMS (pertanyaan, opsi, umpan balik dosen, dan kunci jawaban).
  - Inspeksi video tutorial (pengambilan babak YouTube, deteksi takarir, dan ekstraksi sampel frame via `ffmpeg`).
- [x] **ReportLab Academic PDF Generator**:
  - Kompilasi dokumen 48 halaman `Simulasi_Jaringan_Minggu1-7_Materi_dan_QnA.pdf`.
  - Dilengkapi Daftar Isi dinamis 2-pass, running header/footer, kartu Q&A, dan sitasi hijau wajib `Sumber di LMS: ...`.
- [x] **Universal Multi-Agent Ecosystem**:
  - Repositori NPX siap publish di folder `lms-course-extractor-repo/`.
  - Mendukung Google Antigravity, Cursor IDE, Claude Code, Windsurf, GitHub Copilot, dan Roo Code/Cline.
  - Memiliki `LICENSE` (MIT), `README.md`, `CONTRIBUTING.md`, dan template issue GitHub.

---

## 🎯 Target Upgrade Berikutnya (Prioritas Utama)

### 1. 🎮 Interactive Mock Exam di Terminal (`quiz` Mode)
- **Tujuan**: Mengubah belajar pasif (hanya membaca PDF) menjadi belajar aktif (*active recall*).
- **Mekanisme**:
  - Perintah: `npx lms-course-extractor quiz` (atau via agent chat).
  - Terminal menampilkan 10–15 soal acak dari bank soal kuis LMS yang telah diekstrak.
  - Pengguna memilih jawaban `[A / B / C / D]`.
  - Langsung menampilkan hasil skor (misal: `Skor: 93.33/100`) dan pembahasan detail resmi dari dosen.
- **File target**: `engine/mock_exam.py` & integrasi ke `bin/cli.js`.

### 2. 📇 Generator Kartu Hafalan Anki (`.tsv` / `.apkg`)
- **Tujuan**: Mahasiswa bisa menghafal materi dan konsep di HP sambil santai atau di jalan menggunakan aplikasi Anki / AnkiDroid.
- **Mekanisme**:
  - Mengonversi bank tanya jawab konsep dan kuis ke format *Tab-Separated Values* (TSV) atau langsung berkas `.apkg`.
  - Menyertakan tag per minggu (`#minggu1`, `#minggu2`, dll).
- **File target**: `engine/anki_exporter.py`.

---

## 🔮 Roadmap Pengembangan Jangka Menengah & Lanjutan

### 3. 🔑 Zero-Friction SSO Login (Tanpa Copy Cookie Manual)
- Menambahkan modul Playwright/Puppeteer headless login.
- Mahasiswa cukup input NIM & Password sekali, sistem otomatis login SSO kampus dan mengambil `MoodleSession`.

### 4. 📊 UTS / UAS Hotspot & Exam Predictor
- Menganalisis korelasi antara:
  - Bobot penilaian di RPS/Syllabus (Sub-CLO).
  - Frekuensi kata kunci penting pada slide dosen.
  - Pola soal kuis mingguan.
- Menghasilkan daftar prediksi: *"Topik dengan probabilitas 85%+ keluar di UTS"*.

### 5. 🎙️ Transkrip Rekaman Kuliah (Whisper AI) & Diagram OCR
- Integrasi `faster-whisper` untuk mentranskripsi video rekaman Zoom/Google Drive dosen yang tidak memiliki takarir.
- OCR visual untuk mengubah gambar skema arsitektur/topologi menjadi diagram teks Mermaid.js.

### 6. 🔌 LMS Model Context Protocol (MCP) Server
- Membungkus kemampuan ini menjadi MCP Server resmi agar AI Agent (Cursor, Claude Desktop, Antigravity) bisa interaksi live dengan LMS secara real-time.

---

## 📝 Catatan untuk Melanjutkan Besok
Jika ingin melanjutkan fitur **Simulasi Ujian Terminal** atau **Export Kartu Anki**, cukup buka sesi baru dan katakan:
> *"Lanjutkan pengerjaan fitur kuis interaktif dan export Anki sesuai catatan di DEVELOPING.md"*
