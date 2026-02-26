# 指示

## 執筆　（Claude Code / Opus 4.6）

/negishi-documentary-writing-skill @drafts/構成案.md の内容に従いながら、@sources/ の資料を参照し、@drafts/原稿v1.mdとして保存してください。

## レビュー　（Codex CLI / GPT-5.3-Codex-Spark）

$article-review @drafts/構成案.md を参考に @drafts/原稿v1.md をレビューして結果を @drafts/原稿v1レビュー結果.md として保存してください。

## 記事修正　（Claude Code / Opus 4.6）

@drafts/原稿v1レビュー結果.md を参照して妥当と思われる意見を採用し、 @drafts/原稿v1.md の修正計画を立ててください。　ただし、原稿の大幅な構成変更などはNGです。原稿を修正したものは @drafts/原稿v2.mdとして保存してください。

## 図版作成と挿入

/article-infographic @drafts/原稿v3.md に図を挿入してください。


## 図版再生成

/nanobananajp @final/図生成データ.md のfig01のみ再生成してください


## Word文書化

/word-document-creator @final/原稿v3_with_figs.md を画像入りのWord文書にしてください。
