#!/usr/bin/env node

import {
  Document, Packer, Paragraph, TextRun, ImageRun,
  HeadingLevel, AlignmentType, Header, Footer,
  PageNumber, NumberFormat,
} from 'docx';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('使い方: node md2docx.mjs <markdownファイル>');
  process.exit(1);
}

const mdPath = resolve(inputPath);
const mdDir = dirname(mdPath);
const md = readFileSync(mdPath, 'utf-8');
const lines = md.split('\n');

// Markdown をパースして docx の children 配列を構築
const children = [];

function parseInlineRuns(text) {
  // bold **text** or __text__
  const runs = [];
  const pattern = /\*\*(.+?)\*\*|__(.+?)__/g;
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), font: 'Yu Gothic', size: 22 }));
    }
    runs.push(new TextRun({ text: m[1] || m[2], bold: true, font: 'Yu Gothic', size: 22 }));
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), font: 'Yu Gothic', size: 22 }));
  }
  return runs;
}

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  // 空行 → スキップ
  if (line.trim() === '') {
    i++;
    continue;
  }

  // 画像 ![alt](path)
  const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (imgMatch) {
    const imgRelPath = imgMatch[2];
    const imgAbsPath = join(mdDir, imgRelPath);
    try {
      const imgData = readFileSync(imgAbsPath);
      // 横幅 450pt (EMU: 450 * 9525 = 4286250), 高さはアスペクト比4:3で算出
      const width = 450;
      const height = Math.round(width * 3 / 4);
      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: imgData,
            transformation: { width, height },
            type: 'png',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      }));
    } catch (err) {
      console.warn(`画像読み込みスキップ: ${imgAbsPath} — ${err.message}`);
    }
    i++;
    continue;
  }

  // キャプション行 （キャプション）*...*
  const captionMatch = line.match(/^（キャプション）\*(.+)\*$/);
  if (captionMatch) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: captionMatch[1], italics: true, font: 'Yu Gothic', size: 18, color: '666666' }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }));
    i++;
    continue;
  }

  // h1
  if (line.startsWith('# ') && !line.startsWith('## ')) {
    const text = line.replace(/^# /, '').replace(/\*\*/g, '');
    children.push(new Paragraph({
      children: [new TextRun({ text, font: 'Yu Gothic', size: 32, bold: true })],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 400 },
    }));
    i++;
    continue;
  }

  // h2
  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const text = line.replace(/^## /, '').replace(/\*\*/g, '');
    children.push(new Paragraph({
      children: [new TextRun({ text, font: 'Yu Gothic', size: 28, bold: true })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }));
    i++;
    continue;
  }

  // h3
  if (line.startsWith('### ')) {
    const text = line.replace(/^### /, '').replace(/\*\*/g, '');
    children.push(new Paragraph({
      children: [new TextRun({ text, font: 'Yu Gothic', size: 24, bold: true })],
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 150 },
    }));
    i++;
    continue;
  }

  // 通常の段落
  const runs = parseInlineRuns(line);
  if (runs.length > 0) {
    children.push(new Paragraph({
      children: runs,
      spacing: { after: 200, line: 360 },
    }));
  }

  i++;
}

// ドキュメント作成
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Yu Gothic',
          size: 22,
        },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [new TextRun({ text: 'OpenClawは怖くない', font: 'Yu Gothic', size: 16, color: '999999' })],
          alignment: AlignmentType.RIGHT,
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          children: [
            new TextRun({ children: [PageNumber.CURRENT], font: 'Yu Gothic', size: 16, color: '999999' }),
          ],
          alignment: AlignmentType.CENTER,
        })],
      }),
    },
    children,
  }],
});

const outputPath = mdPath.replace(/\.md$/, '.docx');
const buffer = await Packer.toBuffer(doc);
writeFileSync(outputPath, buffer);
console.log(`✓ 保存: ${outputPath}`);
console.log(`  段落数: ${children.length}`);
