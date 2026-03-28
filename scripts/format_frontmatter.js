#!/usr/bin/env node

/**
 * AIツール調査レポートのフロントマター（YAML）をプロジェクト標準形式に自動整形するスクリプト。
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const reportsDir = path.resolve(__dirname, '../_reports');
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.md'));

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(reportsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.startsWith('---\n')) return;

  const endMarkerIndex = content.indexOf('\n---\n', 4);
  if (endMarkerIndex === -1) return;

  const rawYaml = content.substring(4, endMarkerIndex + 1);
  const body = content.substring(endMarkerIndex + 5);

  try {
    const data = yaml.load(rawYaml);
    if (!data || typeof data !== 'object') return;

    // 標準フォーマットに再出力
    const normalizedYaml = yaml.dump(data, {
      allowUnicode: true,
      sortKeys: false,
      lineWidth: -1
    });

    if (rawYaml.trim() !== normalizedYaml.trim()) {
      const newContent = `---\n${normalizedYaml}---\n${body}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
      updatedCount++;
    }
  } catch (e) {
    console.error(`Error formatting ${file}: ${e.message}`);
  }
});

console.log(`Successfully formatted ${updatedCount} files.`);
