/**
 * @fileoverview GitHub Actions Daily Report Maintenance Script.
 * Refactored to follow Google JavaScript best practices:
 * - Clear modular functions with single responsibility.
 * - Solid error handling.
 * - Strict parameter validation and sanitization.
 * - Robust JSDoc documentation.
 */

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses all report files in the reports directory.
 * @param {string} reportsDir
 * @param {{info: Function}} core
 * @return {Array<Object>}
 */
function getReportsWithDates(reportsDir, core) {
  const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.md'));
  if (files.length === 0) {
    core.info('No report files found in _reports directory');
    return [];
  }

  const reportsWithDates = [];

  for (const file of files) {
    const filePath = path.join(reportsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse YAML front matter
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontMatterMatch) {
      const frontMatter = frontMatterMatch[1];
      const lastUpdatedMatch = frontMatter.match(/last_updated:\s*["']?([^"'\r\n]+)["']?/);

      if (lastUpdatedMatch) {
        const lastUpdated = new Date(lastUpdatedMatch[1]);
        core.info(`${file}: last_updated = ${lastUpdated.toISOString()}`);

        reportsWithDates.push({
          filename: file,
          path: filePath,
          lastUpdated: lastUpdated,
          content: content
        });
      }
    }
  }

  return reportsWithDates;
}

/**
 * Resolves a specific report when TARGET_REPORT is specified.
 * @param {Array<Object>} reports
 * @param {string} targetInput
 * @param {{info: Function, error: Function}} core
 * @return {Array<Object>}
 */
function findSpecificReport(reports, targetInput, core) {
  const sanitizedInput = targetInput.trim();
  const lowerInput = sanitizedInput.toLowerCase();

  // 1. Exact filename match
  let matchedReport = reports.find(r => 
    r.filename === sanitizedInput || r.filename.replace('.md', '') === sanitizedInput
  );

  // 2. Exact tool_name match (case-insensitive)
  if (!matchedReport) {
    matchedReport = reports.find(r => {
      const toolNameMatch = r.content.match(/tool_name:\s*["']?([^"'\r\n]+)["']?/);
      const toolName = toolNameMatch ? toolNameMatch[1] : '';
      return toolName.toLowerCase() === lowerInput;
    });
  }

  if (matchedReport) {
    core.info(`Found exact match: ${matchedReport.filename}`);
    return [matchedReport];
  }

  // 3. Partial match (filename or tool_name)
  const partialMatches = reports.filter(r => {
    const fileNameMatch = r.filename.toLowerCase().includes(lowerInput);
    
    const toolNameMatch = r.content.match(/tool_name:\s*["']?([^"'\r\n]+)["']?/);
    const toolName = toolNameMatch ? toolNameMatch[1] : '';
    const nameMatch = toolName.toLowerCase().includes(lowerInput);

    return fileNameMatch || nameMatch;
  });

  if (partialMatches.length === 1) {
    core.info(`Found single partial match: ${partialMatches[0].filename}`);
    return [partialMatches[0]];
  } else if (partialMatches.length > 1) {
    core.error(`Multiple reports matched "${sanitizedInput}": ${partialMatches.map(r => r.filename).join(', ')}. Please specify a more precise name.`);
    process.exit(1);
  } else {
    core.error(`No report found matching "${sanitizedInput}"`);
    process.exit(1);
  }
}

/**
 * Retrieves the oldest reports based on the specified count limit.
 * @param {Array<Object>} reports
 * @param {string} reportCountEnv
 * @param {{warning: Function}} core
 * @return {Array<Object>}
 */
function getOldestReports(reports, reportCountEnv, core) {
  let reportCount = parseInt(reportCountEnv, 10);
  if (isNaN(reportCount) || reportCount < 1) {
    const safeReportCount = (reportCountEnv || '').replace(/[\r\n]+/g, ' ');
    core.warning(`Invalid report_count "${safeReportCount}", defaulting to 1`);
    reportCount = 1;
  }

  return reports
    .sort((a, b) => a.lastUpdated - b.lastUpdated)
    .slice(0, reportCount);
}

