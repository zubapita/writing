# OpenCLaw専用機4選択肢 価格再確認レポート

## レビュー対象
- 原稿: `sources/OpenCLaw専用機4選択肢.md`
- レビュー日: 2026-02-28

## 1. 価格情報のファクトチェック（再調査）

| 項目 | 原稿記載 | 再確認結果 | ステータス | 根拠リンク |
|---|---|---|---|---|
| Mac mini M1/M2 中古相場（¥32,000〜54,000/¥49,500〜57,980/¥60,000〜） | 固定レンジとして提示 | **未確認。** 中古相場は日次/地域/在庫で変動。Amazon・メルカリ系でも実在価格は一致しない。Apple認定再生品のM2 8GB/256GBは 3.99?（公式）ではなく `$319（US）`/`256GB`の在庫枠あり。 | ⚠️ | [Apple公式 リファービッシュ品](https://www.apple.com/shop/product/FMFJ3LL/A/refurbished-mac-mini-apple-m2-chip-with-8%E2%80%91core-cpu-and-10%E2%80%91core-gpu), [Yahoo!フリマ実例](https://paypayfleamarket.yahoo.co.jp/item/z512728816), [OfferUp実例](https://offerup.com/item/detail/fa5a8df1-6951-3118-84e2-c82520c55952) |
| GMKtec NucBox G3（16GB/512GB） | ¥25,000〜30,000 | 公式販売ページは `16GB+512GB` で `USD 119.99`（在庫状況は都度変動）。記事内では金額換算根拠が不足。 | ✅（根拠更新要） | [GMKtec 公式](https://www.gmktec.com/en/products/nucbox-g3-most-cost-effective-mini-pc-with-intel-n100-processor) |
| Beelink Mini S12 Pro N100（16GB/500GB） | ¥25,000〜35,000 | 公式グローバルページは `USD 249.00`（在庫あり/在庫切れは時点による）。記事の幅は検証しにくいため、確認日・販売先を明記する運用が必要。 | ⚠️ | [Beelink 公式](https://beelinkminipc.com/products/103-beelink-mini-s12-pro-mini-pc) |
| Minisforum UN100P 16GB/512GB | ¥28,000〜35,000 | 公式販売ページは `USD 191.90`（`Sold out`表示あり）。技術販売頁（Tech-America）では `$177` で確認時在庫有りの報告あり。価格根拠は販売先に依存。 | ⚠️ | [Minisforum公式](https://store.minisforum.com/products/minisforum-un100p), [Minisforum公式（別言語ページ）](https://www.minisforum.com/products/minisforum-un100p-1), [Tech-America](https://www.tech-america.com/item/minisforum-un100p-mini-desktop-computer/un100p-16-512-) |
| ACEMAGIC Kron Mini K1 | ¥32,000〜40,000 | 公式ページでは `USD 254.00`（セール）/`319.00`（定価）、在庫 `Sold out`。記事価格の時点固定は不可。 | ⚠️ | [ACEMAGIC 公式](https://acemagic.net/products/kronmini-seriesk1) |
| GEEKOM A5 2025 Edition / R5-7430U | ¥49,990 | 公式系（geekompc）では構成別価格が頻繁に更新（例：5% OFFコード提示）。記事の固定円額は再現性が低い。本文は「公式価格ページ（確認日付付き）」参照へ変更。 | 🔍 | [GEEKOM 公式（A5）](https://www.geekompc.com/geekom-a5-2025-edition-mini-pc/) |
| Raspberry Pi 5 16GB | 「2025/1時点で $120」→現在価格として提示 | 公式では `2025/01/09` に `$120` で開始、`2026/02` に公式再値上げを宣言（2GB/4GB/8GB/16GBの加算幅明記）。記事は時点を明示して「当初 $120」または「公式値上げ後」を分離する必要。 | ✅（要時点分離） | [公式: 16GB発売](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/), [公式: memory-driven rises](https://www.raspberrypi.com/news/more-memory-driven-price-rises/) |
| Raspberry Pi 5 4GB/8GB価格 | ¥14,080/¥22,440（固定） | 固定金額は不確実。実売は店舗・為替・再販在庫で変動。 | 🔍 | [Raspberry Pi公式 16GB記事](https://www.raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120/), [各販売店価格例（確認日付き）](https://www.raspberrypi.com/news/more-memory-driven-price-rises/), [Robot Pi Shop（4GB）](https://robotpishop.com/products/raspberry-pi-5-4gb-ram) |
| Contabo Cloud VPS 10（東京） | 基本€6.85+2.35? →記載「約€9.20」 | 公式価格ページ: base €4.50。ロケーション fee（Japan）€2.35。合計 `€6.85` が該当。記事の合算値が誤り。 | ❌→✅ 修正 | [Contabo pricing](https://contabo.com/en-us/pricing/), [Contabo location fees](https://contabo.com/en-us/location-fees/) |
| Oracle Cloud Always Free | 「¥0/24GB常に使える」「ホームリージョン」「回収」| 公式：Always Free は**ホームリージョンの上限内**で最大 4 OCPU/24GB（A1 Flex）利用可。起動失敗時の `Out of host capacity` や請求条件は公式FAQの範囲内。 | ⚠️ | [Always Freeリソース](https://docs.oracle.com/iaas/Content/FreeTier/resourceref.htm), [Oracle FAQ](https://www.oracle.com/ba/cloud/free/faq/) |
| Vultr（「4 vCPU / 8GBが〜$48」） | 4 vCPU/8GB=$48 | 公式価格表では 4 vCPU/16GB= $96、3 vCPU/8GB= $48。本文は仕様の整合性が崩れている。 | ✅（要記述訂正） | [Vultr Pricing](https://www.vultr.com/pricing/) |
| OpenClaw要件（Node.js, メモリ） | `Node.js 22以上`など | 公式FAQ: `Node >= 22`、`推奨 2GB+ / 1vCPU+` と整合。 | ✅ | [OpenClaw FAQ](https://docs.openclaw.ai/start/faq/), [OpenClaw 安定版要件](https://openclawdoc.com/docs/getting-started/requirements/) |

## 2. 「参照リンク付き修正案（原稿置換向け）`

### 価格セクション（置換推奨文）
- **Cloud VPS 10（Contabo）**: `€6.85/月（Base €4.50 + Japan location fee €2.35）`
- **VPS比較**: `Vultrは「3 vCPU/8GB = $48」であり、`4 vCPU`を使うなら `16GB` が前提で `$96`
- **Raspberry Pi**: `16GBモデルは公式発表では$120だが、2026/2公式価格上昇を反映すると変動。購入時点価格を添付リンク付きで明示`
- **中古品価格**: `M1/M2 Mac mini`, `N100系 miniPC` は `価格表記を『参考レンジ』として、確認日＋販売先リンク付き` に変更

## 3. 追加すべき記載（脚注/注記）
1. 本文の価格表には `確認日` と `販売先（公式/中古）` を必ず追加。
2. 中古/在庫商品は `リンクは個別出品` が必須で、数値は「当該日確認価格」と明示。
3. `¥0` / 無料枠は、`Always Free eligibility / host capacity / サービス継続条件` とセットで注記。

## 4. 参考情報の実装（記事反映例）
- 見出し例: `価格は購入時点で変動します。以下は2026-02-28時点の確認リンクです。`
- 表カラム例: `価格（確認時） / 出典 / 確認日 / 更新周期`
- Cloud VPS行では `¥換算は為替の変動を明記`。
