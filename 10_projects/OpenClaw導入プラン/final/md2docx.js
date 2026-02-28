const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, ImageRun, convertMillimetersToTwip
} = require("docx");
const fs = require("fs");
const path = require("path");
const MD_PATH = path.join(__dirname, "原稿v3_with_ills.md");
const OUT_PATH = path.join(__dirname, "原稿v3_with_ills.docx");
const IMG_DIR = path.join(__dirname, "images");

// A4 body width in mm (210 - 25*2 margins)
const BODY_WIDTH_MM = 160;
// Page body width in points (for scaling images)
const BODY_WIDTH_PX = BODY_WIDTH_MM * 3.78; // ~605px at 96dpi

function getImageDimensions(imgPath) {
  // Read PNG header to get dimensions
  const buf = fs.readFileSync(imgPath);
  let w, h;
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    // PNG: width at offset 16, height at offset 20 (big-endian uint32)
    w = buf.readUInt32BE(16);
    h = buf.readUInt32BE(20);
  } else {
    // fallback
    w = 800;
    h = 600;
  }
  // Scale to fit page width
  const scale = BODY_WIDTH_PX / w;
  return {
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  };
}

function parseMd(mdText) {
  const lines = mdText.split("\n");
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // H1
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      elements.push({ type: "h1", text: line.replace(/^# /, "") });
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push({ type: "h2", text: line.replace(/^## /, "") });
      continue;
    }

    // Image: ![alt](path)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      elements.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      continue;
    }

    // Italic caption: *text*
    const italicMatch = line.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      elements.push({ type: "caption", text: italicMatch[1] });
      continue;
    }

    // Bold subheading: **text**
    const boldMatch = line.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      elements.push({ type: "bold", text: boldMatch[1] });
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Regular paragraph (may contain inline bold)
    elements.push({ type: "paragraph", text: line });
  }

  return elements;
}

function parseInlineFormatting(text) {
  // Split by **bold** segments
  const parts = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    parts.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), bold: false });
  }

  return parts;
}

async function main() {
  const mdText = fs.readFileSync(MD_PATH, "utf-8");
  const elements = parseMd(mdText);

  const children = [];

  for (const el of elements) {
    switch (el.type) {
      case "h1":
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: el.text,
                bold: true,
                size: 36, // 18pt
                font: "Yu Gothic",
              }),
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
              new TextRun({
                text: el.text,
                bold: true,
                size: 28, // 14pt
                font: "Yu Gothic",
              }),
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
              new TextRun({
                text: el.text,
                bold: true,
                size: 22, // 11pt
                font: "Yu Gothic",
              }),
            ],
            spacing: { before: 240, after: 80 },
          })
        );
        break;

      case "image": {
        const imgPath = path.join(IMG_DIR, path.basename(el.src));
        if (!fs.existsSync(imgPath)) {
          console.warn(`Image not found: ${imgPath}`);
          break;
        }
        const dims = getImageDimensions(imgPath);
        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(imgPath),
                transformation: {
                  width: dims.width,
                  height: dims.height,
                },
                altText: {
                  title: el.alt,
                  description: el.alt,
                  name: path.basename(el.src),
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 40 },
          })
        );
        break;
      }

      case "caption":
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: el.text,
                italics: true,
                size: 18, // 9pt
                font: "Yu Gothic",
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
          })
        );
        break;

      case "paragraph": {
        const parts = parseInlineFormatting(el.text);
        children.push(
          new Paragraph({
            children: parts.map(
              (p) =>
                new TextRun({
                  text: p.text,
                  bold: p.bold,
                  size: 21, // 10.5pt
                  font: "Yu Gothic",
                })
            ),
            spacing: { before: 0, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
          })
        );
        break;
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(25),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(25),
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_PATH, buffer);
  console.log(`Generated: ${OUT_PATH}`);
}

main().catch(console.error);
