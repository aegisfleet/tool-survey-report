import unittest
import sys
import os

# Add the root directory to sys.path to import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from scripts.check_mermaid import validate_static_mermaid_blocks


class TestMermaidStaticValidation(unittest.TestCase):

    def _validate(self, code, line=10):
        blocks = [{"line": line, "code": code}]
        return validate_static_mermaid_blocks("dummy.md", blocks)

    def test_flags_japanese_punctuation_in_unquoted_subgraph(self):
        code = "\n".join([
            "flowchart TD",
            "  subgraph ストレージ・配信層",
            "    A --> B",
            "  end",
        ])

        errors = self._validate(code)

        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0]["line"], 12)
        self.assertIn("・", errors[0]["error"])

    def test_allows_quoted_subgraph_label(self):
        code = "\n".join([
            "flowchart TD",
            '  subgraph "ストレージ・配信層"',
            "    A --> B",
            "  end",
        ])

        self.assertEqual(self._validate(code), [])

    def test_allows_bracket_subgraph_label(self):
        code = "\n".join([
            "flowchart TD",
            '  subgraph Storage["ストレージ・配信層"]',
            "    A --> B",
            "  end",
        ])

        self.assertEqual(self._validate(code), [])

    def test_flags_japanese_punctuation_in_subgraph_id_with_bracket_label(self):
        code = "\n".join([
            "flowchart TD",
            '  subgraph 拡張・出力["プラグイン・エンコーダー"]',
            "    A --> B",
            "  end",
        ])

        errors = self._validate(code)

        self.assertEqual(len(errors), 1)
        self.assertIn("・", errors[0]["error"])
        self.assertIn("subgraph ID", errors[0]["error"])

    def test_allows_ascii_subgraph_id_with_japanese_bracket_label(self):
        code = "\n".join([
            "flowchart TD",
            '  subgraph Output_Layer["プラグイン・エンコーダー"]',
            "    A --> B",
            "  end",
        ])

        self.assertEqual(self._validate(code), [])

    def test_allows_japanese_letters_without_punctuation(self):
        code = "\n".join([
            "flowchart TD",
            "  subgraph ユーザー",
            "    A --> B",
            "  end",
        ])

        self.assertEqual(self._validate(code), [])

    def test_allows_ascii_punctuation(self):
        code = "\n".join([
            "flowchart TD",
            "  subgraph クラウド/セルフホスト環境",
            "    A --> B",
            "  end",
            "  subgraph Findy Team+",
            "    B --> C",
            "  end",
        ])

        self.assertEqual(self._validate(code), [])

    def test_flags_ascii_parentheses_in_unquoted_subgraph(self):
        code = "\n".join([
            "flowchart TD",
            "  subgraph レーン(本番)",
            "    A --> B",
            "  end",
        ])

        errors = self._validate(code)

        self.assertEqual(len(errors), 1)
        self.assertIn("(", errors[0]["error"])

    def test_flags_ascii_parentheses_in_unquoted_edge_label(self):
        code = "\n".join([
            "flowchart TD",
            "  A -->|PCMチャンク (パイプ通信)| B",
        ])

        errors = self._validate(code)

        self.assertEqual(len(errors), 1)
        self.assertIn("(", errors[0]["error"])

    def test_allows_quoted_punctuation_in_edge_label(self):
        code = "\n".join([
            "flowchart TD",
            '  A -->|"PCMチャンク (パイプ通信)"| B',
        ])

        self.assertEqual(self._validate(code), [])

    def test_flags_inline_label_after_reverse_arrow(self):
        code = "\n".join([
            "flowchart TD",
            "  A <--|応答| B",
        ])

        errors = self._validate(code)

        self.assertEqual(len(errors), 1)
        self.assertIn("reverse arrows", errors[0]["error"])


if __name__ == '__main__':
    unittest.main()
