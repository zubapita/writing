
⏺ APIリクエストの詳細を確認しました。ご指摘の通り、プロンプトではなくAPIパラメータに重要なポイントがあります。

  ---
  API設定の秘訣

  lib/services/providers/gemini-image-provider.ts (行67-83) のリクエストボディ：

  {
    "contents": [{ "parts": [{ "text": prompt }] }],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {
        "aspectRatio": "16:9"
      }
    }
  }

  核心は responseModalities: ["TEXT", "IMAGE"]

  これが ["IMAGE"] だけではなく ["TEXT", "IMAGE"] の両方を指定している点が重要です。

  - ["IMAGE"] のみ →
  モデルはいきなり画像を生成。テキストの言語コンテキストが弱く、デフォルトの中国語フォントが選ばれやすい
  - ["TEXT", "IMAGE"] → モデルはまずテキストで思考してから画像を生成する。日本語のプロンプトに対して日本語コンテキストで
  推論が走るため、日本語フォントが選択されやすい

  実際にレスポンスからもテキスト部分を取得して活用しています（行113-120）：
  const textPart = parts.find((p) => p.text)
  return {
    // ...
    modelText: textPart?.text ?? undefined,
  }

  その他のAPI設定ポイント

  ┌───────────────────┬───────────────────────────────────┬────────────────────────────────────────────────┐
  │       設定        │         PaperSearchでの値         │                     注意点                     │
  ├───────────────────┼───────────────────────────────────┼────────────────────────────────────────────────┤
  │ モデル            │ gemini-3-pro-image-preview        │ 他のモデル（Imagen等）だと日本語の扱いが異なる │
  ├───────────────────┼───────────────────────────────────┼────────────────────────────────────────────────┤
  │ エンドポイント    │ v1beta/models/.../generateContent │ predict エンドポイントではない                 │
  ├───────────────────┼───────────────────────────────────┼────────────────────────────────────────────────┤
  │ systemInstruction │ 未使用                            │ 日本語指示はcontents内のuser promptに直接記載  │
  └───────────────────┴───────────────────────────────────┴────────────────────────────────────────────────┘

  ---
  他システムで試すべきこと

  お使いのシステムで以下を確認してください：

  1. responseModalities に "TEXT" が含まれているか？ ← 最も重要
  2. エンドポイントが generateContent か？（predict ではなく）
  3. モデルが gemini-3-pro-image-preview か？

  特に1が最有力候補です。["TEXT", "IMAGE"] にすることで、モデルが日本語コンテキストで「考えてから描く」ようになります。

  プランファイルを更新します。

⏺ Updated plan
  ⎿  /plan to preview

⏺ User answered Claude's questions:
  ⎿  · 他のシステムでの状況を確認させてください。現在、responseModalitiesはどのように設定していますか？ → Gemini
     CLI ExtentionのNano Banana Proを使用している。

⏺ Gemini CLI ExtensionのNano Banana
  Pro経由での利用ですね。PaperSearchは直接API呼び出しでパラメータを完全制御しているのに対し、Gemini CLI
  Extensionはパラメータが内部で決まっている可能性があります。調べます。

⏺ Searched for 2 patterns, read 1 file (ctrl+o to expand)

⏺ 重要な発見です。PaperSearchとGemini CLI Extension（Nano Banana）ではAPI呼び出しの方法が根本的に違います。

  核心の違い

  ┌────────────────────┬───────────────────────────────────┬─────────────────────────────────────────────────┐
  │                    │            PaperSearch            │             Gemini CLI Nano Banana              │
  ├────────────────────┼───────────────────────────────────┼─────────────────────────────────────────────────┤
  │ 呼び出し方法       │ generateContent APIを直接呼び出し │ /generate コマンド経由（内部実装は不透明）      │
  ├────────────────────┼───────────────────────────────────┼─────────────────────────────────────────────────┤
  │ responseModalities │ ["TEXT", "IMAGE"] を明示指定      │ 拡張機能が内部で決定（おそらく ["IMAGE"] のみ） │
  ├────────────────────┼───────────────────────────────────┼─────────────────────────────────────────────────┤
  │ 制御度             │ 全パラメータを完全制御            │ プロンプトしか制御できない                      │
  └────────────────────┴───────────────────────────────────┴─────────────────────────────────────────────────┘

  PaperSearchが日本語を正しく出せる最大の理由は、responseModalities: ["TEXT", "IMAGE"] を直接指定できていることです。

  Nano Banana Extensionの /generate コマンドは、内部で独自のAPIリクエストを構築しており、responseModalities を ["TEXT",
  "IMAGE"] にしているかどうかはユーザーから制御できません。

  Nano Banana拡張機能のソースを確認して、実際にどのパラメータが送られているか見てみましょう。

