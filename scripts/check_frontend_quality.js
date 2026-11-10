const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * _sass/*.scss の更新日時が assets/css/main.scss より新しい場合、
 * Jekyll --incremental ビルドで main.css の再生成がスキップされるのを防ぐため
 * assets/css/main.scss のタイムスタンプを更新し .sass-cache をクリアする。
 */
function syncSassTimestamp() {
  const sassDir = path.join(ROOT_DIR, '_sass');
  const mainScss = path.join(ROOT_DIR, 'assets', 'css', 'main.scss');
  if (!fs.existsSync(sassDir) || !fs.existsSync(mainScss)) return;

  const mainMtime = fs.statSync(mainScss).mtimeMs;
  const partials = fs.readdirSync(sassDir).filter((f) => f.endsWith('.scss'));
  const newestPartialMtime = partials.reduce((max, file) => {
    const mtime = fs.statSync(path.join(sassDir, file)).mtimeMs;
    return Math.max(max, mtime);
  }, 0);

  if (newestPartialMtime > mainMtime) {
    const now = new Date();
    fs.utimesSync(mainScss, now, now);
    const sassCacheDir = path.join(ROOT_DIR, '.sass-cache');
    if (fs.existsSync(sassCacheDir)) {
      fs.rmSync(sassCacheDir, { recursive: true, force: true });
    }
  }
}

/**
 * HTML/Liquid テンプレートのアクセシビリティ・SonarLint 規約チェック
 */
function checkHtmlQuality(relPath, errors) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (/<(?:span|div)\b[^>]*\brole=["']button["']/i.test(line)) {
      errors.push(
        `${relPath}:${lineNum} [Web:S6819/S6848] <span>や<div>に role="button" を付与せず、ネイティブの <button type="button"> を使用してください。`,
      );
    }
    if (
      /<(?:span|div)\b[^>]*\btabindex=/i.test(line) &&
      !/\brole=["'](?:button|link|checkbox|radio|switch|tab|menuitem|option|slider|spinbutton|textbox)["']/i.test(line)
    ) {
      errors.push(
        `${relPath}:${lineNum} [Web:S6845] 非インタラクティブ要素(<div>/<span>)に tabindex を付与しないでください。`,
      );
    }
    if (/<(?:img|div|span)\b[^>]*\bon(?:error|click|load|mouseover|focus)=/i.test(line)) {
      errors.push(
        `${relPath}:${lineNum} [Web:S6847] 非インタラクティブ要素へのインラインイベント属性(onerror/onclick等)の付与は避け、JS側で処理してください。`,
      );
    }
  });
}

/**
 * SCSS の SonarLint 規約チェック (!important / transition: all / prefers-reduced-motion)
 */
function checkScssLines(relPath, lines, errors) {
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const stripped = line.replace(/\/\/.*$/, '');
    if (stripped.includes('!important')) {
      errors.push(
        `${relPath}:${lineNum} [css:S4656] !important の使用は禁止されています。詳細度(Specificity)で解決してください。`,
      );
    }
    if (/\btransition\s*:\s*all\b/i.test(stripped)) {
      errors.push(
        `${relPath}:${lineNum} [css:S7924] transition: all は避け、アニメーション対象のプロパティを明示してください。`,
      );
    }
  });
}

/**
 * SCSS 内で transform をアニメーションしている箇所の近傍に prefers-reduced-motion があるか検証
 */
function checkScssReducedMotion(relPath, lines, errors) {
  for (let i = 0; i < lines.length; i++) {
    const stripped = lines[i].replace(/\/\/.*$/, '');
    if (!/\btransition\s*:/i.test(stripped)) continue;

    const windowLines = lines.slice(i, Math.min(lines.length, i + 25)).join('\n');
    const hasTransformInTransition = /\btransition\s*:[^;]*\btransform\b/i.test(windowLines);
    if (!hasTransformInTransition) continue;

    const blockWindow = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 30)).join('\n');
    if (!blockWindow.includes('prefers-reduced-motion')) {
      errors.push(
        `${relPath}:${i + 1} [css:S7924] transform を含む transition には @media (prefers-reduced-motion: reduce) を併記してください。`,
      );
    }
  }
}

function checkScssQuality(relPath, errors) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);
  checkScssLines(relPath, lines, errors);
  checkScssReducedMotion(relPath, lines, errors);
}

/**
 * JavaScript の SonarLint イディオムチェック (.dataset / codePointAt / filter(Boolean) / sort compare)
 */
const JS_RULES = [
  {
    regex: /\.(?:get|set)Attribute\(\s*["']data-[a-zA-Z0-9-]+["']/,
    code: 'javascript:S6653',
    msg: 'data-* 属性の読み書きには getAttribute/setAttribute ではなく element.dataset を使用してください。',
  },
  {
    regex: /\.charCodeAt\(|String\.fromCharCode\(/,
    code: 'javascript:S6643',
    msg: 'charCodeAt / fromCharCode ではなく codePointAt / fromCodePoint を使用してください。',
  },
  {
    regex: /\.filter\(\s*\(?([a-zA-Z0-9_$]+)\)?\s*=>\s*(?:Boolean\(\1\)|\1)\s*\)/,
    code: 'javascript:S6645',
    msg: '.filter(x => x) ではなく .filter(Boolean) を使用してください。',
  },
  {
    regex: /\.sort\(\s*\)/,
    code: 'javascript:S2871',
    msg: '引数なしの .sort() は避け、比較関数 .sort((a, b) => ...) を指定してください。',
  },
];

function checkJsQuality(relPath, errors) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const stripped = line.replace(/\/\/.*$/, '');
    for (const rule of JS_RULES) {
      if (rule.regex.test(stripped)) {
        errors.push(`${relPath}:${idx + 1} [${rule.code}] ${rule.msg}`);
      }
    }
  });
}

function main() {
  syncSassTimestamp();

  const errors = [];
  checkHtmlQuality('_layouts/home.html', errors);
  checkScssQuality('_sass/_home.scss', errors);

  const jsDir = path.join(ROOT_DIR, 'assets', 'js');
  if (fs.existsSync(jsDir)) {
    for (const file of fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'))) {
      checkJsQuality(path.posix.join('assets/js', file), errors);
    }
  }

  if (errors.length > 0) {
    console.error('Frontend Quality Check Failed:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('Frontend Quality Check Passed! (HTML/SCSS/JS SonarLint rules verified)');
}

main();
