# OpenClawのSkillはAgents Skill互換か

**はい、OpenClawのスキルは「標準的なAgentSkillsフォーマット」と完全に同じです！**  
しかも**Claude Code（ClaudeのComputer Use / Cursorなど）用のスキルを、ほぼそのままOpenClawで使える**よう設計されています。

以下に**超わかりやすく・最新情報（2026年2月25日時点の公式docs）**で解説します。

### 1. OpenClawのスキルフォーマット（公式仕様）
- スキル = **フォルダ1つ**  
  その中に必須ファイル：**SKILL.md**（大文字小文字区別なしでskill.mdもOK）

- **SKILL.mdの中身**  
  ① 先頭にYAML frontmatter（--- で囲む）  
  ② その後に自由なMarkdownで「このスキルはどう使うか」の指示文

**最低限必要な形（公式例）**
```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
---

# このスキルの使い方
...
（ここにエージェントに読ませたい手順やルールを詳しく書く）
```

- **必須項目**：`name` と `description` のみ
- **オプションで追加できる項目**（OpenClaw拡張）：
  - `metadata`（1行JSONでOpenClaw特有の設定：インストール方法、OS制限、必要なバイナリなど）
  - `homepage`, `user-invocable`, `disable-model-invocation` など

- さらにフォルダ内に置けるもの（オプション）：
  - `scripts/` … Python/JSなどの実行ファイル
  - `references/` … 参考資料
  - `assets/` … テンプレートなど

→ これが**AgentSkills仕様**そのものです（公式docsに明記：「We follow the AgentSkills spec for layout/intent.」）

### 2. Claude Code用のスキルはOpenClawでそのまま使える？
**はい、ほぼ100%互換です！**

- 複数の信頼できるソースで確認済み：
  - OpenClaw公式ブログ・docs：**「The format is portable, compatible with Claude Code and Cursor conventions.」**
  - コミュニティ実績：  
    「42個のClaude CodeスキルをOpenClawに移植した」  
    「79%のスキルがOpenClaw・Claude Code・Codexで完全にクロスプラットフォーム」  
    GitHubのawesomeスキル集でも共通で公開されているものが多数

**実際にできること**
- Claude Codeで作ったSKILL.mdフォルダをそのままコピー → OpenClawの  
  `~/clawd/skills/` または `~/.openclaw/skills/` に置くだけ
- `clawhub install` や手動でロード可能
- OpenClaw特有の`metadata.openclaw.*` はClaude Code側で無視されるだけなので問題なし
- 逆（OpenClaw → Claude Code）も同じく可能

**注意点（互換性を高めるコツ）**
- 基本の`name` + `description` + Markdown本文だけにしておくと最も移植しやすい
- OpenClawの拡張機能（自動インストールなど）を使いたい場合は追加でmetadataを書く
- スクリプトが入っている場合は実行環境（Pythonなど）が両方で揃っているか確認

### まとめ
| 項目                   | OpenClaw          | Claude Code / Cursor | 互換性 |
|------------------------|-------------------|----------------------|--------|
| ファイル形式           | SKILL.md          | SKILL.md             | 完全一致 |
| YAML frontmatter       | name + description | 同じ                 | 完全一致 |
| 仕様                   | AgentSkills準拠   | AgentSkills準拠      | 完全一致 |
| 移植のしやすさ         | ◎                 | ◎                    | 実績多数 |

つまり、**「Claude Codeで便利だったスキルを探してOpenClawに持ってこれる」**のがOpenClawの大きな魅力の一つなんです！

---