⏺ Searched for 3 patterns, read 1 file (ctrl+o to expand)

⏺ 核心となる imageGenerator.js を読みます。

⏺ Read 1 file (ctrl+o to expand)

⏺ 決定的な証拠を見つけました。

  Nano Banana Extensionのソースコード（行190-198）

  const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: [
          {
              role: 'user',
              parts: [{ text: currentPrompt }],
          },
      ],
  });

  generationConfig が一切指定されていません！

  対してPaperSearchのAPI呼び出し：

  body: JSON.stringify({
      contents: [{ parts: [{ text: request.prompt }] }],
      generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],  // ← これが核心
          imageConfig: { aspectRatio },
      },
  })

  違いのまとめ

  ┌────────────────────┬──────────────────────┬─────────────────────────────┐
  │        設定        │     PaperSearch      │    Nano Banana Extension    │
  ├────────────────────┼──────────────────────┼─────────────────────────────┤
  │ generationConfig   │ 明示的に指定         │ 未指定（SDKデフォルト任せ） │
  ├────────────────────┼──────────────────────┼─────────────────────────────┤
  │ responseModalities │ ["TEXT", "IMAGE"]    │ 未指定                      │
  ├────────────────────┼──────────────────────┼─────────────────────────────┤
  │ imageConfig        │ アスペクト比指定     │ 未指定                      │
  ├────────────────────┼──────────────────────┼─────────────────────────────┤
  │ SDK                │ fetch で直接呼び出し │ @google/genai SDK経由       │
  └────────────────────┴──────────────────────┴─────────────────────────────┘

  Nano Banana Extensionは @google/genai SDKの generateContent を呼ぶ際に generationConfig
  を一切渡していません。SDKのデフォルト動作に完全に依存しており、responseModalities: ["TEXT", "IMAGE"]
  という日本語フォント選択に最も重要な設定が欠落しています。

  プランファイルを最終更新します。

