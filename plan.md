1.  **Gather Data**
    *   **Security (3-5 items):**
        *   Better Auth Multiple Vulnerabilities (GHSA-5rr4-8452-hf4v, GHSA-g38m-r43w-p2q7, GHSA-j8v8-g9cx-5qf4) - Critical/High severities including SSRF, Account Takeover, SCIM Takeover. (Focus on 1-2 major ones for the report, e.g. SSRF and Account Takeover)
        *   Open WebUI Stored XSS (GHSA-9f4f-jv96-8766) - High severity, leading to account takeover and RCE.
        *   uutils coreutils Backup Mode Data Loss (GHSA-fqf6-gxhh-2xhw) - High severity silent data loss.
    *   **Releases/New Features (3-5 items):**
        *   Next.js v16.2.10
        *   Better Auth v1.6.11 (Security patch release fixing the above)
        *   LangChain v1.3.11
    *   **Trending Tools (3-5 items):**
        *   T3MP3ST (elder-plinius/T3MP3ST) - Autonomous red teaming platform / multi-agent offensive-security meta-harness.
        *   Rowboat (rowboatlabs/rowboat) - Open-source, local-first alternative to Claude Desktop (AI coworker with memory).
        *   OpenScience (synthetic-sciences/openscience) - Open-source AI workbench for scientific research.
        *   Kokoro - Local, CPU-Friendly, High-Quality TTS (Text-to-Speech).
2.  **Draft the Report**
    *   Follow the exact two-tier template structure in the prompt.
    *   Fill out sections for Today's Summary, Security, Releases, Trends, Tips, and Glossary.
    *   Ensure non-technical summaries ("🔰 ひとことで言うと", "💡 今日のポイント", "🛡️ まずやるべきこと") are included and easy to understand.
    *   Write technical details with specific CVE/GHSA IDs, versions, and explanations.
    *   Calculate words/characters to aim for 4000-7000 characters.
    *   Generate dynamic frontmatter based on the actual content.
3.  **Pre-commit steps & Verification**
    *   Run `pre_commit_instructions`.
    *   Save report to `_trending/2026-07-08.md`.
    *   Verify links using the script `PYTHONPATH=. uv run scripts/check_links.py --browser`.
4.  **Submit**
