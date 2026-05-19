/**
 * Auto-merge workflow script for report-only PRs.
 * Centralized, refactored, and aligned with modern JavaScript best practices.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

const ALLOWED_AUTHORS = ['google-labs-jules', 'google-labs-jules[bot]', 'aegisfleet'];

/**
 * Validates the contents and structure of _data/categories.yml if it has changed.
 * @param {Array<string>} files List of changed files in the PR
 * @param {string} owner Repo owner
 * @param {string} repo Repo name
 * @param {number} prNumber PR number
 * @param {object} github GitHub Octokit client
 * @param {object} core GitHub Actions Core helper
 */
async function validateCategoriesYaml(files, owner, repo, prNumber, github, core) {
  if (!files.includes('_data/categories.yml')) {
    return;
  }

  core.info('Validating _data/categories.yml...');
  try {
    const content = fs.readFileSync('_data/categories.yml', 'utf8');
    const parsed = yaml.load(content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('YAML content is not a valid key-value mapping.');
    }
    // Validate all keys and values are strings
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key !== 'string' || typeof value !== 'string') {
        throw new Error(`Invalid entry under key "${key}": both key and value must be strings (e.g., "Category": "Emoji").`);
      }
    }
    core.info('  ✅ _data/categories.yml validation passed.');
  } catch (err) {
    const errorMsg = `❌ カテゴリ定義検証エラー: _data/categories.yml\n\nエラー詳細: ${err.message}`;
    core.error(errorMsg);
    await github.rest.issues.createComment({ 
      owner, 
      repo, 
      issue_number: prNumber, 
      body: `${errorMsg}\n\n自動マージを中止しました。_data/categories.yml を修正してください。`
    });
    throw new Error(`Validation failed for _data/categories.yml: ${err.message}`);
  }
}

/**
 * Finds the end marker of frontmatter in the file content.
 * @param {string} content Markdown file content
 * @param {number} startOffset Offset to start searching from
 * @returns {{index: number, length: number}} The index and length of the closing marker
 */
function findFrontmatterEndMarker(content, startOffset) {
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

/**
 * Validates frontmatter of all modified Markdown files.
 * @param {Array<string>} files List of changed files in the PR
 * @param {string} owner Repo owner
 * @param {string} repo Repo name
 * @param {number} prNumber PR number
 * @param {object} github GitHub Octokit client
 * @param {object} core GitHub Actions Core helper
 * @returns {Promise<boolean>} True if any YAML normalization is needed
 */
async function validateMarkdownFrontmatter(files, owner, repo, prNumber, github, core) {
  const mdFiles = files.filter(f => f.endsWith('.md'));
  let needsFix = false;

  for (const file of mdFiles) {
    core.info(`Validating frontmatter: ${file}`);
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        core.info(`  File ${file} not found (possibly deleted) — skipping validation.`);
        continue;
      }
      throw err;
    }

    // Check frontmatter starts correctly
    if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\nファイルが「---」で始まっていません。フロントマターの開始マーカーがありません。`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。フロントマターを修正してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: missing opening ---`);
    }

    const startMarkerLength = content.startsWith('---\r\n') ? 5 : 4;
    const { index: endMarkerIndex, length: lineEndingLength } = findFrontmatterEndMarker(content, startMarkerLength);

    if (endMarkerIndex === -1) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\nフロントマターの終了マーカー「---」が見つかりません。`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。フロントマターを修正してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: missing closing ---`);
    }

    if (endMarkerIndex === startMarkerLength) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\n空のフロントマターが検出されました（開始「---」の直後に終了「---」があります）。\nフロントマターの内容が本文に漏れ出している可能性があります。`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。フロントマターを修正してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: empty frontmatter detected`);
    }

    const frontmatterContent = content.substring(startMarkerLength, endMarkerIndex + 1);
    let parsed;
    try {
      parsed = yaml.load(frontmatterContent);
      core.info('  ✅ YAML syntax is valid.');

      const normalizedYaml = yaml.dump(parsed, {
        allowUnicode: true,
        sortKeys: false,
        lineWidth: -1
      });

      if (frontmatterContent.trim() !== normalizedYaml.trim()) {
        core.info('  ⚠️ YAML format is not normalized. Will run auto-fix.');
        needsFix = true;
      } else {
        core.info('  ✅ YAML format is normalized.');
      }
    } catch (yamlErr) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\nYAML構文エラー: ${yamlErr.message}`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。フロントマターを修正してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: ${yamlErr.message}`);
    }

    const isTrending = file.startsWith('_trending/');
    const requiredFields = isTrending ? ['title'] : ['title', 'tool_name'];
    const missingFields = requiredFields.filter(field => !parsed || !parsed[field]);
    if (missingFields.length > 0) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\n必須フィールドが見つかりません: ${missingFields.join(', ')}\n\nフロントマターの形式が正しくない可能性があります。`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。フロントマターを修正してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: missing required fields: ${missingFields.join(', ')}`);
    }
    core.info(`  ✅ Required fields present: ${requiredFields.join(', ')}`);

    const bodyContent = content.substring(endMarkerIndex + lineEndingLength);
    const hasDuplicate = bodyContent.includes('# === フロントマター ===') || 
                        (bodyContent.includes('title: "') && (isTrending || bodyContent.includes('tool_name: "')));

    if (hasDuplicate && !isTrending) {
      const errorMsg = `❌ フロントマター検証エラー: ${file}\n\n本文内にフロントマターの内容が重複して存在します。\nフロントマターが2回記述されている可能性があります。`;
      core.error(errorMsg);
      await github.rest.issues.createComment({ 
        owner, 
        repo, 
        issue_number: prNumber, 
        body: `${errorMsg}\n\n自動マージを中止しました。重複を削除してください。`
      });
      throw new Error(`Frontmatter validation failed for ${file}: duplicate frontmatter content in body`);
    }
    core.info('  ✅ No duplicate frontmatter detected.');
  }

  return needsFix;
}

