// Test files for the other suites, and files that are not .docx documents.

import { zip } from '../lib/zip.mjs';
import { BULLETS, cm, esc, p, picture, r, table } from '../lib/ooxml.mjs';
import { enParagraph, enParagraphs, enSentence, rng, zhParagraph } from '../lib/text.mjs';
import { hyperlink, image } from './common.mjs';
import { fontText } from './dx.mjs';

// ---- encodings ----

function reverseTable(label, pairs) {
  const dec = new TextDecoder(label, { fatal: false });
  const map = new Map();
  for (const bytes of pairs) {
    const ch = dec.decode(new Uint8Array(bytes));
    if (ch.length >= 1 && ch !== '�' && !map.has(ch)) map.set(ch, bytes);
  }
  return map;
}

let gbkMap;
let cp1252Map;

/** Encodes text as GBK, the code page of Chinese Windows. */
export function gbk(text) {
  if (!gbkMap) {
    const pairs = [];
    for (let a = 0x81; a <= 0xfe; a++) for (let b = 0x40; b <= 0xfe; b++) if (b !== 0x7f) pairs.push([a, b]);
    gbkMap = reverseTable('gbk', pairs);
  }
  return encodeWith(text, gbkMap, 'GBK');
}

export function cp1252(text) {
  if (!cp1252Map) cp1252Map = reverseTable('windows-1252', Array.from({ length: 128 }, (_, i) => [0x80 + i]));
  return encodeWith(text, cp1252Map, 'Windows-1252');
}

function encodeWith(text, map, name) {
  const out = [];
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code < 0x80) out.push(code);
    else if (map.has(ch)) out.push(...map.get(ch));
    else throw new Error(`${name} cannot encode ${ch}`);
  }
  return Buffer.from(out);
}

const utf8bom = (s) => Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(s, 'utf8')]);

// ---- data files ----

const RECIPIENTS = [
  ['FirstName', 'LastName', 'Company', 'Street', 'City', 'PostalCode', 'Country'],
  ['Robin', 'Example', 'Example Ltd', '1 Sample Street', 'Manchester', 'M1 1AA', 'United Kingdom'],
  ['Sam', 'Sample', 'Sample GmbH', 'Musterweg 2', 'Berlin', '10115', 'Germany'],
  ['Kim', 'Tester', 'Tester Inc.', '3 Test Avenue', 'Toronto', 'M5V 2T6', 'Canada'],
  ['Jordan', 'Demo', 'Demo SARL', '4 rue de l’Essai', 'Lyon', '69001', 'France'],
  ['Casey', 'Placeholder', 'Placeholder LLC', '5 Mock Road, Suite 100', 'Austin', '78701', 'United States'],
];

const ZH_RECIPIENTS = [
  ['姓名', '单位', '地址', '邮编', '电话'],
  ['张三', '示例科技有限公司', '示例市示例区示例路1号', '100000', '010-12345678'],
  ['李四', '样本研究院', '示例市长安街2号（东门）', '200000', '021-87654321'],
  ['王五', '测试大学信息学院', '示例省示例市学府路3号', '300000', '022-11112222'],
  ['赵六', '演示出版社', '示例市“文化”大厦4层', '400000', '023-33334444'],
  ['钱七', '样例律师事务所', '示例市中心路5号，201室', '500000', '024-55556666'],
];

const csv = (rows) => `${rows.map((row) => row.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\r\n')}\r\n`;

