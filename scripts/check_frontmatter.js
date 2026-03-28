#!/usr/bin/env node

/**
 * AIツール調査レポートのフロントマター（YAML）のフォーマットを検証するスクリプト。
 * 
 * 役割:
 * 1. YAML構文の正しさを検証。
 * 2. プロジェクト標準のフォーマット（インデント、引用符、フィールド順）との一致を検証。
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const reportsDir = path.resolve(__dirname, '../_reports');
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.md'));

const isFixMode = process.argv.includes('--fix');

let errorCount = 0;
let filesChecked = 0;
let filesFixed = 0;

function findEndMarker(content, startOffset) {
  const patterns = [
    { pattern: '\n---\n', length: 5 },
    { pattern: '\r\n---\r\n', length: 7 },
    { pattern: '\n---\r\n', length: 6 },
    { pattern: '\r\n---\n', length: 6 }
  ];
  for (const { pattern, length } of patterns) {
    const index = content.indexOf(pattern, startOffset);
    if (index !== -1) {
      return { index, length };
    }
  }
  return { index: -1, length: 0 };
}

files.forEach(file => {
  const filePath = path.join(reportsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // フロントマターの開始マーカーをチェック
  let startMarkerLength = 4;
  if (content.startsWith('---\r\n')) {
    startMarkerLength = 5;
  } else if (!content.startsWith('---\n')) {
    console.error(`[ERROR] ${file}: フロントマターが '---' で始まっていません。`);
    errorCount++;
    return;
  }

  // 終了マーカーを探す
  const { index: endMarkerIndex, length: lineEndingLength } = findEndMarker(content, startMarkerLength);

  if (endMarkerIndex === -1) {
    console.error(`[ERROR] ${file}: フロントマターの終了マーカーが見つかりません。`);
    errorCount++;
    return;
  }

  const rawYaml = content.substring(startMarkerLength, endMarkerIndex + 1);
  filesChecked++;

  try {
    const data = yaml.load(rawYaml);
    if (!data || typeof data !== 'object') {
       console.error(`[ERROR] ${file}: 有効なYAMLコンテンツが含まれていません。`);
       errorCount++;
       return;
    }

    // 標準フォーマットに再出力
    const normalizedYaml = yaml.dump(data, {
      allowUnicode: true,
      sortKeys: false, // フィールド順は維持（手動変更を受け入れる）
      lineWidth: -1    // 行の折り返しを無効化
    });

    if (rawYaml.trim() !== normalizedYaml.trim()) {
      if (isFixMode) {
        const newContent = `---\n${normalizedYaml}---\n${content.substring(endMarkerIndex + lineEndingLength)}`;
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`[FIXED] ${file}: フォーマットを自動修正しました。`);
        filesFixed++;
      } else {
        console.error(`[LINT] ${file}: フォーマットが標準と異なります。修正が必要です。`);
        // console.log("Expected:\n", normalizedYaml);
        errorCount++;
      }
    }
  } catch (e) {
    console.error(`[SYNT] ${file}: YAML構文エラー - ${e.message}`);
    errorCount++;
  }
});

console.log(`\nChecked ${filesChecked} files.`);
if (isFixMode && filesFixed > 0) {
  console.log(`Fixed ${filesFixed} files.`);
}

if (errorCount > 0) {
  console.error(`\n❌ ${errorCount} 件のフォーマットエラーが見つかりました。`);
  process.exit(1);
} else {
  console.log("✅ 全レポートが標準のフォーマットに準拠しています。");
}
