import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

// .env ファイルからAPIキーを読み込む
function loadEnv() {
  const envPath = join(dirname(new URL(import.meta.url).pathname), '.env');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// 図生成データファイルをパースして各figセクションを抽出
function parseFigSections(content) {
  const sections = [];
  const figPattern = /^## (fig_\d+):\s*(.+)$/gm;
  let match;
  const matches = [];

  while ((match = figPattern.exec(content)) !== null) {
    matches.push({ id: match[1], title: match[2], index: match.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const sectionText = content.slice(start, end);

    // 生成プロンプトを抽出
    const promptMatch = sectionText.match(/### 生成プロンプト\s*\n([\s\S]*?)(?=\n### |$)/);
    const prompt = promptMatch ? promptMatch[1].trim() : '';

    // キャプションを抽出
    const captionMatch = sectionText.match(/### キャプション\s*\n([\s\S]*?)(?=\n---|$)/);
    const caption = captionMatch ? captionMatch[1].trim() : '';

    sections.push({
      id: matches[i].id,
      title: matches[i].title,
      prompt,
      caption,
    });
  }

  return sections;
}

// プロンプト冒頭に日本語強制指示を追加（未追加の場合のみ）
function ensureJapaneseDirective(prompt) {
  const directive = 'ENSURE ALL TEXT RENDERED IN THE IMAGE IS JAPANESE ONLY. NO ENGLISH.';
  if (prompt.includes(directive)) {
    return prompt;
  }
  return directive + '\n\n' + prompt;
}

// レスポンスから画像データとテキストを抽出
function extractResponse(response) {
  let imageData = null;
  let mimeType = null;
  let textParts = [];

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      imageData = part.inlineData.data;
      mimeType = part.inlineData.mimeType || 'image/png';
    }
    if (part.text) {
      textParts.push(part.text);
    }
  }

  return { imageData, mimeType, text: textParts.join('\n') };
}

async function main() {
  loadEnv();

  // APIキーチェック
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('エラー: GEMINI_API_KEY が設定されていません。src/.env を確認してください。');
    process.exit(1);
  }

  // 引数チェック
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('使い方: node src/generate-image.mjs <図生成データファイル>');
    process.exit(1);
  }

  const resolvedPath = resolve(inputPath);
  if (!existsSync(resolvedPath)) {
    console.error(`エラー: ファイルが見つかりません: ${resolvedPath}`);
    process.exit(1);
  }

  // 図生成データファイルを読み込み・パース
  const content = readFileSync(resolvedPath, 'utf-8');
  const sections = parseFigSections(content);

  if (sections.length === 0) {
    console.error('エラー: 図生成データが見つかりません。## fig_nn: 形式のセクションが必要です。');
    process.exit(1);
  }

  console.log(`${sections.length} 件の図を検出しました。\n`);

  // 出力ディレクトリを準備
  const outputDir = join(dirname(resolvedPath), '_images');
  mkdirSync(outputDir, { recursive: true });

  // Gemini APIクライアント初期化
  const ai = new GoogleGenAI({ apiKey });

  let successCount = 0;

  for (const section of sections) {
    const outputPath = join(outputDir, `${section.id}.png`);
    process.stdout.write(`[${section.id}] "${section.title}" 生成中... `);

    const prompt = ensureJapaneseDirective(section.prompt);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
          imageConfig: {
            aspectRatio: '4:3',
          },
        },
      });

      const { imageData, text } = extractResponse(response);

      if (!imageData) {
        console.log('⚠ 画像データなし（スキップ）');
        if (text) {
          console.log(`  モデル応答: ${text.slice(0, 200)}`);
        }
        continue;
      }

      // base64 → バイナリ → ファイル保存
      const buffer = Buffer.from(imageData, 'base64');
      writeFileSync(outputPath, buffer);
      console.log(`✓ 保存: ${outputPath}`);
      successCount++;

      if (text) {
        console.log(`  モデル応答: ${text.slice(0, 300)}`);
      }
    } catch (err) {
      console.log(`✗ エラー: ${err.message}`);
    }

    console.log('');
  }

  console.log(`完了: ${successCount}/${sections.length} 枚生成`);
}

main();
