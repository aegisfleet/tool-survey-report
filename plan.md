1. **Understand task requirements**:
   - Update `_reports/qwen.md` according to the new format (18 sections, including Section 4 "動作原理・システム構成" with Mermaid diagram).
   - The current date is `2026-09-26`.
   - Priority is to fetch the latest updates (up to 6 months) for Qwen, particularly around version 3.6 Plus or newer, and incorporate them.
   - Update competitor info (ChatGPT, Claude, Gemini) by referencing their reports and fetching latest facts.
   - Run verification scripts (`pnpm run verify-report _reports/qwen.md`).
   - Finalize autonomously without asking questions or confirmations.

2. **Action plan**:
   - Step 1: Gather latest update information about Qwen from Qwen GitHub, Blog, or from my web browsing capabilities if needed.
   - Step 2: Update `_reports/qwen.md` to conform strictly to `templates/template.md`. This includes ensuring Section 4 is present with a Mermaid diagram, and ensuring all 18 sections are properly numbered and formatted.
   - Step 3: Update competitive tools in the comparison table (`Section 17`) based on the latest info found in `_reports/chatgpt.md`, `_reports/claude.md`, and `_reports/gemini.md`. Ensure consistency.
   - Step 4: Run link and syntax checks using `pnpm run verify-report _reports/qwen.md`.
   - Step 5: Perform the mandatory pre-commit check (`pre_commit_instructions`).
   - Step 6: Submit via PR and conclude with a declarative completion statement only. No questions.
