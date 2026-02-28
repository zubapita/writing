# OpenClaw専用機4選択肢 価格再ファクトチェック（日本円表示を優先）

レビュー日: 2026-02-28
対象: `sources/OpenCLaw専用機4選択肢.md`

## 結論
- 「記事にある価格レンジ」をそのまま確定値として扱うのは難しい。特に中古・在庫依存商品のため、**価格は都度更新日付きで再取得**が必要。
- 依頼どおり**日本円で価格表示が確認できた情報**で整理すると、記事の固定レンジのうち一部は事実確認対象外（🔍）となる。

## 価格再確認結果（JPY表示可否で再構成）

### 1) MiniPC（新品想定）

| 項目 | 記事の記載 | 日本円での再確認結果 | 判定 | 補足 |
|---|---|---|---|---|
| GMKtec NucBox G3（16GB/512GB想定） | 25,000〜30,000円 | GMKtec 日本公式ページで **ベアボーン価格 17,168円（在庫変動）** として表示。メモリ/SSD別は同ページ上のオプションあり。 | ⚠️ | 記事の範囲はベアボーン価格とセット販売価格を混同している可能性あり。構成別個別価格を追記すべき。<br>参照: https://jp.gmktec.com/collections/g%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA/products/gmktec-nucbox-g3-intel%C2%AE-alder-lake-n100
| Beelink Mini S12 Pro（16GB/500GB） | 25,000〜35,000円 | 記事・レビュー情報で「実売 31,800円前後」「30,090円（セール）」等の値例あり。公式欧州価格はEUR。 | ⚠️ | 日本円の公式直販根拠は限定的。価格は変動が大きいため「掲載日・販売先」明記が必須。<br>参照: https://pc.watch.impress.co.jp/docs/topic/feature/1505384.html#l27
| MINISFORUM UN100P（16GB/512GB） | 28,000〜35,000円 | minisforum.jp セールページで **29,590円（割引前 36,980）**（期間セール）あり。公式USは $191.90 で在庫表示が `16GB/256`・`16GB/512`。 | ⚠️ | この記事は在庫価格で可変。固定レンジとしては危険。<br>参照: https://www.minisforum.jp/pages/2025-flash-sale、https://www.minisforum.com/ja/products/minisforum-un100p-1
| ACEMAGIC Kron Mini K1（16GB） | 32,000〜40,000円 | ACEMAGIC公式JAでは `16GB+512GB` が **$254→$319（販売）**、在庫切れ表示。報道記事で 39,998円（セール）、60,998円＋クーポン等の記載あり。 | ⚠️ | 円建て一次情報は限定的。記事中は「価格表示日付き」「在庫状況付き」に変更。<br>参照: https://acemagic.net/ja/products/kronmini-seriesk1 , https://weekly.ascii.jp/elem/000/004/348/4348890/
| GEEKOM A5 2025（R5-7430U 16GB/512GB） | 49,990円 | GEEKOM日本公式で `セール価格61,900円（通常 62,990円）`、`R5-7430U(16GB/512GB)在庫あり` を表示。 | ⚠️ | 記事の49,990円は製品ロットと時期が異なるため整合確認不足。公式JPページを追記。<br>参照: https://geekom.jp/products/nuc-geekom-a5-amd-ryzen-7

### 2) Raspberry Pi 5

| 項目 | 記事の記載 | 日本円での再確認結果 | 判定 | 補足 |
|---|---|---|---|---|
| Raspberry Pi 5 4GB | 10,450円（本文） | Switch Science 4GBモデル: **17,380円**（税込）。価格は構成・販売時期で変動。 | ⚠️ | 固定値 10,450円は参照時点不明。国内販売ページを要参照日更新。<br>参照: https://www.switch-science.com/collections/raspberry-pi-5 |
| Raspberry Pi 5 8GB | 14,080円（本文） | Switch Science 8GBモデル: **25,190円**（税込）。 | ⚠️ | 固定値は再計測が必要。<br>参照: https://www.switch-science.com/collections/raspberry-pi-5 |
| Raspberry Pi 5 16GB（2025年1月） | 22,440円 | GigazineとKSYで**22,440円**（税込）記載の報告あり。 | ✅ | 現時点では「当時の発売時価格」であり、価格変動（値上げ・再販売）があり得る。<br>参照: https://gigazine.net/gsc_news/en/20250110-raspberry-pi-5-ram-16gb、https://raspberry-pi.ksyic.com/main/index/pdp.id/1157/pdp.open/1157

### 3) クラウドVPS

- **Contabo Cloud VPS 10 / Vultr / Oracle** は公式上は USD/EUR表示が中心で、今回の条件では「日本円表示一次情報」が取れない。
- そのため価格欄は「海外通貨＋換算」を明記し、記事本文では `為替日` と共に注記必須。

## 修正提案（記事へ反映）

1. 各行に次の4情報を必須化: `価格（確認日） / 通貨 / 販売先 / 在庫/販売条件`。
2. MiniPC比較は `固定レンジ（〜）` から `参照時価格（例: 61,900円）` 形式へ変更。
3. 海外通貨のみの商品は「円換算の公式表記なし」「公式/販売先の価格更新が必要」と明示。
4. 価格更新履歴（最終更新日）を追記し、記事中の断定文（「実勢で5万円以下」「固定相場で」）は緩和。

## 追加で残っている懸念（要再確認）

- すべての miniPC は季節セールやクーポン、在庫切れ状態で価格が大きく変わる。
- 中古市場（Mac mini含む）は出品価格が時点依存で、取引毎に変動。本文は `レンジ` ではなく `参考事例（取得日付付き）` へ変更。
