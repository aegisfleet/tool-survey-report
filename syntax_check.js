            const fs = require('fs');
            const path = require('path');

            // テンプレートファイルを読み込み
            const templatePath = 'templates/template.md';
            let templateContent = '';
            try {
              templateContent = fs.readFileSync(templatePath, 'utf8');
              core.info(`Template loaded: ${templatePath} (${templateContent.length} bytes)`);
            } catch (error) {
              core.warning(`Failed to load template: ${error.message}`);
            }

            // _reportsディレクトリ内のすべてのMarkdownファイルを取得
            const reportsDir = '_reports';
            const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.md'));

            if (files.length === 0) {
              core.info('No report files found in _reports directory');
              return;
            }

            const reportsWithDates = [];

            // 各レポートファイルのlast_updatedを確認
            for (const file of files) {
              const filePath = path.join(reportsDir, file);
              const content = fs.readFileSync(filePath, 'utf8');

              // YAMLフロントマターからlast_updatedを抽出
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

            if (reportsWithDates.length === 0) {
              core.error('No report with valid last_updated date found');
              process.exit(1);
            }

            // target_report入力があるかどうか確認
            const targetReportInput = process.env.TARGET_REPORT;
            let targetReports = [];

            if (targetReportInput && targetReportInput.trim() !== '') {
              core.info(`Target report specified: "${targetReportInput}"`);
              const targetInput = targetReportInput.trim();
              const lowerTargetInput = targetInput.toLowerCase();

              // 1. 完全一致チェック (ファイル名)
              let matchedReport = reportsWithDates.find(r =>
                r.filename === targetInput || r.filename.replace('.md', '') === targetInput
              );

              if (!matchedReport) {
                // 2. 完全一致チェック (ツール名 - ケースインセンシティブ)
                matchedReport = reportsWithDates.find(r => {
                  const toolNameMatch = r.content.match(/tool_name:\s*["']?([^"'\r\n]+)["']?/);
                  const toolName = toolNameMatch ? toolNameMatch[1] : '';
                  return toolName.toLowerCase() === lowerTargetInput;
                });
              }

              if (matchedReport) {
                core.info(`Found exact match: ${matchedReport.filename}`);
                targetReports = [matchedReport];
              } else {
                // 3. 部分一致チェック
                const partialMatches = reportsWithDates.filter(r => {
                  const fileNameMatch = r.filename.toLowerCase().includes(lowerTargetInput);

                  const toolNameMatch = r.content.match(/tool_name:\s*["']?([^"'\r\n]+)["']?/);
                  const toolName = toolNameMatch ? toolNameMatch[1] : '';
                  const nameMatch = toolName.toLowerCase().includes(lowerTargetInput);

                  return fileNameMatch || nameMatch;
                });

                if (partialMatches.length === 1) {
                  core.info(`Found single partial match: ${partialMatches[0].filename}`);
                  targetReports = [partialMatches[0]];
                } else if (partialMatches.length > 1) {
                  core.error(`Multiple reports matched "${targetInput}": ${partialMatches.map(r => r.filename).join(', ')}. Please specify a more precise name.`);
                  process.exit(1);
                } else {
                  core.error(`No report found matching "${targetInput}"`);
                  process.exit(1);
                }
              }
            } else {
              // 更新日時が古い順にソートして上位N件を取得（inputパラメータで制御、デフォルト1）
              // SECURITY: Use process.env to prevent script injection.
              // This prevents malicious input from breaking out of the script context.
              let reportCount = parseInt(process.env.REPORT_COUNT, 10);
              if (isNaN(reportCount) || reportCount < 1) {
                core.warning(`Invalid report_count "${process.env.REPORT_COUNT}", defaulting to 1`);
                reportCount = 1;
              }
              targetReports = reportsWithDates
                .sort((a, b) => a.lastUpdated - b.lastUpdated)
                .slice(0, reportCount);
            }

            const oldestReports = targetReports;
