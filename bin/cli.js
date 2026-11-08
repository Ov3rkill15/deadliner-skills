#!/usr/bin/env node

/**
 * LMS Course Extractor & Study Guide Generator
 * Universal Multi-Agent Skill Installer & Standalone CLI
 * 
 * Supported AI Environments:
 * - Google Antigravity (~/.gemini/config/skills/ & GEMINI.md)
 * - Anthropic Claude Code (CLAUDE.md & ~/.claude/)
 * - Cursor IDE (.cursorrules & .cursor/rules/)
 * - Windsurf IDE (.windsurfrules)
 * - GitHub Copilot (.github/copilot-instructions.md)
 * - Roo Code / Cline (.clinerules)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const readline = require('readline');

const PKG_ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(PKG_ROOT, 'templates');
const ENGINE_DIR = path.join(PKG_ROOT, 'engine');
const HOME_DIR = os.homedir();
const CWD = process.cwd();

// --- Colors ---
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m"
};

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function appendOrWrite(filePath, content, headerComment) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf8');
    if (!existing.includes('lms-course-extractor') && !existing.includes('LMS Course Extractor')) {
      fs.appendFileSync(filePath, `\n\n${headerComment}\n${content}`);
      console.log(`${C.green}✔ Updated:${C.reset} ${filePath}`);
    } else {
      console.log(`${C.gray}ℹ Already configured:${C.reset} ${filePath}`);
    }
  } else {
    fs.writeFileSync(filePath, `${headerComment}\n${content}`, 'utf8');
    console.log(`${C.green}✔ Created:${C.reset} ${filePath}`);
  }
}

// --- Target Integrations ---
const TARGETS = {
  antigravity: () => {
    console.log(`\n${C.cyan}Installing for Google Antigravity...${C.reset}`);
    const globalSkillDir = path.join(HOME_DIR, '.gemini', 'config', 'skills', 'lms-course-extractor');
    copyRecursiveSync(path.join(TEMPLATES_DIR, 'skills'), globalSkillDir);
    copyRecursiveSync(ENGINE_DIR, path.join(globalSkillDir, 'scripts'));
    console.log(`${C.green}✔ Skill deployed to:${C.reset} ${globalSkillDir}`);

    const globalRule = path.join(HOME_DIR, '.gemini', 'config', 'GEMINI.md');
    const localRule = path.join(CWD, 'GEMINI.md');
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    appendOrWrite(globalRule, ruleContent, "# Global Antigravity Rule: LMS Extractor");
    appendOrWrite(localRule, ruleContent, "# Workspace Antigravity Rule: LMS Extractor");
  },

  claude: () => {
    console.log(`\n${C.cyan}Installing for Anthropic Claude Code...${C.reset}`);
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    const localClaude = path.join(CWD, 'CLAUDE.md');
    const globalClaude = path.join(HOME_DIR, '.claude', 'CLAUDE.md');
    appendOrWrite(localClaude, ruleContent, "# Claude Code Workspace Guidelines: LMS Extractor");
    appendOrWrite(globalClaude, ruleContent, "# Claude Code Global Guidelines: LMS Extractor");

    // Copy engine to local .claude/tools if in project
    const localTools = path.join(CWD, '.claude', 'skills', 'lms-extractor');
    copyRecursiveSync(ENGINE_DIR, localTools);
    console.log(`${C.green}✔ Engine scripts deployed to:${C.reset} ${localTools}`);
  },

  cursor: () => {
    console.log(`\n${C.cyan}Installing for Cursor IDE...${C.reset}`);
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    const cursorRules = path.join(CWD, '.cursorrules');
    appendOrWrite(cursorRules, ruleContent, "# Cursor Rules: LMS Extractor");

    const mdcFile = path.join(CWD, '.cursor', 'rules', 'lms-course-extractor.mdc');
    const mdcContent = `---\ndescription: Extract, synthesize and compile LMS courses to PDF\nglobs: *\n---\n\n${ruleContent}`;
    const mdcDir = path.dirname(mdcFile);
    if (!fs.existsSync(mdcDir)) fs.mkdirSync(mdcDir, { recursive: true });
    fs.writeFileSync(mdcFile, mdcContent, 'utf8');
    console.log(`${C.green}✔ Modern Cursor Rule (.mdc) created:${C.reset} ${mdcFile}`);
  },

  windsurf: () => {
    console.log(`\n${C.cyan}Installing for Windsurf / Codeium IDE...${C.reset}`);
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    const windsurfRules = path.join(CWD, '.windsurfrules');
    appendOrWrite(windsurfRules, ruleContent, "# Windsurf Memories: LMS Extractor");
  },

  copilot: () => {
    console.log(`\n${C.cyan}Installing for GitHub Copilot...${C.reset}`);
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    const copilotFile = path.join(CWD, '.github', 'copilot-instructions.md');
    appendOrWrite(copilotFile, ruleContent, "# GitHub Copilot Custom Instructions: LMS Extractor");
  },

  cline: () => {
    console.log(`\n${C.cyan}Installing for Roo Code / Cline...${C.reset}`);
    const ruleContent = fs.readFileSync(path.join(TEMPLATES_DIR, 'rules', 'UNIVERSAL_RULE.md'), 'utf8');
    const clineFile = path.join(CWD, '.clinerules');
    appendOrWrite(clineFile, ruleContent, "# Cline / Roo Code System Prompt: LMS Extractor");
  }
};

function installAll() {
  Object.keys(TARGETS).forEach(key => TARGETS[key]());
  console.log(`\n${C.green}${C.bold}🎉 Sukses mengkonfigurasi semua platform AI Coding Assistant!${C.reset}\n`);
}

// --- Standalone CLI Runner ---
function runStandalone(url, cookie, weeks, outDir) {
  console.log(`\n${C.cyan}${C.bold}🚀 Menjalankan LMS Course Extractor Standalone Engine...${C.reset}`);
  console.log(`URL:    ${url}`);
  console.log(`Weeks:  ${weeks}`);
  console.log(`Output: ${outDir}\n`);

  const crawler = path.join(ENGINE_DIR, 'moodle_crawler.py');
  const pyProcess = spawn('python', [
    crawler,
    '--url', url,
    '--cookie', cookie,
    '--out', outDir
  ], { stdio: 'inherit' });

  pyProcess.on('close', code => {
    if (code === 0) {
      console.log(`\n${C.green}✔ Crawling selesai! Berkas tersimpan di: ${outDir}${C.reset}`);
      console.log(`${C.yellow}Gunakan editor/agent Anda atau template reportlab untuk meng-compile PDF.${C.reset}`);
    } else {
      console.error(`\n${C.red}Proses Python selesai dengan exit code: ${code}${C.reset}`);
    }
  });
}

// --- CLI Argument Parsing ---
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${C.bold}${C.yellow}⚡ DEADLINER-SKILLS ⚡${C.reset}
Penyelamat Mahasiswa H-1 Ujian & Tugas Kuliah
Universal Multi-Agent Skill Installer & Standalone CLI

${C.bold}PENGGUNAAN:${C.reset}
  ${C.cyan}npx deadliner-skills setup [agent]${C.reset}   Pasang skill ke AI agent pilihan
  ${C.cyan}npx deadliner-skills setup all${C.reset}       Pasang ke SEMUA agent (Antigravity, Cursor, Claude, dll)
  ${C.cyan}npx deadliner run [opsi]${C.reset}             Jalankan extractor mandiri tanpa agent

${C.bold}PILIHAN AGENT:${C.reset}
  antigravity  Google Antigravity (~/.gemini/config/skills/ & GEMINI.md)
  claude       Anthropic Claude Code (CLAUDE.md & ~/.claude/)
  cursor       Cursor IDE (.cursorrules & .cursor/rules/)
  windsurf     Windsurf IDE (.windsurfrules)
  copilot      GitHub Copilot (.github/copilot-instructions.md)
  cline        Roo Code / Cline (.clinerules)
  all          Pasang ke semua platform di atas

${C.bold}CONTOH COMMAND:${C.reset}
  npx deadliner-skills setup all
  npx deadliner-skills setup cursor
  npx deadliner run --url "https://lms.telkomuniversity.ac.id/course/view.php?id=1609" --cookie "pg6v..."
`);
  process.exit(0);
}

if (args[0] === 'setup') {
  const target = (args[1] || 'all').toLowerCase();
  if (target === 'all') {
    installAll();
  } else if (TARGETS[target]) {
    TARGETS[target]();
    console.log(`\n${C.green}✔ Selesai memasang untuk ${target}!${C.reset}\n`);
  } else {
    console.error(`${C.red}Target '${target}' tidak dikenali. Pilih: ${Object.keys(TARGETS).join(', ')}, all${C.reset}`);
  }
  process.exit(0);
}

if (args[0] === 'run') {
  let url = '', cookie = '', weeks = '1-7', out = path.join(CWD, 'lms_extracted');
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) url = args[++i];
    if (args[i] === '--cookie' && args[i + 1]) cookie = args[++i];
    if (args[i] === '--weeks' && args[i + 1]) weeks = args[++i];
    if (args[i] === '--out' && args[i + 1]) out = args[++i];
  }
  if (!url || !cookie) {
    console.error(`${C.red}Error: Argumen --url dan --cookie wajib diisi!${C.reset}`);
    process.exit(1);
  }
  runStandalone(url, cookie, weeks, out);
} else {
  // Interactive Menu when run simply as `npx lms-course-extractor`
  console.log(`
${C.bold}${C.yellow}╔════════════════════════════════════════════════════════════╗
║                 ⚡ DEADLINER-SKILLS ⚡                      ║
║       Penyelamat Mahasiswa H-1 Ujian & Tugas Kuliah        ║
║       Universal Multi-Agent Skills & Standalone CLI        ║
╚════════════════════════════════════════════════════════════╝${C.reset}

${C.cyan}Pilih target pemasangan AI Assistant:${C.reset}
  ${C.bold}1)${C.reset} Pasang ke SEMUA Platform (Antigravity, Cursor, Claude Code, Windsurf, Copilot, Cline)
  ${C.bold}2)${C.reset} Google Antigravity
  ${C.bold}3)${C.reset} Cursor IDE
  ${C.bold}4)${C.reset} Anthropic Claude Code
  ${C.bold}5)${C.reset} Windsurf / Codeium IDE
  ${C.bold}6)${C.reset} GitHub Copilot
  ${C.bold}7)${C.reset} Roo Code / Cline
  ${C.bold}8)${C.reset} Keluar
`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Masukkan pilihan [1-8]: ', ans => {
    rl.close();
    const map = {
      '1': 'all',
      '2': 'antigravity',
      '3': 'cursor',
      '4': 'claude',
      '5': 'windsurf',
      '6': 'copilot',
      '7': 'cline'
    };
    const choice = map[ans.trim()];
    if (choice === 'all') {
      installAll();
    } else if (choice) {
      TARGETS[choice]();
      console.log(`\n${C.green}✔ Berhasil dikonfigurasi untuk ${choice}!${C.reset}\n`);
    } else {
      console.log("Dibatalkan.");
    }
  });
}