/** A one-sheet .xlsx with inline strings, for mail merge. */
function xlsx(rows, sheetName) {
  const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const col = (i) => String.fromCharCode(65 + i);
  const cell = (v, ref) => (/^\d+$/.test(v) && !v.startsWith('0') ? `<c r="${ref}"><v>${v}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`);
  const data = rows.map((row, i) => `<row r="${i + 1}">${row.map((v, j) => cell(v, `${col(j)}${i + 1}`)).join('')}</row>`).join('');
  return zip([
    { name: '[Content_Types].xml', data: `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { name: '_rels/.rels', data: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: 'xl/workbook.xml', data: `${XML}<workbook xmlns="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', data: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: 'xl/styles.xml', data: `${XML}<styleSheet xmlns="${NS}"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>` },
    { name: 'xl/worksheets/sheet1.xml', data: `${XML}<worksheet xmlns="${NS}"><sheetData>${data}</sheetData></worksheet>` },
  ]);
}

/** A package with the parts listed, for the damaged-file cases. */
function brokenDocx(documentXml) {
  const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const entries = [
    { name: '[Content_Types].xml', data: `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>` },
    { name: '_rels/.rels', data: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>` },
  ];
  if (documentXml) entries.push({ name: 'word/document.xml', data: documentXml });
  return zip(entries);
}

// ---- documents for ED, AX ----

/** Twelve misspellings and eight grammar errors; the list is in suites/ed-editing.md. */
const ERRORS_TEXT = [
  'We recieve the files on Monday and seperate them into two folders before the review starts.',
  'The editor definately needs more time to accomodate every change that the reviewers suggest.',
  'Each occurence of the old name must be replaced untill the report is ready, wich takes a day.',
  'Teh team checked the adress list becuase two letters came back last week.',
  'She bought a apple and a orange for the meeting.',
  'The reports was finished yesterday, but the tables is still missing.',
  'Its raining, so their going to work from home today.',
  'We will review the the second chapter tomorrow.',
  'He could of sent the file earlier if the link had worked.',
  'Our tests use WordCraft, GitHub, macOS and PowerShell, which are correct names and should not be flagged.',
  'The lenght of the summary is fine, and the comittee approved it.',
];

export const misc = [
  {
    id: 'ED-18', title: 'Spelling and grammar',
    expect: 'A paragraph with 12 misspellings and 8 grammar errors (listed in ed-editing.md). Product names in the last sentences are spelled correctly.',
    build(doc) {
      for (const s of ERRORS_TEXT) doc.add(p(r(s, { lang: 'en-US' })));
    },
  },
  {
    id: 'AX-DOC', title: 'Accessible document',
    expect: 'Headings in order, two lists, a table with a header row and a caption, a picture with alt text and a link with descriptive text.',
    async build(doc, rand) {
      const bullets = doc.numbering.add(BULLETS);
      const numbers = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
      doc.add(p('Accessibility test document', { style: 'Title' }), p('Introduction', { style: 'Heading1' }), p(enParagraph(rand, 3)));
      doc.add(p('A list', { style: 'Heading2' }), ...Array.from({ length: 3 }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id: bullets } })));
      doc.add(p('Steps', { style: 'Heading2' }), ...Array.from({ length: 3 }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id: numbers } })));
      doc.add(p('A table', { style: 'Heading1' }), table({
        grid: [3008, 3009, 3009], caption: { title: 'Test results by area', description: 'Three areas with the number of cases that passed and failed.' },
        rows: [{ header: true, cells: ['Area', 'Passed', 'Failed'].map((h) => ({ content: p(r(h, { b: true })) })) }, ...[['Text', '12', '1'], ['Tables', '9', '3'], ['Pictures', '7', '2']].map((row) => ({ cells: row.map((c) => ({ content: c })) }))],
      }));
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      doc.add(p('A picture', { style: 'Heading1' }), p(picture(doc, { rId, cx: cm(6), cy: cm(4.5), descr: 'A blue test picture with a large dark letter F and a yellow dot in the top-right corner' })));
      doc.add(p([r('More information is on the '), hyperlink(doc, 'https://github.com/storytold/wordcraft', 'WordCraft project page on GitHub'), r('.')]));
    },
  },
  {
    id: 'AX-DOC-BAD', title: 'Document with accessibility problems',
    expect: 'Problems an accessibility checker should report: a picture without alt text, Heading 1 followed by Heading 3, a table without a header row and with empty rows, light gray text on white, a link that says "click here".',
    async build(doc, rand) {
      const rId = doc.main.image(await image('picture', 'png', { variant: 3 }), 'png');
      doc.add(p('Problems', { style: 'Heading1' }), p('Skipped level', { style: 'Heading3' }), p(enParagraph(rand, 2)));
      doc.add(p(picture(doc, { rId, cx: cm(6), cy: cm(4.5) })));
      doc.add(table({ grid: [3008, 3009, 3009], rows: [['a', 'b', 'c'], ['', '', ''], ['1', '2', '3'], ['', '', '']].map((row) => ({ cells: row.map((c) => ({ content: c })) })) }));
      doc.add(p(r(enParagraph(rand, 2), { color: 'C8C8C8' })), p([r('For details '), hyperlink(doc, 'https://github.com/storytold/wordcraft', 'click here'), r('.')]));
    },
  },

  // ---- files that are not generated documents ----
  {
    id: 'DX-FNT-01', title: 'Text to paste for the Aptos recipe',
    files: () => [{ name: 'DX-FNT-01-text.txt', data: `${fontText().join('\n\n')}\n` }],
  },
  {
    id: 'DX-PKG-01', title: 'Extension and content that do not match',
    files: (ctx) => [
      { name: 'DX-PKG-01-docx-named.doc', data: ctx.built('DX-TXT-01') },
      { name: 'DX-PKG-01-rtf-named.doc', data: rtf('This file is RTF saved with a .doc extension. Word opens it by its content.') },
      { name: 'DX-PKG-01-rtf-named.docx', data: rtf('This file is RTF saved with a .docx extension.') },
    ],
  },
  {
    id: 'DX-FMT-08', title: 'Plain text in different encodings',
    files: () => {
      const zh = '中文：文字处理软件测试。English: plain text. 数字 2026。\r\n第二行：“引号”和（括号）。\r\n';
      const west = 'Café, naïve, résumé — “quoted” and ‘single’ — 50 € — Ångström.\r\nSecond line: ½ × ¾ ± §.\r\n';
      return [
        { name: 'DX-FMT-08-utf8.txt', data: Buffer.from(zh + west, 'utf8') },
        { name: 'DX-FMT-08-utf8-bom.txt', data: utf8bom(zh + west) },
        { name: 'DX-FMT-08-utf16le.txt', data: Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(zh + west, 'utf16le')]) },
        { name: 'DX-FMT-08-gbk.txt', data: gbk(zh) },
        { name: 'DX-FMT-08-cp1252.txt', data: cp1252(west) },
      ];
    },
  },
  {
    id: 'DX-FMT-09', title: 'Markdown and HTML to open',
    files: async () => {
      const rand = rng(909);
      const md = [
        '# Markdown test', '', enParagraph(rand, 2), '', '## A list', '', '- First item', '- Second item with **bold** and *italic*', '  - A nested item', '', '1. One', '2. Two', '',
        '## A table', '', '| Area | Passed | Failed |', '|---|---:|---:|', '| Text | 12 | 1 |', '| Tables | 9 | 3 |', '',
        '## A link and a picture', '', 'See [WordCraft on GitHub](https://github.com/storytold/wordcraft).', '', '![Test picture](DX-FMT-09-picture.png)', '', '> A quotation.', '', '```', 'code block', '```', '',
      ].join('\n');
      const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>HTML test</title></head><body>\n<h1>HTML test</h1>\n<p>${esc(enParagraph(rand, 2))}</p>\n<h2>A list</h2>\n<ul><li>First</li><li>Second with <b>bold</b> and <i>italic</i></li></ul>\n<ol><li>One</li><li>Two</li></ol>\n<h2>A table</h2>\n<table border="1"><tr><th>Area</th><th>Passed</th></tr><tr><td>Text</td><td>12</td></tr><tr><td>Tables</td><td>9</td></tr></table>\n<p><a href="https://github.com/storytold/wordcraft">WordCraft on GitHub</a></p>\n<p><img src="DX-FMT-09-picture.png" alt="Test picture" width="400"></p>\n</body></html>\n`;
      return [
        { name: 'DX-FMT-09.md', data: md },
        { name: 'DX-FMT-09.html', data: html },
        { name: 'DX-FMT-09-picture.png', data: await image('picture', 'png') },
      ];
    },
  },
  {
    id: 'DX-PRD-SRC', title: 'Markdown version of the source document, for pandoc',
    files: () => {
      const rand = rng(808);
      const lines = ['# Quarterly report', '', '## Summary', '', enParagraph(rand), '', 'Revenue grew in every region. The total was 4,210 units.[^1]', '', '[^1]: Units shipped, not orders placed.', '', '### Highlights', ''];
      for (let i = 0; i < 4; i++) lines.push(`- ${enSentence(rand)}`);
      lines.push('', '## Results by region', '', '| Region | Q2 | Q3 | Change |', '|---|---:|---:|---:|', '| North | 900 | 1010 | 12% |', '| South | 1100 | 1240 | 13% |', '| East | 760 | 830 | 9% |', '| West | 1050 | 1130 | 8% |', '', '## Appendix', '');
      for (const para of enParagraphs(rand, 400)) lines.push(para, '');
      return [{ name: 'DX-PRD-SRC.md', data: lines.join('\n') }];
    },
  },
  {
    id: 'ED-15', title: 'Mail merge recipients',
    files: () => [
      { name: 'ED-15-recipients.csv', data: utf8bom(csv(RECIPIENTS)) },
      { name: 'ED-15-recipients.xlsx', data: xlsx(RECIPIENTS, 'Recipients') },
    ],
  },
  {
    id: 'ZH-INP-07', title: '中文邮件合并数据 · Chinese recipients',
    files: () => [
      { name: 'ZH-INP-07-utf8.csv', data: Buffer.from(csv(ZH_RECIPIENTS), 'utf8') },
      { name: 'ZH-INP-07-utf8-bom.csv', data: utf8bom(csv(ZH_RECIPIENTS)) },
      { name: 'ZH-INP-07-gbk.csv', data: gbk(csv(ZH_RECIPIENTS)) },
      { name: 'ZH-INP-07.xlsx', data: xlsx(ZH_RECIPIENTS, '收件人') },
    ],
  },
  {
    id: 'ZH-OUT-03', title: 'GBK 编码的文本 · GBK text',
    files: () => {
      const text = `${[zhParagraph(rng(303)), zhParagraph(rng(304))].join('\r\n')}\r\n`;
      return [{ name: 'ZH-OUT-03-gbk.txt', data: gbk(text) }];
    },
  },
  {
    id: 'ST-BAD', title: 'Damaged and fake files',
    files: async (ctx) => {
      const good = ctx.built('DX-TXT-01');
      const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
      const broken = `${XML}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Unclosed paragraph</w:t></w:r><w:p><w:r><w:t>Second</w:t></w:r></w:p></w:body></w:document>`;
      return [
        { name: 'ST-BAD-01-truncated.docx', data: good.subarray(0, Math.floor(good.length * 0.6)) },
        { name: 'ST-BAD-02-no-document.docx', data: brokenDocx(null) },
        { name: 'ST-BAD-03-bad-xml.docx', data: brokenDocx(broken) },
        { name: 'ST-BAD-04-empty.docx', data: Buffer.alloc(0) },
        { name: 'ST-BAD-04-png-named.docx', data: await image('picture', 'png') },
      ];
    },
  },
];

function rtf(text) {
  return `{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fswiss Arial;}}\\f0\\fs22 ${text.replace(/[\\{}]/g, (c) => `\\${c}`)}\\par\n}\n`;
}

