# 記事レビューレポート

## レビュー対象
- 原稿: `sources/OpenCLaw専用機4選択肢.md`
- 構成案: 該当ファイルなし（指定なし）
- レビュー日: 2026-02-28

## サマリー
- OpenClaw本体の要件・OS方針・Docker方針・チャネル対応は公式ドキュメントとほぼ一致しますが、記事本文には未検証値が多く混入しています。
- 特に「CPUベンチマーク」「価格レンジ」「VPS仕様（Cloud VPS 10）」といった数値は一次情報の根拠が弱く、修正推奨が複数あります。
- 対象者が選択判断をする記事としては、検証可能な実需件を残し、変動する価格・モデル比較値を時点明記または分離する必要があります。

## 1. ファクトチェック結果

| # | 原稿の記述 | 判定 | 検証結果・正しい情報 | 出典 |
|---|-----------|------|--------------------|------|
| 1 | `Node 20.0.0` が前提 | ⚠️ | 公式FAQ/インストールでは **Node >= 22** が必須 | docs.openclaw.ai/start/faq、docs.openclaw.ai/install/installer |
| 2 | 最小要件が`2GB RAM / 1コア / 1GBディスク` | ⚠️ | 公式FAQは VPS/VM の最小要件を「`1 vCPU / 1GB RAM / ~500MB disk`」、推奨を「`1〜2 vCPU / 2GB RAM`」と明記（CPU/メモリは用途追加で拡張推奨） | docs.openclaw.ai/start/faq |
| 3 | `推奨 4GB RAM / 2コア` | ⚠️ | 公式は `1〜2 vCPU`, `2GB以上` を推奨。用途（ブラウザ自動化や複数チャネル）ならさらに増設を推奨 | docs.openclaw.ai/start/faq |
| 4 | `Docker対応（amd64/arm64）`と記載 | 🔍 | Dockerは公式で「選択肢」扱いだが、要否や要件（Node.js/OSなど）は記事にない具体値に対して十分な実測根拠が不足 | docs.openclaw.ai/install/docker |
| 5 | `Windows 10+ (WSL2)`, `macOS 13+`, `Linux kernel 5.4+` | ⚠️ | OpenClaw公式はWindowsは**WSL2推奨**、Windowsネイティブは未検証・問題ありを明示。macOS/OSバージョン条件は公式一次情報を確認できなかった | docs.openclaw.ai/windows |
| 6 | `Peter Steinberger`開発者として断定 | 🔍 | 公式ドキュメントでは開発者名の明記確認が取れず。Web上の二次情報は一致しないものが混在 | - |
| 7 | `GitHub星数 10万超` | 🔍 | 一次ソース（公式プロジェクトページ）での現時点スター数確認が未取得。公開ブログや二次メディアは数値差があり要検証 | - |
| 8 | OpenClawは`WhatsApp・Telegram・Slack・Discord`などに対応 | ✅ | 公式チャネル一覧に同等の対応を確認（Slack/Discord/WhatsApp/Telegram/Mattermost/Signal等） | docs.openclaw.ai/channels/index |
| 9 | 1つの設定で複数チャネル同時運用可能 | ✅ | 公式アーキテクチャ・CLI説明で、1 Gateway が複数チャネルを扱える前提 | docs.openclaw.ai/architecture |
|10 | Mattermost/Teamsはプラグイン扱いである | ✅ | 公式で`plugin`扱い、Mattermostはプラグイン前提 | docs.openclaw.ai/channels/index |
|11 | Raspberry Pi 5 の16GBモデルは `$120` | ✅ | Raspberry Pi公式が 2025-01 のリリース記事で 16GB版価格を `120$` と明記 | raspberrypi.com/news/16gb-raspberry-pi-5-on-sale-now-at-120 |
|12 | Pi 5はARM64で`Dockerなどx86非対応イメージの可能性` | ✅ | OpenClawはARM64対応を明記し、ARM向けでイメージ差異の注意喚起あり（原則は可否の見分けが必要） | docs.openclaw.ai/start/faq |
|13 | `Intel N100`/`Ryzen 5 7430U`性能表（M2 vs i5 etc） | 🔍 | ベンチ値はユーザー投稿由来（ユーザーテスト）で再現条件不明。公式が直接提供する比較値ではないため、原数値を断定表示は不可 | browser.geekbench.com/processors/intel-n100、AMD product spec (Ryzen 5 7430U) |
|14 | `Ryzen 5 7430U`は「Zen3系」「8コア想定」 | ❌ | AMD公式仕様では **6コア12スレッド / Zen 3 / 15W** | amd.com/en/products/processors/laptop/ryzen/7000-series/amd-ryzen-5-7430u.html |
|15 | `Ryzen 5 7430Uが実質16GB向け再ブランド`などの言及 | 🔍 | 文章中の推定・断定が多く、公式には確認不可。記事での断定表現は過度 | amd公式仕様 |
|16 | `Intel N100は4コア4スレッド、TDP 6W` | ✅ | Intel公式仕様で4C/4T、TDP 6Wを確認 | intel.com/content/www/us/en/products/sku/231803/intel-processor-n100-6m-cache-up-to-3-40-ghz.html |
|17 | Contabo VPS10は`4 vCPU, 8GB RAM` | ❌ | Contabo公式ページでは `Cloud VPS 10` が `3 vCPU, 8 GB RAM`（プランにより75GB NVMe/150GB SSD） | contabo.com/en-us/unmanaged-vps |
|18 | Contabo月額 4,500円弱（東京） | ⚠️ | Contaboは基本利用料0、リージョン別追加料あり（例: Asia Japan 2.35 EUR）。記事の換算と値は要再計算 | contabo.com/en-us/location-fees/
|19 | Contabo 200Mbps前後の速度表現 | ⚠️ | 公式はトラフィック帯域を「32TB traffic*unlimited incoming」等で示す。200Mbps表現は一次根拠不足 | contabo.com/en-us/unmanaged-vps
|20 | Oracle Cloud `4 OCPU, 24GB` のAlways Free有償 | ✅ | Oracle公式でA1.FlexのAlways Freeは 4 OCPU / 24GB RAM に等価 | docs.oracle.com/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
|21 | Oracle Always Freeインスタンスは7日でCPU/NW/メモリ条件を満たすとリクレームの可能性 | ✅ | 公式はアイドルCPU/NW（A1はメモリ含む）の95パーセンタイル条件でリクレーム可能と明記 | docs.oracle.com/iaas/Content/FreeTier/resourceref.htm
|22 | `Oracle Free は常に無条件で維持` | ⚠️ | 公式FAQでは容量不足/容量制限時の挙動やアカウント状態で制限の可能性を明記 | oracle.com/ba/cloud/free/faq/

