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
 * Loads the report template content.
 * @param {string} templatePath
 * @param {{warning: Function, info: Function}} core
 * @return {string}
 */
function loadTemplate(templatePath, core) {
  try {
    const content = fs.readFileSync(templatePath, 'utf8');
    core.info(`Template loaded: ${templatePath} (${content.length} bytes)`);
    return content;
  } catch (error) {
    core.warning(`Failed to load template: ${error.message}`);
    return '';
  }
}

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

/**
 * Constructs the prompt for the Jules API.
 * @param {string} toolName
 * @param {string} reportPath
 * @param {string} todayJST
 * @param {string} templateContent
 * @return {string}
 */
function buildJulesPrompt(toolName, reportPath, todayJST, templateContent) {
  const promptLines = [
    `AGENTS.mdの「レポート作成・更新の手順」に従い、${toolName}(${reportPath})の調査レポートを更新せよ。`,
    '',
    '## 作業内容',
    '',
    '### ステップ1: レポートの作成・更新',
    `- 対象: ${reportPath}`,
    `- 本日の日付: ${todayJST}`,
    '- task-report-create-or-update.mdの指示に従い、レポート情報を最新化する',
    '- **【最優先】直近のアップデート情報（最新の変更内容）の調査と反映を最優先とせよ**',
    '- アップデート情報を起点として、主要機能、料金プラン、競合比較、フロントマターなどの関係箇所を必ず連動して更新せよ',
    '- **重要**: 競合ツールのバージョンアップや、新しい競合ツールの登場についても調査し、必要に応じて _reports/ ディレクトリ内の該当ツールのレポートも参照して、星取表（機能比較表）の競合ツール情報を確実に最新化せよ',
    '- **重要**: 以下のテンプレートの構成・セクション順序・形式に厳密に準拠する',
    '',
    '### ステップ2: 関連レポートの整理',
    '- task-organizing-category-tags.mdに従い、カテゴリ・タグ・関連付けを整理する',
    `- ${toolName}と同カテゴリまたはrelated_toolsに含まれるレポートとの双方向整合性を確保せよ`,
    '',
    '### ステップ3: リンクチェック',
    `- 作業完了後、\`PYTHONPATH=. uv run scripts/check_links.py ${reportPath}\` を実行してリンク切れを確認せよ`,
    '- 404エラー（リンク切れ）が検出された場合は、正しいURLに修正するか、リンクを削除する',
    '- 403エラー（アクセス拒否）の場合はGoogle検索で追加検証を行う：',
    '  - `site:g2.com \"ツール名\"` 等で検索し、ページの実在性を確認せよ',
    '  - 検索結果にツールのレビューページが表示されれば正しいURLに修正せよ',
    '  - 存在しない場合はレビューサイトへのリンク項目を削除し、「13. ユーザーの声」においてはGoogle検索結果からの引用で代替せよ',
    '',
    '### 注意事項',
    '- 各ステップを必ずこの順序で実行する',
    '- 関連レポートへの変更は最小限に留める',
    '- レポートの構成はテンプレートに厳密に従う（セクションの追加・削除・順序変更は禁止）',
    '- 各セクションの記載形式（表形式、箇条書き等）もテンプレートに従う',
    '- レポート更新時、最優先すべきは「直近のアップデート情報」の徹底調査と反映である。これを起点として、機能や料金などの波及する変更も必ずレポート全体に連動して更新すること',
  ];

  if (templateContent) {
    promptLines.push(
      '',
      '---',
      '',
      '## レポートテンプレート（厳守）',
      '',
      '以下のテンプレートに厳密に従ってレポートを作成・更新してください:',
      '',
      '```markdown',
      templateContent,
      '```'
    );
  }

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

  // Load Template content
  const templatePath = 'templates/template.md';
  const templateContent = loadTemplate(templatePath, core);

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

    const prompt = buildJulesPrompt(toolName, currentReport.path, todayJST, templateContent);

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
