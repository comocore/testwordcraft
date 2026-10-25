// Large documents for the PF suite (suites/pf-performance.md).
// Page counts are approximate; record the count Word shows.

import { BULLETS, bookmark, cm, fld, p, picture, r, table } from '../lib/ooxml.mjs';
import { enParagraph, enSentence, enTitle, zhParagraph } from '../lib/text.mjs';
import { image, revision, toc } from './common.mjs';
import { zhSetup } from './zh.mjs';

const WORDS_PER_PAGE = 550;

/** Body text with headings, lists and an optional table of contents, about `pages` pages long. */
function longReport(doc, rand, pages, { withToc = false, notes = false } = {}) {
  const bullets = doc.numbering.add(BULLETS);
  doc.sect = { footers: { default: doc.footer(p([r('Page '), fld('PAGE', '1'), r(' of '), fld('NUMPAGES', String(pages))], { style: 'Footer', jc: 'center' })) } };
  const body = [];
  const entries = [];
  let words = 0;
  let chapter = 0;
  while (words < pages * WORDS_PER_PAGE) {
    const page = 2 + Math.floor(words / WORDS_PER_PAGE);
    if (words >= chapter * 25 * WORDS_PER_PAGE) {
      chapter++;
      const anchor = `_Toc${10000 + entries.length}`;
      entries.push({ level: 1, text: `Chapter ${chapter}. ${enTitle(rand)}`, page, anchor });
      body.push(p(bookmark(doc.nextBookmark(), anchor, r(entries.at(-1).text)), { style: 'Heading1', pageBreakBefore: true }));
    } else if (rand() < 0.04) {
      const anchor = `_Toc${10000 + entries.length}`;
      entries.push({ level: 2, text: `${chapter}.${entries.filter((e) => e.level === 2).length + 1} ${enTitle(rand)}`, page, anchor });
      body.push(p(bookmark(doc.nextBookmark(), anchor, r(entries.at(-1).text)), { style: 'Heading2' }));
    }
    const text = enParagraph(rand);
    words += text.split(' ').length;
    body.push(p([r(text), notes && rand() < 0.03 ? doc.footnote(enSentence(rand)) : '']));
    if (rand() < 0.03) {
      for (let k = 0; k < 4; k++) body.push(p(enSentence(rand), { style: 'ListParagraph', numPr: { id: bullets } }));
      words += 60;
    }
  }
  if (withToc) doc.add(p('Contents', { style: 'TOCHeading' }), ...toc(entries.filter((e) => e.level <= 2)));
  doc.add(...body);
}

export const pf = [
  {
    id: 'PF-DOC-100', title: 'About 100 pages of text',
    expect: 'About 100 pages of Arial 11 pt with chapters, subheadings and lists, and a "Page X of Y" footer.',
    build: (doc, rand) => longReport(doc, rand, 100),
  },
  {
    id: 'PF-DOC-500', title: 'About 500 pages with a table of contents',
    expect: 'About 500 pages, thesis-sized: a table of contents, 20 chapters, subheadings, lists and footnotes. The page numbers in the contents are estimates until the table is updated.',
    build: (doc, rand) => longReport(doc, rand, 500, { withToc: true, notes: true }),
  },
  {
    id: 'PF-DOC-1000', title: 'About 1,000 pages of text',
    expect: 'About 1,000 pages of text with chapters and subheadings.',
    build: (doc, rand) => longReport(doc, rand, 1000),
  },
  {
    id: 'PF-DOC-IMG', title: '150 photos',
    expect: 'About 100 pages with 150 photo-like JPEGs (1600 × 1200 pixels, about 300 KB each, shown 12 × 9 cm), each with a caption. The file is about 50 MB.',
    async build(doc, rand) {
      for (let i = 1; i <= 150; i++) {
        const rId = doc.main.image(await image('photo', 'jpeg', { w: 1600, h: 1200, seed: i }), 'jpeg');
        doc.add(p(picture(doc, { rId, cx: cm(12), cy: cm(9), descr: `Photo ${i}` }), { jc: 'center', keepNext: true }), p(`Photo ${i}`, { style: 'Caption', jc: 'center' }));
        if (i % 3 === 0) doc.add(p(enParagraph(rand)));
      }
    },
  },
  {
    id: 'PF-DOC-TABLE', title: 'A 5,000-row table',
    expect: 'One table of 5,000 rows and 6 columns over about 110 pages, with a repeated header row.',
    build(doc, rand) {
      const grid = [900, 1800, 1500, 1500, 1500, 1826];
      const rows = [{ header: true, cells: ['No.', 'Name', 'Region', 'Q1', 'Q2', 'Notes'].map((h) => ({ content: p(r(h, { b: true })), shd: 'D9D9D9' })) }];
      const regions = ['North', 'South', 'East', 'West'];
      for (let i = 1; i <= 5000; i++) {
        rows.push({ cells: [String(i), `Item ${i}`, regions[i % 4], String(Math.floor(rand() * 1000)), String(Math.floor(rand() * 1000)), enSentence(rand).split(' ').slice(0, 4).join(' ')].map((c) => ({ content: c })) });
      }
      doc.add(table({ grid, rows }), p(''));
    },
  },
  {
    id: 'PF-DOC-ZH', title: '约 300 页中文 · About 300 pages of Chinese',
    expect: '约 300 页五号宋体中文，带章标题，Word 中文版默认的页面和行网格。',
    setup: (doc) => zhSetup(doc),
    bannerLabel: '预期',
    build(doc, rand) {
      let chars = 0;
      let chapter = 0;
      while (chars < 300 * 1700) {
        if (chars >= chapter * 30 * 1700) doc.add(p(`第${++chapter}章 ${zhParagraph(rand, 1).slice(0, 10)}`, { style: 'Heading1', pageBreakBefore: chapter > 1 }));
        const text = zhParagraph(rand);
        chars += text.length;
        doc.add(p(text, { ind: { firstLineChars: 200, firstLine: 420 } }));
      }
    },
  },
  {
    id: 'PF-DOC-REVIEW', title: '2,000 tracked changes and 300 comments',
    expect: 'About 30 pages reviewed by two people: 2,000 tracked insertions and deletions and 300 comments. Track Changes is on.',
    build(doc, rand) {
      doc.settings.trackRevisions = true;
      const rv = revision(doc);
      const people = [['Alice', 'A'], ['Bob', 'B']];
      let changes = 0;
      let comments = 0;
      while (changes < 2000) {
        const words = enParagraph(rand).split(' ');
        const runs = [];
        for (let i = 0; i < words.length; i++) {
          const [author, initials] = people[Math.floor(rand() * 2)];
          const date = `2026-10-${String(10 + Math.floor(rand() * 7)).padStart(2, '0')}T12:00:00Z`;
          const word = `${words[i]} `;
          if (changes < 2000 && rand() < 0.12) {
            runs.push(rand() < 0.5 ? rv.ins(author, date, r(word)) : rv.del(author, date, word));
            changes++;
          } else if (comments < 300 && rand() < 0.02) {
            const c = doc.comment({ author, initials, date, text: enSentence(rand) });
            runs.push(c.start, r(word), c.end);
            comments++;
          } else {
            runs.push(r(word));
          }
        }
        doc.add(p(runs));
      }
    },
  },
];