/**
 * Automatically fixes YAML formatting in frontmatter and pushes the changes.
 * @param {string} owner Repo owner
 * @param {string} repo Repo name
 * @param {number} prNumber PR number
 * @param {object} github GitHub Octokit client
 * @param {object} core GitHub Actions Core helper
 */
async function autoFixYamlFormat(owner, repo, prNumber, github, core) {
  core.info('Auto-fixing YAML formatting...');
  try {
    const commitLog = execSync('git log -1 --pretty=format:"%B"').toString();
    if (commitLog.includes('[skip ci]') && commitLog.includes('Auto-fix YAML formatting in frontmatter')) {
      core.warning('Detected a previous auto-fix commit. Bailing out to prevent infinite loop.');
      const errorMsg = '⚠️ YAMLフォーマットの自動修正を試みましたが、繰り返し失敗している可能性があります。[skip ci] タグを持つコミットがすでに存在するため、無限ループを防ぐために処理を中止しました。手動でフォーマットを確認してください。';
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: errorMsg
      });
      throw new Error('Auto-fix aborted to prevent infinite loop.');
    }

    execSync('pnpm lint:yaml --fix', { stdio: 'inherit' });

    execSync('git config user.name "github-actions[bot]"');
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
    execSync('git add _reports/ _trending/');

    const status = execSync('git status --porcelain _reports/ _trending/').toString();
    if (status.trim().length > 0) {
      execSync('git commit -m "Auto-fix YAML formatting in frontmatter [skip ci]"');
      execSync('git push');

      core.info('Changes have been pushed. Waiting 3 seconds for GitHub to update PR state...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: 'YAMLフォーマットの自動修正を適用しました。Auto-fixed YAML formatting.'
      });
    } else {
      core.info('No changes were made by the auto-fix.');
    }
  } catch (fixErr) {
    core.error(`Failed to auto-fix or push changes: ${fixErr.message}`);
    throw new Error(`Auto-fix failed: ${fixErr.message}`);
  }
}

/**
 * Main execution handler.
 */