## 2. 文章校正（要点）

### 重要度: 高
- 「20GB/2.0/4.0」等の数値断定が多く、出典がないまま断定記載されています。特に**CPUベンチ値・価格・電力・VPS帯域/仕様表は検証不足**。
- `4,000円前後`等の時価情報は、記事内で「調査時点（yyyy/mm）」を明示せず、読者に誤解を与える可能性があります。
- 「Steinberger」「GitHub 10万超」などの人物・評価系は一次情報未確認のまま断定されており、信頼性が低い。

### 要求度: 中
- 「Mac miniは16GB/24GBはメモリ不可」「NAND 1枚問題」などはソース指定が弱いので、**製品ページへのリンクをつけるか、断定表現を『おおよそ』/『一部報告』に調整**する。
- Windows miniPCの価格・`2.5GbE`は機種別仕様で、記事本文のような一括断定は避ける。

### 要求度: 低
- 書式上、同義語の揺れ（クラウドとVPS、VPSとクラウド、Oracle Free/A1など）は統一すると可読性が上がります。

## 3. 構成チェック

### 構成案との乖離
- 指定された構成案ファイルが未提示のため、整合判定は実施不可。

### 抜け漏れ
- 価格調査は**取得日**と**対象販売店**を明記する小節が未掲載。
- 価格・為替前提（`¥35/kWh`等）を独立した注記として示すと再現性が向上。

### 制約の遵守
- 「レビュー」観点では大きな構成崩れはないが、事実の根拠不足箇所が目立つため、ファクト重視の記事としては未達です。

## 4. ストーリー・主張チェック

### 流れと一貫性
- 技術要件 → 4候補比較 → TCO の流れは維持できており、骨格は健全です。
- ただし根拠薄い数値が章ごとに混ざるため、主張の信頼度に一貫性がありません。

### 事実の抜け漏れ・バイアス
- 固定価格・固定性能を示しすぎると、読者が「いつの時点か」を判断できず意思決定が誤る可能性。
- クラウド比較は、価格だけでなく「どのリージョン・帯域・月間転送上限・利用形態」を明確化すべき。

## 5. 改善提案まとめ

### 必須対応（ファクトエラー・重大）
1. OpenClaw要件の修正
   - Node要件: `20`ではなく **Node >= 22**
   - 最小要件: `1 vCPU / 1GB RAM / ~500MB`（推奨1〜2vCPU, 2GB目安）
   - WSL2はWindows運用時の推奨構成として明確化
2. Ryzen 5 7430Uの表記を修正
   - 公式仕様に合わせて **6コア12スレッド・15W** とする。
3. Contabo VPS10のスペック記載訂正
   - `3 vCPU / 8GB RAM / 75GB NVMe` が公式値（場所により追加費用）。
4. Oracle節
   - `4 OCPU, 24GB`、`7日間でアイドル判定リクレーム`等は公式根拠ありで明記。
   - 10TB転送や30日削除等は**出典に応じて条件付き**で追記。

### 推奨対応（品質向上）
1. CPU性能比較表を「ベンチ種類 / サンプル条件」を注釈付きにし、任意採用に変更。
2. 価格表は「筆者調査時点」「販売元」「為替」「税別・送料有無」を必須列にする。
3. 「Steinberger」「10万超」などは、確証ソースが取れるまで**要確認**にし断定を削除。

### 任意対応（更なる改善）
1. 「Linux VPS・Oracle・ミニPC」の章ごとに、選定条件（用途/耐障害性/運用人数）を追加すると意思決定が明確化。
2. 目立つ比較値（TCO）は、式の再現条件（稼働時間・価格ソース）をテーブル化。
