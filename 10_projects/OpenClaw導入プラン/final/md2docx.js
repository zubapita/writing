// md2docx.js — Markdown with images → Word (.docx) converter
// docx v9.x compatible, Word corruption-safe
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} = require("docx");
const fs = require("fs");
const path = require("path");

const BASE_DIR = __dirname;
const MD_PATH = path.join(BASE_DIR, "原稿v3_with_ills.md");
const OUT_PATH = path.join(BASE_DIR, "原稿v3_with_ills.docx");
const IMG_DIR = path.join(BASE_DIR, "images");

// A4 usable width at 25mm margins: 160mm ≈ 453pt ≈ 604px @96dpi
const MAX_WIDTH_PX = 600;

/**
 * Read PNG dimensions from file header (bytes 16-23).
 * Returns {w, h} in pixels.
 */
function pngDimensions(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(24);
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  if (buf[0] !== 0x89 || buf[1] !== 0x50) {
    return { w: 800, h: 600 }; // fallback
  }
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/**
 * Parse markdown into structured elements.
 */
function parseMarkdown(text) {
  const lines = text.split("\n");
  const els = [];
  for (const line of lines) {
    // H1
    if (/^# (?!#)/.test(line)) {
      els.push({ t: "h1", v: line.replace(/^# /, "") });
      continue;
    }
    // H2
    if (/^## /.test(line)) {
      els.push({ t: "h2", v: line.replace(/^## /, "") });
      continue;
    }
    // Image
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (img) {
      els.push({ t: "img", alt: img[1], src: img[2] });
      continue;
    }
    // Italic caption *...*
    const cap = line.match(/^\*([^*]+)\*$/);
    if (cap) {
      els.push({ t: "cap", v: cap[1] });
      continue;
    }
    // Bold line **...**
    const bold = line.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      els.push({ t: "bold", v: bold[1] });
      continue;
    }
    // Blank
    if (line.trim() === "") continue;
    // Paragraph
    els.push({ t: "p", v: line });
  }
  return els;
}

/**
 * Split text by **bold** segments into TextRun array.
 */
function inlineRuns(text, baseOpts) {
  const runs = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ ...baseOpts, text: text.slice(last, m.index) }));
    }
    runs.push(new TextRun({ ...baseOpts, text: m[1], bold: true }));
    last = re.lastIndex;
  }
  if (last < text.length) {
    runs.push(new TextRun({ ...baseOpts, text: text.slice(last) }));
  }
  return runs;
}

async function main() {
  const md = fs.readFileSync(MD_PATH, "utf-8");
  const els = parseMarkdown(md);
  const children = [];

  const FONT = "Yu Gothic";
  const bodyRun = { font: FONT, size: 21 }; // 10.5pt in half-points

  for (const el of els) {
    switch (el.t) {
      case "h1":
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: el.v, bold: true, size: 36, font: FONT }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 200 },
          })
        );
        break;

      case "h2":
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: el.v, bold: true, size: 28, font: FONT }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 160 },
          })
        );
        break;

      case "bold":
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: el.v, bold: true, size: 22, font: FONT }),
            ],
            spacing: { before: 240, after: 80 },
          })
        );
        break;

      case "img": {
        const imgPath = path.resolve(IMG_DIR, path.basename(el.src));
        if (!fs.existsSync(imgPath)) {
          console.warn("SKIP missing image:", imgPath);
          break;
        }
        const imgBuf = fs.readFileSync(imgPath);
        const { w, h } = pngDimensions(imgPath);
        // Scale to fit page width (px values for transformation)
        const scale = Math.min(1, MAX_WIDTH_PX / w);
        const dispW = Math.round(w * scale);
        const dispH = Math.round(h * scale);

        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                type: "png",
                data: imgBuf,
                transformation: { width: dispW, height: dispH },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 60 },
          })
        );
        break;
      }

      case "cap":
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: el.v,
                italics: true,
                size: 18,
                font: FONT,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
          })
        );
        break;

      case "p":
        children.push(
          new Paragraph({
            children: inlineRuns(el.v, bodyRun),
            spacing: { before: 0, after: 120 },
          })
        );
        break;
    }
  }

  const doc = new Document({
    creator: "md2docx",
    description: "OpenClaw専用マシンの選び方",
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4 in twips
            margin: {
              top: 1418,  // 25mm
              right: 1418,
              bottom: 1418,
              left: 1418,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_PATH, buffer);
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`OK: ${OUT_PATH} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