⏺ Updated plan
  ⎿  /plan to preview

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Ready to code?

 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 PaperSearch インフォグラフィクス 日本語表示の秘訣 - 調査結果

 調査目的

 PaperSearchのインフォグラフィクスで日本語が正しく表示される理由を特定し、他システム（Gemini CLI Nano Banana
 Extension）で中国語フォントになる原因を解明する。

 根本原因：Nano Banana ExtensionのAPI設定の欠落

 決定的な違い

 PaperSearch (lib/services/providers/gemini-image-provider.ts 行67-83):
 body: JSON.stringify({
     contents: [{ parts: [{ text: request.prompt }] }],
     generationConfig: {
         responseModalities: ["TEXT", "IMAGE"],  // ← 核心
         imageConfig: { aspectRatio },
     },
 })

 Nano Banana Extension (~/.gemini/extensions/nanobanana/mcp-server/dist/imageGenerator.js 行190-198):
 const response = await this.ai.models.generateContent({
     model: this.modelName,
     contents: [{ role: 'user', parts: [{ text: currentPrompt }] }],
     // ← generationConfig が一切ない！
 });

 ┌────────────────────┬────────────────────┬─────────────────────────┐
 │        設定        │    PaperSearch     │       Nano Banana       │
 ├────────────────────┼────────────────────┼─────────────────────────┤
 │ generationConfig   │ 明示指定           │ 未指定                  │
 ├────────────────────┼────────────────────┼─────────────────────────┤
 │ responseModalities │ ["TEXT", "IMAGE"]  │ 未指定（SDKデフォルト） │
 ├────────────────────┼────────────────────┼─────────────────────────┤
 │ imageConfig        │ アスペクト比指定   │ 未指定                  │
 ├────────────────────┼────────────────────┼─────────────────────────┤
 │ SDK                │ fetch 直接呼び出し │ @google/genai SDK経由   │
 └────────────────────┴────────────────────┴─────────────────────────┘

 なぜ responseModalities: ["TEXT", "IMAGE"] が重要か

 - ["TEXT", "IMAGE"] → モデルがまずテキストで推論（日本語コンテキスト）してから画像生成 → 日本語フォント選択
 - 未指定/["IMAGE"]のみ → テキスト推論なしで画像生成 → デフォルトのCJKフォント（中国語寄り）が選ばれる

 修正案

 Nano Banana Extensionの imageGenerator.js にて、generateContent 呼び出しに config パラメータを追加する：

 const response = await this.ai.models.generateContent({
     model: this.modelName,
     contents: [{ role: 'user', parts: [{ text: currentPrompt }] }],
     config: {                                    // ← 追加
         responseModalities: ["TEXT", "IMAGE"],    // ← 追加
     },                                           // ← 追加
 });

 注意: @google/genai SDKでは generationConfig ではなく config
 プロパティ名を使う可能性がある。SDKのバージョンにより異なるため、型定義を確認が必要。

 修正対象ファイル

 ~/.gemini/extensions/nanobanana/mcp-server/dist/imageGenerator.js
 - 行190-198: generateTextToImage メソッド内の generateContent 呼び出し
 - 行336-344: generateStorySequence メソッド内の generateContent 呼び出し
 - 行432-448: editImage メソッド内の generateContent 呼び出し

 ---
 調査結果詳細：4層の防御メカニズム（PaperSearch側）

 Layer 1: プロンプト冒頭の強制指示（最重要）

 ファイル: lib/services/image-generation-service.ts

 画像生成プロンプトの冒頭に以下を必ず挿入：
 ENSURE ALL TEXT RENDERED IN THE IMAGE IS JAPANESE ONLY. NO ENGLISH.

 2段階の保証：
 - suggestPrompt() (行114-129): AIプロンプト生成時にこの制約を含めるよう指示
 - generateImage() (行236-238): 含まれていなければ自動で先頭に追加（フェイルセーフ）

 Layer 2: 具体的な日本語文字列の直接指定

 プロンプト内でラベル・タイトルを英語で記述せず、具体的な日本語をexactly:形式で指定：
 The main title must be exactly: "生成AIのビジネス活用"
 Labels must be: "データ収集", "分析", "実装"

 AIに「翻訳」の余地を与えない。

 加えて generatePromptFromSpec() (行590-623) では：
 日本語のみ、クリーンでモダンなデザイン
 をスタイル指示にも含めて反復強化。

 Layer 3: CSSでの日本語フォント優先指定

 ファイル: app/globals.css

 --font-sans: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", system-ui, sans-serif;
 font-feature-settings: "palt" 1;  /* 日本語プロポーショナル調整 */

 Layer 4: 検証→再生成ループ

 ファイル: app/api/articles/[id]/images/generate/route.ts (行99-187)

 - Gemini VisionとGPTの2系統で生成画像を検証
 - 不正確な日本語があれば日本語フィードバック付きで再生成（最大2回リトライ）
 - 全システムプロンプト（ClaimLedger抽出、InfographicSpec生成、検証）が日本語で統一

 他システムへの応用：核心ポイント（優先順）

 最重要: API設定

 1. responseModalities: ["TEXT", "IMAGE"] を指定する（["IMAGE"]だけにしない）
   - TEXTを含めることで、モデルが日本語コンテキストでテキスト推論してから画像を生成する
   - ["IMAGE"]のみだとデフォルトの中国語フォントが選ばれやすい
 2. generateContent エンドポイントを使う（predictではない）
 3. モデルは gemini-3-pro-image-preview
 4. systemInstruction は使わず、日本語指示はcontents内のuser promptに直接記載

 プロンプト層

 5. プロンプト冒頭に ENSURE ALL TEXT RENDERED IN THE IMAGE IS JAPANESE ONLY. NO ENGLISH.
 6. 画像内テキストは exactly: "日本語文字列" 形式で直接指定

 関連ファイル一覧

 ┌──────────────────────────────────────────────────┬──────────────────────────────────────────────────┐
 │                     ファイル                     │                       役割                       │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ lib/services/image-generation-service.ts         │ 画像生成メイン（プロンプト構築・日本語制約挿入） │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ lib/services/providers/gemini-image-provider.ts  │ Gemini API呼び出し                               │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ lib/services/infographic-spec-service.ts         │ InfographicSpec生成（日本語）                    │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ lib/services/claim-ledger-service.ts             │ ファクト抽出（日本語）                           │
 ├────────────────────────────────────────────
 ──────┼──────────────────────────────────────────────────┤
 │ lib/services/infographic-verification-service.ts │ 画像検証（日本語）                               │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ app/globals.css                                  │ 日本語フォント優先指定                           │
 ├──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
 │ app/api/articles/[id]/images/generate/route.ts   │ 検証→再生成ループ                                │
 └──────────────────────────────────────────────────┴──────────────────────────────────────────────────┘
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
