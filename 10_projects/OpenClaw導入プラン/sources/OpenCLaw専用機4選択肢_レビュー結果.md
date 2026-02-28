# OpenClaw専用機器4選択肢 価格ファクトチェック結果（再確認）

更新日: 2026-02-28
対象原稿: `sources/OpenCLaw専用機4選択肢.md`

## 0) 結論（重要）
- 価格は現時点で「固定金額で示すと不正確」になっている箇所が多い。
- 特に**中古価格・販売停止状態のモデル**は、記事本文のレンジをそのまま断定しないこと。
- 記載方針は「**確認日・販売先・在庫状況付き**」か、**“参考レンジ（例示）”** に変更するのが妥当。
- 重大誤記として、**Contabo Cloud VPS 10の合算を 9.20€ としていた点、Vultr の 4vCPU=8GB=48$ 記載**は訂正対象。

## 1) 価格・在庫情報の再検証

### OpenClaw 要件（参考）
- OpenClaw FAQ で `Node >= 22` は明記。
- VPS要件は「絶対最小 1 vCPU / 1GB RAM / 約500MB」、推奨「1〜2 vCPU、2GB以上」。
- Raspberry Pi は 512MB〜1GB RAM で動作可能、1台構成時は 2GB推奨（目安）という記載あり。
- 参照: https://docs.openclaw.ai/help/faq

### 2) Windows miniPC / Mac mini / Raspberry Pi 価格帯

- **GMKtec NucBox G3（N100）**
  - 公式ページは `16+512GB` の表示が限定的（JSベース）で、確認時点の価格表記は変動。
  - 取得できた値例では `Barebone` が `$119.99`（比較対象 `$149.99`）で、在庫や地域で価格差・表示が異なる。
  - 参照: https://www.gmktec.com/products/nucbox-g3-most-cost-effective-mini-pc-with-intel-n100-processor

- **Beelink Mini S12 Pro（N100）**
  - 公式各地域ページで `€209`（旧セール価、在庫枯渇）の表示を確認したが、時間差が大きく、記事の `25,000〜35,000円` としての固定化は困難。
  - 参照: https://pl.beelinkminipc.com/products/103-beelink-mini-s12-pro-mini-pc , https://fr.beelinkminipc.com/products/103-beelink-mini-s12-pro-mini-pc

- **MINISFORUM UN100P（N100）**
  - 公式ストアでは `US $191.90` と表示しつつ在庫状態は `Sold out`。
  - 参照: https://store.minisforum.com/products/minisforum-un100p-1

- **ACEMAGIC Kron Mini K1（Ryzen 5 7430U）**
  - 公式2系統のページで在庫・価格が不一致。`$254→$319のセール中`かつ在庫切れ扱いの表示あり。
  - 参照: https://acemagic.net/products/kronmini-seriesk1 , https://acemagic.com/products/acemagic-k1-mini-pc

- **GEEKOM A5 2026 Edition**
  - 公式ページ上で `A5 2026 Edition R5-7430U 16GB+512GB/1TB` の選択肢がある一方、価格表示が JS 依存で固定値の引用が難しい。
  - 価格断定は避け、当該ページへの当日リンク掲載へ。
  - 参照: https://www.geekompc.com/geekom-a5-mini-pc/

- **Mac mini（M1/M2・中古）**
  - 記事の固定相場（5万円以下でのM1/M2中古価格レンジ）は、取引市場で時点変動が大きく厳密固定は不可。中古と新品・整備品を混同しやすい。
  - Apple公式の認証済みリファビッシュ情報を最低1件参照する必要あり。
  - 参照: https://www.apple.com/shop/product/FMFJ3LL/A/refurbished-mac-mini-apple-m2-chip-with-8-core-cpu-and-10-core-gpu

- **Raspberry Pi 5 16GB / 4GB / 8GB**
  - 16GB版は2025-01-09に `$120` 発表（掲載先含む）。
  - 2026-02-02 の公式記事では 16GBは **+60$** の追加上げ（`memory-driven price rises`）が告知され、流通価格が継続変動している。
  - 4GB/8GBの「4,4,5千円前後」は販売店依存で再確認必須。
  - 参照: https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/ , https://www.raspberrypi.com/news/more-memory-driven-price-rises/

### 3) クラウドVPS 価格の見直し

- **Contabo Cloud VPS 10**
  - 公式価格: `€4.50`。
  - 日本リージョン追加は `€2.35`（月額）→ 合計 `€6.85`（記事中の「9.20€」は旧解釈/重ね計算ミス）。
  - 参照: https://contabo.com/en-us/pricing/ , https://contabo.com/en-us/location-fees/

- **Oracle Cloud Always Free**
  - 公式上は Always Free で `A1.Flex 4 OCPU / 24GB` まで（アカウントのホームリージョン前提）。
  - “out of host capacity” は容量制約が原因の可能性がある旨記載あり。
  - 参照: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

- **Vultr（参考）**
  - 公式価格表で 3vCPU/8GB が `$48`、4vCPU/12GB が `$72`、4vCPU/16GB が `$96`。
  - 記事の「4vCPU=8GB=`$48`」は表現が不整合。
  - 参照: https://www.vultr.com/pricing/

## 2) 置換提案（原稿編集用）

- Cloud VPS（Contabo）価格は `3vCPU/8GB/75GBで€4.50 + 日本ロケーション費€2.35 = 月額€6.85（税別）` と明示。
- Vultr比較では `3vCPU/8GB=$48`、`4vCPU/12GB=$72`、`4vCPU/16GB=$96` を基準に統一。
- Raspberry Pi、Mac mini、miniPCの価格は
  - 「**調査日**」「**販売先**」「**在庫状況**」を併記し、旧価格の固定レンジは削除。
  - 中古市場・再販売在庫は、同一構成でも日次で変動しやすい旨を明記。

## 3) 備考

- 本稿中に挙げた価格は、執筆時点（2026-02-28）での再確認結果を踏まえた修正方針です。
- 価格の信頼性を担保するには、原稿内表の各セルを次の形式で統一すると再チェック工数が下がります。
  - `価格（確認時） / 出典 / 在庫状態 / 確認日 / 追記（同日再確認を要する場合）`