function buildJulesPrompt(toolName, reportPath, todayJST) {
  const promptLines = [
    `AGENTS.mdの「レポート作成・更新の手順」に従い、${toolName}(${reportPath})の調査レポートを更新せよ。`,
    '',
    '## 自律性に関する基本原則（重要：自律確定と質問・確認の完全禁止 / MANDATORY AUTONOMOUS FINALIZATION）',
    '- **完全自律完結と確定（Finalize）の義務（最重要）**: 本タスクはGitHub Actions上で実行される完全自動バッチ処理であり、対話相手となるユーザー（人間）は存在しない。すべての更新と検証（コードレビューで `#Correct#` を得た後を含む）が完了した後は、「確定してよいか？」「他に見直したい点はあるか？」（例: "Should I proceed with final submission?", "Is there anything else to check?", "確認してください" 等）といった確認・質問・提案を**絶対に**出力してはならない。検証が完了した時点で、自律的にすべての変更を確定（Finalize）し、完了サマリーを報告してタスクを終了（Complete/Terminate）せよ。',
    '- **CRITICAL: NEVER ASK ANY QUESTIONS OR CONFIRMATIONS**: You are running in a non-interactive, automated headless workflow. There is NO human user to answer questions. Do NOT end your response with a question (e.g., do NOT ask "Should I proceed...", "Is there anything else...", "Would you like me to..."). Any question will cause the automated batch to freeze and fail. Output declarative completion statements only and immediately proceed to final submission / PR creation.',
    '- **ユーザーへの質問・確認・アドバイス要求の完全禁止**: どのような状況（調査中・エラー発生時・作業完了時すべて）であっても、ユーザーに質問を投げかけたり、確認を求めたりして処理を中断・停止させてはならない。ユーザーからの返答は一切得られない。曖昧な仕様やツールのエラーに直面した場合は、手元のデータや文脈から自律的かつ合理的に判断し、あなたの判断だけで処理を完遂すること。',
    '',
    '## 自立判断・解決のガイドライン（迷いやすい点の明確な方針）',
    '- **新テンプレートへの移行（全18セクション構成）**: `templates/template.md` を読み込んで参照せよ。旧形式で「4. 動作原理・システム構成」が欠落しているレポートの場合は、躊躇なくSection 4（Mermaid図付き）を追加し、後続セクション番号を5〜18へ正しく振り直して更新せよ。',
    '- **類似ツール比較（Section 17）のツール選定**: 比較表や詳細比較に記載する競合ツールは、原則として `_reports/` ディレクトリ内にレポートが存在するツールを優先して選定・差し替えよ。これはサイト全体の双方向整合性を保つための正規の手順であり、人間の承認を求めずに確定してよい。',
    '- **多角的な調査**: ツールの最新情報調査にあたっては、公式サイト、公式ブログ、GitHubリポジトリ（`CHANGELOG.md` / `Releases`）、プラグイン公式ページ（更新履歴）、プレスリリースなどを自律的に検索・探索せよ。',
    '- **コードレビュー後の即時確定**: 内部コードレビューで `#Correct#` を得た時点で、あなたの修正内容は完全に正当化されている。人間に確認せず直ちにPR作成（Final submission）に進め。',
    '',
    '## 作業内容',
    '',
    '### ステップ1: レポートの作成・更新',
    `- 対象: ${reportPath}`,
    `- 本日の日付: ${todayJST}`,
    '- `templates/template.md` および `task-report-create-or-update.md` の指示に従い、レポート情報を最新化する',
    '- **【最優先】直近のアップデート情報（最新の変更内容）の徹底調査と反映**: 公式ブログ、GitHub（Releases/CHANGELOG）、プラグインストア等の変更履歴から直近のアップデートをくまなく調査し、最新情報を起点として主要機能、動作原理・システム構成、料金プラン、競合比較、フロントマターなどの関係箇所を連動して更新せよ',
    '- **重要**: 競合ツールのバージョンアップについても調査し、必要に応じて `_reports/` ディレクトリ内の該当ツールのレポートも参照して、星取表（機能比較表）の競合ツール情報を確実に最新化せよ',
    '- **重要**: `templates/template.md` のセクション構成（全18セクション）・順序・形式に厳密に準拠せよ',
    '',
    '### ステップ2: 関連レポートの整理',
    '- `task-organizing-category-tags.md` に従い、カテゴリ・タグ・関連付けを整理する',
    `- ${toolName}と同カテゴリまたはrelated_toolsに含まれるレポートとの双方向整合性を確保せよ`,
    '',
    '### ステップ3: リンク・構文チェック',
    `- 作業完了後、\`PYTHONPATH=. uv run scripts/check_links.py ${reportPath}\` または \`pnpm run verify-report ${reportPath}\` を実行してリンク切れおよびMermaid構文エラーがないことを確認せよ`,
    '- 404エラー（リンク切れ）が検出された場合は、正しいURLに修正するか、リンクを削除する',
    '- 403エラー（アクセス拒否）の場合はGoogle検索で追加検証を行え',
    '',
    '### ステップ4: 自律確定と終了（Finalize & Complete）',
    '- 検証およびコードレビュー（#Correct#）が完了した時点で、ユーザーへの確認を一切求めずに変更を直ちに確定（Finalize）する',
    '- 完了した変更内容の概要を簡潔な宣言文（Declarative statements）として出力し、セッションを正常終了せよ',
    '',
    '---',
    '',
    '## 【最重要】最終出力と自動完了に関する厳格な指示（FINAL MANDATE）',
    '1. レポートの更新、検証、コードレビュー（#Correct#）が完了したら、**一切の質問を行わずに直ちに最終提出（PR作成/Final submission）を実行せよ**。',
    '2. **DO NOT ASK FOR PERMISSION OR CONFIRMATION**: Do NOT output sentences like "Should I proceed with final submission?", "Is there anything else I need to double-check?", "Would you like me to finalize?", etc.',
    '3. 最後の出力は「更新を完了し、検証およびレビューをパスしたため、すべての変更を確定して終了します」という旨の簡潔な完了報告（宣言文）のみとし、疑問符（?）で終わる文章を出力してはならない。'
  ];

  return promptLines.join('\n');
}