module.exports = async ({ github, context, core }) => {
  const pr = context.payload.pull_request;
  if (!pr) {
    core.info('No pull_request payload available. Exiting.');
    return;
  }

  const prNumber = pr.number;
  const { owner, repo } = context.repo;
  const author = pr.user && pr.user.login;

  core.info(`PR #${prNumber} by ${author}`);

  if (!author) {
    core.info('No PR author found — skipping.');
    return;
  }

  if (!ALLOWED_AUTHORS.includes(author)) {
    core.info(`PR author (${author}) is not in allowed list (${ALLOWED_AUTHORS.join(', ')}) — skipping.`);
    return;
  }

  // Fetch PR files with pagination support
  let files = [];
  let page = 1;
  while (true) {
    const res = await github.rest.pulls.listFiles({ owner, repo, pull_number: prNumber, per_page: 100, page });
    files = files.concat(res.data.map(f => f.filename));
    if (res.data.length < 100) break;
    page += 1;
  }

  if (files.length === 0) {
    core.info('No changed files found — skipping.');
    return;
  }

  core.info(`Changed files:\n${files.join('\n')}`);

  const allAllowedFiles = files.every(f => f.startsWith('_reports/') || f.startsWith('_trending/') || f === '_data/categories.yml');
  if (!allAllowedFiles) {
    core.info('At least one changed file is outside _reports/, _trending/, or is not _data/categories.yml — skipping auto-merge.');
    return;
  }

  // 1. Validate _data/categories.yml
  await validateCategoriesYaml(files, owner, repo, prNumber, github, core);

  // 2. Validate frontmatter of Markdown files
  const needsFix = await validateMarkdownFrontmatter(files, owner, repo, prNumber, github, core);

  core.info('All frontmatter validations passed.');

  // 3. Format fixing if required
  if (needsFix) {
    await autoFixYamlFormat(owner, repo, prNumber, github, core);
  }

  // 4. Draft to Ready conversion if applicable
  if (pr.draft) {
    core.info('PR is draft and only touches reports/categories — converting to ready and adding comment.');
    const exec = require('node:util').promisify(require('node:child_process').exec);
    try {
      const { stdout, stderr } = await exec(`gh pr ready ${prNumber}`);
      core.info(`gh pr ready output: ${stdout}`);
      if (stderr) core.warning(`gh pr ready stderr: ${stderr}`);
    } catch (error) {
      core.error(`Failed to mark PR as ready: ${error}`);
      throw error;
    }

    await github.rest.issues.createComment({ 
      owner, 
      repo, 
      issue_number: prNumber, 
      body: 'このドラフトPRは `_reports/`、`_trending/`、または `_data/categories.yml` のみを変更しているため、自動的にレビュー準備完了状態に変更され、マージされます。\n\nThis draft PR only modifies `_reports/`, `_trending/`, or `_data/categories.yml` and was automatically converted to ready-to-review; it will be merged automatically.' 
    });

    // Wait until state updates
    let attempts = 0;
    const maxAttempts = 3;
    let updatedPr;
    while (attempts < maxAttempts) {
      core.info(`Waiting for PR to be ready (attempt ${attempts + 1}/${maxAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        const response = await github.rest.pulls.get({ owner, repo, pull_number: prNumber });
        updatedPr = response.data;
        if (!updatedPr.draft) {
          core.info('PR is now ready for review');
          break;
        }
      } catch (err) {
        core.warning(`Failed to get PR state (attempt ${attempts + 1}): ${err}`);
      }
      attempts++;
    }

    if (!updatedPr || updatedPr.draft) {
      throw new Error('Failed to convert PR from draft to ready');
    }
  }

  // 5. Perform the Merge
  core.info('Merging PR...');
  try {
    await github.rest.pulls.merge({ owner, repo, pull_number: prNumber, merge_method: 'squash' });
    await github.rest.issues.createComment({ 
      owner, 
      repo, 
      issue_number: prNumber, 
      body: 'Auto-merged: changes limited to `_reports/`, `_trending/`, or `_data/categories.yml`.' 
    });
    core.info('PR merged successfully.');

    core.info('Waiting 10 seconds before dispatching jekyll.yml...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    try {
      core.info('Dispatching jekyll.yml workflow...');
      await github.rest.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: 'jekyll.yml',
        ref: 'main',
        inputs: {}
      });
      core.info('jekyll.yml dispatched successfully.');
    } catch (dispatchErr) {
      core.warning(`Failed to dispatch jekyll.yml: ${dispatchErr}`);
    }
  } catch (err) {
    core.error(`Failed to merge PR: ${err}`);
    throw err;
  }
};