/**
 * Sends a request to Jules API with simple exponential retry mechanism.
 * @param {string} julesApiUrl
 * @param {Object} requestBody
 * @param {string} apiKey
 * @param {string} toolName
 * @param {{info: Function, error: Function, warning: Function}} core
 * @return {Promise<Object|null>}
 */
async function callJulesApiWithRetry(julesApiUrl, requestBody, apiKey, toolName, core) {
  const maxRetries = 3;
  const retryDelay = 30000; // 30 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    core.info(`Jules API call attempt ${attempt}/${maxRetries} for ${toolName}...`);

    if (attempt > 1) {
      core.info(`Waiting ${retryDelay / 1000} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    try {
      const response = await fetch(julesApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = `Jules API call failed: ${response.status} ${response.statusText}`;
        core.error(errorMessage);
        core.error(`Error response: ${errorText}`);

        if (response.status >= 400 && response.status < 500) {
          core.error('Client error (4xx) detected. Not retrying.');
          break;
        }

        if (attempt < maxRetries) {
          core.warning(`Server error (5xx) detected. Will retry (${attempt}/${maxRetries})`);
        }
        continue;
      }

      const result = await response.json();
      core.info(`Jules API call successful for ${toolName}!`);
      return result;

    } catch (error) {
      core.error(`Error calling Jules API (attempt ${attempt}): ${error.message}`);
      if (attempt === maxRetries) {
        core.error(`All ${maxRetries} attempts failed for ${toolName}.`);
      } else {
        core.warning(`Will retry (${attempt}/${maxRetries})`);
      }
    }
  }

  return null;
}

/**
 * Main orchestrator function to run report maintenance.
 * @param {Object} context Object containing github, context, core from actions/github-script
 */
module.exports = async function({ github, context, core }) {
  // Validate API Key
  const apiKey = process.env.JULES_API_KEY;
  if (!apiKey) {
    core.error('JULES_API_KEY secret is not set');
    process.exit(1);
  }

  // Retrieve and parse all available reports
  const reportsDir = '_reports';
  const reportsWithDates = getReportsWithDates(reportsDir, core);
  if (reportsWithDates.length === 0) {
    core.error('No report with valid last_updated date found');
    process.exit(1);
  }

  // Determine target reports to process (Specific one vs Oldest ones)
  const targetReportInput = process.env.TARGET_REPORT;
  let targetReports = [];

  if (targetReportInput && targetReportInput.trim() !== '') {
    // Sanitize input for logging to prevent log injection
    const safeTargetReportInput = targetReportInput.replace(/[\r\n]+/g, ' ');
    core.info(`Target report specified: "${safeTargetReportInput}"`);
    targetReports = findSpecificReport(reportsWithDates, targetReportInput, core);
  } else {
    targetReports = getOldestReports(reportsWithDates, process.env.REPORT_COUNT, core);
  }

  core.info(`Found ${targetReports.length} reports to process:`);
  for (const report of targetReports) {
    core.info(`  - ${report.filename} (last updated: ${report.lastUpdated.toISOString()})`);
  }

  const julesApiUrl = 'https://jules.googleapis.com/v1alpha/sessions';
  const todayJST = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
  const updatedReports = [];
  const failedReports = [];

  // Process each selected report
  for (const currentReport of targetReports) {
    const toolNameMatch = currentReport.content.match(/tool_name:\s*["']?([^"'\r\n]+)["']?/);
    const toolName = toolNameMatch ? toolNameMatch[1] : currentReport.filename.replace('.md', '');

    core.info(`\n--- Processing: ${toolName} (${currentReport.filename}) ---`);

    const prompt = buildJulesPrompt(toolName, currentReport.path, todayJST);

    const requestBody = {
      prompt: prompt,
      sourceContext: {
        source: `sources/github/${context.repo.owner}/${context.repo.repo}`,
        githubRepoContext: {
          startingBranch: "main"
        }
      },
      requirePlanApproval: false,
      automationMode: `AUTO_CREATE_PR`,
      title: `Update ${toolName} Report and Organize - ${new Date().toISOString().split('T')[0]}`
    };

    const result = await callJulesApiWithRetry(julesApiUrl, requestBody, apiKey, toolName, core);

    if (result) {
      updatedReports.push({
        filename: currentReport.filename,
        toolName: toolName,
        sessionId: result.sessionId || 'unknown'
      });
    } else {
      failedReports.push({
        filename: currentReport.filename,
        toolName: toolName,
        error: 'All retry attempts to Jules API failed'
      });
    }

    // Rate limit safeguard: wait 10s between processing different reports
    if (targetReports.indexOf(currentReport) < targetReports.length - 1) {
      core.info('Waiting 10 seconds before processing next report...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // Generate and output execution summary
  core.info('\n=== Update Summary ===');
  core.info(`Successfully updated: ${updatedReports.length}/${targetReports.length} reports`);
  
  if (updatedReports.length > 0) {
    core.info('Updated reports:');
    for (const report of updatedReports) {
      core.info(`  - ${report.toolName} (${report.filename}): session ${report.sessionId}`);
    }
  }

  if (failedReports.length > 0) {
    core.warning('Failed reports:');
    for (const report of failedReports) {
      core.warning(`  - ${report.toolName} (${report.filename}): ${report.error}`);
    }
  }

  // Set GitHub Actions outputs
  core.setOutput('updated_reports', updatedReports.map(r => r.filename).join(','));
  core.setOutput('updated_count', updatedReports.length);
  core.setOutput('failed_count', failedReports.length);

  // Terminate with error code if all updates failed
  if (updatedReports.length === 0 && targetReports.length > 0) {
    core.error('All report updates failed. Failing the workflow.');
    process.exit(1);
  }
};
