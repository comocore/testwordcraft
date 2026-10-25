// Generated DOCX probes for the DX suite (suites/dx-docx.md).
// Each probe tests one area. Text sizes and positions are chosen so a difference from Word is easy to see.

import {
  BULLETS, PAGE, bookmark, cm, columnBreak, fld, p, pageBreak, picture, r, rx, sectPr, standardStyles, styleDefs,
  stylesXml, table,
} from '../lib/ooxml.mjs';
import { pictureSvg } from '../lib/images.mjs';
import { enParagraph, enParagraphs, enSentence, rng } from '../lib/text.mjs';
import { hyperlink, image, revision, toc, xe } from './common.mjs';

const { pStyle, cStyle } = styleDefs;
const W = 9026; // text width of an A4 page with 2.54 cm margins
const fill = (rand, n, o) => Array.from({ length: n }, () => p(enParagraph(rand), o));
const label = (text) => r(`${text}: `, { b: true });

const OCTAGON = [[6326, 0], [15274, 0], [21600, 6326], [21600, 15274], [15274, 21600], [6326, 21600], [0, 15274], [0, 6326]];

export const dx = [
  // ---- TXT ----
  {
    id: 'DX-TXT-01', title: 'Basic character formatting',
    expect: 'Each line shows the formatting it names. The size line runs from 8 to 28 pt; the highlight line has yellow, bright green and turquoise backgrounds.',
    build(doc) {
      doc.add(
        p(r('Bold text', { b: true })),
        p(r('Italic text', { i: true })),
        p(r('Underlined text', { u: 'single' })),
        p(r('Strikethrough text', { strike: true })),
        p([r('Superscript: E = mc'), r('2', { vertAlign: 'superscript' }), r('    Subscript: H'), r('2', { vertAlign: 'subscript' }), r('O')]),
        p([r('8 pt ', { sz: 8 }), r('11 pt ', { sz: 11 }), r('16 pt ', { sz: 16 }), r('28 pt', { sz: 28 })]),
        p([r('Red ', { color: 'FF0000' }), r('green ', { color: '00B050' }), r('blue', { color: '0070C0' })]),
        p([r('Yellow', { highlight: 'yellow' }), r(' '), r('green', { highlight: 'green' }), r(' '), r('turquoise', { highlight: 'cyan' }), r(' highlight')]),
        p(r('Bold italic underlined red 14 pt', { b: true, i: true, u: 'single', color: 'FF0000', sz: 14 })),
      );
    },
  },
  {
    id: 'DX-TXT-02', title: 'Underline styles',
    expect: 'Eight lines, each underlined in the style it names. The red line has a red underline under black text; on the last line only the words are underlined, not the spaces.',
    build(doc) {
      const styles = [['double', 'Double'], ['thick', 'Thick'], ['dotted', 'Dotted'], ['dash', 'Dashed'], ['dotDash', 'Dot-dash'], ['wave', 'Wavy']];
      for (const [val, name] of styles) doc.add(p(r(`${name} underline under this text`, { u: val })));
      doc.add(p(r('Single red underline under black text', { u: { val: 'single', color: 'FF0000' } })));
      doc.add(p(r('Words only underline under these words', { u: 'words' })));
    },
  },
  {
    id: 'DX-TXT-03', title: 'Caps, small caps and hidden text',
    expect: 'Line 1 in capitals, line 2 in small capitals. With hidden text not shown, line 3 reads "Visible start visible end."; with it shown, a dotted-underlined "[hidden words]" sits in the middle.',
    build(doc) {
      doc.add(
        p(r('all caps applied to lowercase letters', { caps: true })),
        p(r('Small Caps Applied To Mixed Case', { smallCaps: true })),
        p([r('Visible start '), r('[hidden words] ', { vanish: true }), r('visible end.')]),
      );
    },
  },
  {
    id: 'DX-TXT-04', title: 'Character spacing, scale and position',
    expect: 'Each line ends at the same place as in Word. The raised and lowered words sit 3 pt above and below the line; "AVATAR WAVE" is kerned on the second of its two lines only.',
    build(doc) {
      const s = 'The quick brown fox jumps over the lazy dog';
      doc.add(
        p([label('Normal'), r(s)]),
        p([label('Expanded 3 pt'), r(s, { spacing: 60 })]),
        p([label('Condensed 1 pt'), r(s, { spacing: -20 })]),
        p([label('Scale 50%'), r(s, { scale: 50 })]),
        p([label('Scale 150%'), r('The quick brown fox', { scale: 150 })]),
        p([label('Scale 200%'), r('The quick fox', { scale: 200 })]),
        p([label('Position'), r('baseline '), r('raised 3 pt', { position: 6 }), r(' baseline '), r('lowered 3 pt', { position: -6 })]),
        p([label('No kerning'), r('AVATAR WAVE Ty To', { sz: 20 })]),
        p([label('Kerning from 8 pt'), r('AVATAR WAVE Ty To', { sz: 20, kern: 16 })]),
      );
    },
  },
  {
    id: 'DX-TXT-05', title: 'Font effects',
    expect: 'Double strikethrough, outline, shadow, emboss and engrave, one per line.',
    build(doc) {
      doc.add(
        p(r('Double strikethrough text', { dstrike: true })),
        p(r('Outline text', { outline: true, sz: 20 })),
        p(r('Shadow text', { shadow: true, sz: 20 })),
        p(r('Emboss text', { emboss: true, sz: 20, color: 'FFFFFF' })),
        p(r('Engrave text', { imprint: true, sz: 20, color: 'FFFFFF' })),
      );
    },
  },
  {
    id: 'DX-TXT-06', title: 'Character shading and borders',
    expect: 'Gray shading behind the first phrase, a thin box around the second, pale yellow shading behind the third.',
    build(doc) {
      doc.add(
        p([r('Before '), r('gray shading', { shd: 'D9D9D9' }), r(' after.')]),
        p([r('Before '), r('a character border', { bdr: true }), r(' after.')]),
        p([r('Before '), r('pale yellow shading', { shd: 'FFF2CC' }), r(' after.')]),
      );
    },
  },
  {
    id: 'DX-TXT-07', title: 'Special characters',
    expect: '"10 km" never splits across lines; "e-mail" keeps its hyphen together; the optional hyphen in "WordCraft" shows only at a line end; tab, line break, dashes, ellipsis, © ® ™ and two emoji display.',
    build(doc) {
      doc.add(
        p([label('Non-breaking space'), r('10 km')]),
        p([label('Non-breaking hyphen'), r('e'), rx('<w:noBreakHyphen/>'), r('mail')]),
        p([label('Optional hyphen'), r('Word'), rx('<w:softHyphen/>'), r('Craft')]),
        p([label('Tab'), r('before\tafter')]),
        p([label('Line break'), r('first line\nsecond line')]),
        p([label('Dashes'), r('en – dash, em — dash')]),
        p([label('Ellipsis'), r('wait…')]),
        p([label('Symbols'), r('© ® ™ § ¶ ° ± × ÷')]),
        p([label('Emoji'), r('🙂 👍🏽 then a word')]),
      );
      // A narrow paragraph that puts the special characters near line ends.
      const narrow = { ind: { right: 6200 } };
      doc.add(
        p([r('A narrow paragraph with 10 km, e'), rx('<w:noBreakHyphen/>'), r('mail and Word'), rx('<w:softHyphen/>'), r('Craft placed so that they fall near the end of a line in a narrow column of text.')], narrow),
      );
    },
  },
  {
    id: 'DX-TXT-08', title: 'Symbol fonts',
    expect: 'Line 1: α β γ Δ π Σ. Lines 2 and 3: a check mark, a cross, a smiley and a filled circle (Wingdings), typed in line 2 and inserted with Insert › Symbol in line 3.',
    build(doc) {
      const sym = (font, char) => rx(`<w:sym w:font="${font}" w:char="${char}"/>`);
      doc.add(
        p([label('Symbol, typed'), r('a b g D p S', { fonts: 'Symbol' })]),
        p([label('Wingdings, typed'), r('ü û J l', { fonts: 'Wingdings' })]),
        p([label('Wingdings, inserted'), sym('Wingdings', 'F0FC'), r(' '), sym('Wingdings', 'F0FB'), r(' '), sym('Wingdings', 'F04A'), r(' '), sym('Wingdings', 'F06C')]),
      );
    },
  },
  {
    id: 'DX-TXT-09', title: 'Other scripts',
    expect: 'Greek, Cyrillic, Vietnamese, Thai and Devanagari display with correct marks and joined letters. The long Thai paragraph wraps between words, although it has no spaces.',
    build(doc) {
      doc.add(
        p([label('Greek'), r('Καλημέρα σε όλους, αυτό είναι ένα δοκιμαστικό κείμενο.', { lang: 'el-GR' })]),
        p([label('Cyrillic'), r('Это проверочный текст на русском языке для текстового редактора.', { lang: 'ru-RU' })]),
        p([label('Vietnamese'), r('Đây là văn bản tiếng Việt có dấu: Hà Nội, Đà Nẵng, Huế.', { lang: 'vi-VN' })]),
        p([label('Devanagari'), r('यह हिन्दी में एक परीक्षण वाक्य है: क्ष त्र ज्ञ श्र', { lang: 'hi-IN' })]),
        p([label('Thai'), r('ภาษาไทยเขียนต่อกันโดยไม่เว้นวรรคระหว่างคำ'.repeat(6), { lang: 'th-TH' })]),
      );
    },
  },
  {
    id: 'DX-TXT-10', title: 'Right-to-left text',
    expect: 'The Arabic and Hebrew paragraphs run right to left and start at the right margin. "WordCraft", "Word" and the numbers inside them read left to right.',
    build(doc) {
      const ar = { fonts: { cs: 'Arial' }, rtl: true, lang: { val: 'en-US', bidi: 'ar-SA' } };
      const he = { fonts: { cs: 'Arial' }, rtl: true, lang: { val: 'en-US', bidi: 'he-IL' } };
      doc.add(
        p([r('هذا نص عربي يحتوي على الرقم ', ar), r('2026'), r(' وكلمة ', ar), r('WordCraft'), r(' في وسط الجملة.', ar)], { bidi: true }),
        p([r('هذه فقرة ثانية أطول قليلا لكي تمتد على أكثر من سطر واحد في الصفحة، ونرى كيف تنتقل الكلمات إلى السطر التالي.', ar)], { bidi: true }),
        p([r('זהו טקסט בעברית עם המספר ', he), r('42'), r(' והמילה ', he), r('Word'), r(' באמצע.', he)], { bidi: true }),
        p('A left-to-right paragraph after them, for comparison.'),
      );
    },
  },

  // ---- PAR ----
  {
    id: 'DX-PAR-01', title: 'Alignment',
    expect: 'Five paragraphs aligned left, centred, right, justified and distributed. In the distributed paragraph the last line is spread across the full width too.',
    build(doc, rand) {
      for (const [jc, name] of [['left', 'Left'], ['center', 'Centred'], ['right', 'Right'], ['both', 'Justified'], ['distribute', 'Distributed']]) {
        doc.add(p([label(name), r(enParagraph(rand, 3))], { jc }));
      }
    },
  },
  {
    id: 'DX-PAR-02', title: 'Indents',
    expect: 'Paragraph 1 is indented 2.54 cm on both sides; paragraph 2 has a 0.74 cm first-line indent; paragraph 3 hangs 1 cm; paragraph 4 starts 1.27 cm to the left of the margin.',
    build(doc, rand) {
      doc.add(
        p([label('Left and right 2.54 cm'), r(enParagraph(rand, 3))], { ind: { left: 1440, right: 1440 } }),
        p([label('First line 0.74 cm'), r(enParagraph(rand, 3))], { ind: { firstLine: 420 } }),
        p([label('Hanging 1 cm'), r(enParagraph(rand, 3))], { ind: { left: 567, hanging: 567 } }),
        p([label('Negative left −1.27 cm'), r(enParagraph(rand, 3))], { ind: { left: -720 } }),
      );
    },
  },
  {
    id: 'DX-PAR-03', title: 'Line spacing',
    expect: 'Six paragraphs: single, 1.5 lines, double, at least 18 pt, exactly 12 pt with 16 pt text (tops of letters clipped) and multiple 1.15. Each has the same number of lines and the same height as in Word.',
    build(doc, rand) {
      const cases = [
        ['Single', { line: 240, lineRule: 'auto' }],
        ['1.5 lines', { line: 360, lineRule: 'auto' }],
        ['Double', { line: 480, lineRule: 'auto' }],
        ['At least 18 pt', { line: 360, lineRule: 'atLeast' }],
        ['Exactly 12 pt, 16 pt text', { line: 240, lineRule: 'exact' }],
        ['Multiple 1.15', { line: 276, lineRule: 'auto' }],
      ];
      for (const [name, spacing] of cases) {
        const big = name.startsWith('Exactly') ? { sz: 16 } : undefined;
        doc.add(p([label(name), r(enParagraph(rand, 3), big)], { spacing: { after: 240, ...spacing } }));
      }
    },
  },
  {
    id: 'DX-PAR-04', title: 'Space before and after',
    expect: '12 pt before and 6 pt after the first paragraph; the three "Same style" paragraphs have no space between them (contextual spacing); page 2 starts with a paragraph that has 24 pt before it.',
    build(doc, rand) {
      doc.styles = stylesXml({ styles: standardStyles() + pStyle('SameStyle', 'Same Style', { pPr: { spacing: { after: 360 }, contextualSpacing: true }, ui: 20 }) });
      doc.add(p([label('Before 12, after 6'), r(enParagraph(rand, 2))], { spacing: { before: 240, after: 120 } }));
      for (let i = 1; i <= 3; i++) doc.add(p([label(`Same style ${i}`), r(enSentence(rand))], { style: 'SameStyle' }));
      doc.add(p('A paragraph in Normal after them.'));
      doc.add(p([label('Top of page 2, 24 pt before'), r(enParagraph(rand, 2))], { pageBreakBefore: true, spacing: { before: 480 } }));
    },
  },
  {
    id: 'DX-PAR-05', title: 'Tab stops',
    expect: 'Columns line up under the left (2.54 cm), centred (8 cm), decimal (12 cm) and right (16 cm) stops; a bar tab draws a vertical line at 5.3 cm; the contents line has dots, the second dashes and the third an underline leader.',
    build(doc) {
      const tabs = [{ val: 'left', pos: 1440 }, { val: 'bar', pos: 3005 }, { val: 'center', pos: 4535 }, { val: 'decimal', pos: 6803 }, { val: 'right', pos: W }];
      doc.add(p(r('Item\tleft\tcentred\t12.50\tright'), { tabs }));
      doc.add(p(r('Longer item\tx\tcentred text\t1,234.5\tend'), { tabs }));
      doc.add(p(r('A\tb\tc\t0.007\tz'), { tabs }));
      doc.add(p(r('Chapter 1 Introduction\t12'), { tabs: [{ val: 'right', leader: 'dot', pos: W }] }));
      doc.add(p(r('Chapter 2 Method\t27'), { tabs: [{ val: 'right', leader: 'hyphen', pos: W }] }));
      doc.add(p(r('Name\t'), { tabs: [{ val: 'right', leader: 'underscore', pos: 6000 }] }));
    },
  },
  {
    id: 'DX-PAR-06', title: 'Paragraph borders and shading',
    expect: 'Paragraph 1 in a box; paragraph 2 with a line under it; paragraphs 3 and 4 share one box because their borders match; paragraph 5 on blue shading.',
    build(doc, rand) {
      const box = { all: { sz: 6, space: 4, color: '1F3864' } };
      doc.add(
        p(enParagraph(rand, 2), { pBdr: box }),
        p('A heading with a line under it', { pBdr: { bottom: { sz: 12, space: 1, color: '2F5496' } }, spacing: { before: 240 } }),
        p(enParagraph(rand, 2), { pBdr: { ...box, between: { sz: 6, space: 4, color: '1F3864' } } }),
        p(enParagraph(rand, 2), { pBdr: { ...box, between: { sz: 6, space: 4, color: '1F3864' } } }),
        p(enParagraph(rand, 2), { shd: 'D9E2F3' }),
      );
    },
  },
  {
    id: 'DX-PAR-07', title: 'Pagination control', banner: { style: 'Fixed' },
    expect: 'Every line is exactly 12 pt, so a page holds 58 lines. Page 2 starts with the heading "Kept with next"; page 3 starts with "Widow control" (all three lines); page 4 starts with "Kept together"; "No widow control" splits 2 + 1 across pages 4 and 5; page 6 starts with "Page break before".',
    build(doc) {
      const fixed = { style: 'Fixed' };
      doc.styles = stylesXml({ styles: standardStyles() + pStyle('Fixed', 'Fixed Lines', { ui: 20, pPr: { spacing: { before: 0, after: 0, line: 240, lineRule: 'exact' } } }) });
      // A page holds 58 lines of exactly 12 pt; the banner takes two.
      let line = 2;
      const filler = (until) => {
        while (line < until) doc.add(p(r(`Filler line ${++line}`), fixed));
      };
      const block = (lines, o) => {
        doc.add(p(r(lines.join('\n')), { ...fixed, ...o }));
        line += lines.length;
      };
      filler(57);
      block(['Kept with next'], { keepNext: true });
      line = 1;
      block(['Next paragraph after the heading, line 1', 'line 2', 'line 3']);
      filler(56);
      block(['Widow control: line 1', 'line 2', 'line 3']);
      line = 3;
      filler(55);
      block(['Kept together: line 1', 'line 2', 'line 3', 'line 4'], { keepLines: true });
      line = 4;
      filler(56);
      block(['No widow control: line 1', 'line 2', 'line 3'], { widowControl: false });
      line = 1;
      filler(10);
      block(['Page break before'], { pageBreakBefore: true });
    },
  },
  {
    id: 'DX-PAR-08', title: 'Drop caps',
    expect: 'The first paragraph opens with a "T" three lines tall inside the text; the second with an "A" three lines tall in the left margin.',
    build(doc, rand) {
      const cap = (letter, dropCap) =>
        p(r(letter, { sz: 41, position: -8 }), {
          keepNext: true,
          framePr: { dropCap, lines: 3, wrap: 'around', vAnchor: 'text', hAnchor: dropCap === 'margin' ? 'page' : 'text' },
          spacing: { after: 0, line: 827, lineRule: 'exact' },
          textAlignment: 'baseline',
        });
      doc.add(cap('T', 'drop'), p(`he ${enParagraph(rand, 5)}`));
      doc.add(cap('A', 'margin'), p(` ${enParagraph(rand, 5)}`));
    },
  },
  {
    id: 'DX-PAR-09', title: 'Automatic hyphenation',
    expect: 'The narrow paragraph is hyphenated (hyphenation zone 0.63 cm, at most 2 hyphenated lines in a row); the second narrow paragraph turns hyphenation off and has none.',
    build(doc, rand) {
      doc.settings.autoHyphenation = true;
      doc.settings.hyphenationZone = 357;
      doc.settings.consecutiveHyphenLimit = 2;
      const words = Array.from({ length: 6 }, () => enSentence(rand)).join(' ').replace(/\.$/, '');
      const longText = `${words} with ${'internationalization interoperability straightforward characteristically '.repeat(2)}end.`;
      doc.add(
        p(longText, { ind: { right: 5200 }, jc: 'both' }),
        p(longText, { ind: { right: 5200 }, jc: 'both', suppressAutoHyphens: true }),
      );
    },
  },
  {
    id: 'DX-PAR-10', title: 'Text frame',
    expect: 'A bordered frame 5.3 cm wide sits at the right margin; the following paragraphs wrap around its left side.',
    build(doc, rand) {
      doc.add(
        p('This paragraph is inside a text frame, an older layout feature that Word still opens and saves.', {
          framePr: { w: 3000, hSpace: 180, wrap: 'around', vAnchor: 'text', hAnchor: 'margin', xAlign: 'right', y: 1 },
          pBdr: { all: { sz: 6, space: 4, color: '7F7F7F' } },
          shd: 'F2F2F2',
        }),
        ...fill(rand, 3),
      );
    },
  },

  // ---- STY ----
  {
    id: 'DX-STY-01', title: 'Built-in headings and styles',
    expect: 'Title, Subtitle, Heading 1–3, Quote and Intense Quote, each in its style. The Navigation pane lists the three headings.',
    build(doc, rand) {
      doc.add(
        p('Document title', { style: 'Title' }),
        p('A subtitle under the title', { style: 'Subtitle' }),
        p('Heading 1', { style: 'Heading1' }), p(enParagraph(rand, 2)),
        p('Heading 2', { style: 'Heading2' }), p(enParagraph(rand, 2)),
        p('Heading 3', { style: 'Heading3' }), p(enParagraph(rand, 2)),
        p(enSentence(rand), { style: 'Quote' }),
        p(enSentence(rand), { style: 'IntenseQuote' }),
        p(enParagraph(rand, 2)),
      );
    },
  },
  {
    id: 'DX-STY-02', title: 'Custom styles',
    expect: 'Paragraphs in "Report Body" are Georgia 12 pt dark gray; "Product Name" is bold blue small caps; "Callout" is a shaded box. Changing "Report Body" changes all three of its paragraphs.',
    build(doc, rand) {
      doc.styles = stylesXml({
        styles: standardStyles() +
          pStyle('ReportBody', 'Report Body', { next: 'ReportBody', ui: 20, pPr: { spacing: { after: 200, line: 276, lineRule: 'auto' } }, rPr: { fonts: 'Georgia', sz: 12, color: '333333' } }) +
          cStyle('ProductName', 'Product Name', { ui: 21, rPr: { b: true, smallCaps: true, color: '0070C0' } }) +
          pStyle('Callout', 'Callout', { link: 'CalloutChar', ui: 22, pPr: { pBdr: { left: { sz: 24, space: 8, color: '2F5496' } }, shd: 'EDF2F9', ind: { left: 360 } }, rPr: { i: true } }) +
          cStyle('CalloutChar', 'Callout Char', { link: 'Callout', ui: 22, rPr: { i: true } }),
      });
      doc.add(
        p([r('The '), r('WordCraft', { style: 'ProductName' }), r(` editor. ${enParagraph(rand, 3)}`)], { style: 'ReportBody' }),
        p(enParagraph(rand, 3), { style: 'ReportBody' }),
        p(enSentence(rand), { style: 'Callout' }),
        p(enParagraph(rand, 3), { style: 'ReportBody' }),
        p([r('A Normal paragraph with '), r('Callout Char', { style: 'CalloutChar' }), r(' and '), r('Product Name', { style: 'ProductName' }), r(' inside it.')]),
      );
    },
  },
  {
    id: 'DX-STY-03', title: 'Defaults, styles and direct formatting',
    expect: 'The test sentence is Arial 14 pt, gray (from the Normal style), italic (from the "Layered" style) and bold (direct formatting).',
    build(doc) {
      doc.styles = stylesXml({
        styles: standardStyles().replace('<w:name w:val="Normal"/><w:qFormat/>', '<w:name w:val="Normal"/><w:qFormat/><w:rPr><w:color w:val="595959"/></w:rPr>') +
          pStyle('Layered', 'Layered', { ui: 20, rPr: { i: true } }),
      });
      doc.add(p(r('The test sentence: default font, gray from Normal, italic from the style, bold and 14 pt applied directly.', { b: true, sz: 14 }), { style: 'Layered' }));
    },
  },

  // ---- LST ----
  {
    id: 'DX-LST-01', title: 'Bullets',
    expect: "Word's default bullets: a round bullet, an \"o\" and a square on levels 1, 2 and 3.",
    build(doc, rand) {
      const id = doc.numbering.add(BULLETS);
      for (const lvl of [0, 0, 1, 1, 2, 0]) doc.add(p(enSentence(rand), { style: 'ListParagraph', numPr: { id, lvl } }));
    },
  },
  {
    id: 'DX-LST-02', title: 'Numbering',
    expect: 'Lists numbered 1. 2. 3.; a) b) c); i. ii. iii.; a list starting at 5; a second list restarting at 1; a list that continues at 4 after an ordinary paragraph.',
    build(doc, rand) {
      const item = (id, n = 3) => Array.from({ length: n }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id } }));
      const dec = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
      const alpha = doc.numbering.add([{ fmt: 'lowerLetter', text: '%1)' }]);
      const roman = doc.numbering.add([{ fmt: 'lowerRoman', text: '%1.', jc: 'right', hanging: 180 }]);
      const five = doc.numbering.add([{ fmt: 'decimal', text: '%1.', start: 5 }]);
      const restarted = doc.numbering.instance(doc.numbering.abstractOf(dec), 1);
      const continued = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
      doc.add(p('Decimal:'), item(dec), p('Letters:'), item(alpha), p('Roman:'), item(roman), p('Starting at 5:'), item(five));
      doc.add(p('Restarted at 1 (same list definition as the first):'), item(restarted));
      doc.add(p('Continued:'), item(continued), p('An ordinary paragraph between the items.'), item(continued));
    },
  },
  {
    id: 'DX-LST-03', title: 'Multilevel numbering linked to headings',
    expect: 'Headings numbered 1, 1.1, 1.1.1, 1.2, 2, 2.1.',
    build(doc, rand) {
      const id = doc.numbering.add([
        { fmt: 'decimal', text: '%1', pStyle: 'Heading1', left: 432, hanging: 432 },
        { fmt: 'decimal', text: '%1.%2', pStyle: 'Heading2', left: 576, hanging: 576 },
        { fmt: 'decimal', text: '%1.%2.%3', pStyle: 'Heading3', left: 720, hanging: 720 },
      ], { multi: 'multilevel' });
      doc.styles = stylesXml({ styles: standardStyles({ headingNum: id }) });
      for (const [lvl, text] of [[1, 'Introduction'], [2, 'Background'], [3, 'Earlier work'], [2, 'Scope'], [1, 'Method'], [2, 'Test files']]) {
        doc.add(p(text, { style: `Heading${lvl}` }), p(enParagraph(rand, 2)));
      }
    },
  },
  {
    id: 'DX-LST-04', title: 'Number alignment and the space after it',
    expect: 'List 1 has a tab after each number, list 2 a space and list 3 nothing; list 4 numbers are right-aligned so 9. and 10. line up on the dot.',
    build(doc, rand) {
      const make = (o) => doc.numbering.add([{ fmt: 'decimal', text: '%1.', ...o }]);
      const lists = [['Tab after the number', make({})], ['Space after the number', make({ suff: 'space' })], ['Nothing after the number', make({ suff: 'nothing' })]];
      for (const [name, id] of lists) doc.add(p(`${name}:`), ...Array.from({ length: 3 }, () => p(enSentence(rand), { numPr: { id } })));
      const right = make({ jc: 'right', start: 8, hanging: 220 });
      doc.add(p('Right-aligned numbers from 8:'), ...Array.from({ length: 4 }, () => p(enSentence(rand), { numPr: { id: right } })));
    },
  },
  {
    id: 'DX-LST-05', title: 'Special number formats',
    expect: 'Legal numbering shows "1.1" under "I."; ordinal words read First, Second, Third; prefixes read "Article 1" and "Step 1:"; the numbers in the last list are red and bold while the text is not.',
    build(doc, rand) {
      const legal = doc.numbering.add([{ fmt: 'upperRoman', text: '%1.' }, { fmt: 'decimal', text: '%1.%2', isLgl: true }], { multi: 'multilevel' });
      const ordinal = doc.numbering.add([{ fmt: 'ordinalText', text: '%1:', hanging: 1080, left: 1440 }]);
      const article = doc.numbering.add([{ fmt: 'decimal', text: 'Article %1', hanging: 1080, left: 1440 }]);
      const step = doc.numbering.add([{ fmt: 'decimal', text: 'Step %1:', hanging: 720, left: 1080 }]);
      const red = doc.numbering.add([{ fmt: 'decimal', text: '%1.', rPr: { b: true, color: 'C00000' } }]);
      const items = (id, lvls) => lvls.map((lvl) => p(enSentence(rand), { numPr: { id, lvl } }));
      doc.add(...items(legal, [0, 1, 1, 0, 1]), ...items(ordinal, [0, 0, 0]), ...items(article, [0, 0]), ...items(step, [0, 0, 0]), ...items(red, [0, 0]));
    },
  },
  {
    id: 'DX-LST-06', title: 'Numbering across a table and a section break',
    expect: 'One list numbered 1 to 6: items 1–2, a table, items 3–4, a continuous section break, items 5–6.',
    build(doc, rand) {
      const id = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
      const items = (n) => Array.from({ length: n }, () => p(enSentence(rand), { numPr: { id } }));
      doc.add(...items(2));
      doc.add(table({ grid: [4513, 4513], rows: [{ cells: [{ content: 'A table' }, { content: 'between the items' }] }] }));
      doc.add(...items(1), p(enSentence(rand), { numPr: { id }, sectPr: sectPr({}) }));
      doc.sect = { type: 'continuous' };
      doc.add(...items(2));
    },
  },

  // ---- TBL ----
  {
    id: 'DX-TBL-01', title: 'Basic table',
    expect: 'A 4-column, 5-row table with single borders and fixed column widths of 2, 3, 5 and 5.92 cm. The first row is bold.',
    build(doc) {
      const grid = [1134, 1701, 2835, 3356];
      const rows = [['No.', 'Name', 'Description', 'Notes']].concat(Array.from({ length: 4 }, (_, i) => [`${i + 1}`, `Item ${i + 1}`, 'A short description', 'Notes about this row']));
      doc.add(table({ grid, layout: 'fixed', width: { w: W, type: 'dxa' }, rows: rows.map((cells, i) => ({ cells: cells.map((c) => ({ content: i === 0 ? p(r(c, { b: true })) : c })) })) }));
      doc.add(p(''));
    },
  },
  {
    id: 'DX-TBL-02', title: 'Merged cells',
    expect: 'Row 1: "Group A" spans columns 2–3 and "Group B" columns 4–5. Column 1: "Region" spans rows 1–2 and "North" rows 3–5. A shaded 2 × 2 block "Merged block" covers rows 4–5, columns 2–3.',
    build(doc) {
      const grid = [1805, 1805, 1805, 1805, 1806];
      doc.add(table({
        grid,
        rows: [
          { cells: [{ content: 'Region', vMerge: 'restart', vAlign: 'center' }, { content: 'Group A', span: 2 }, { content: 'Group B', span: 2 }] },
          { cells: [{ vMerge: 'continue' }, { content: 'A1' }, { content: 'A2' }, { content: 'B1' }, { content: 'B2' }] },
          { cells: [{ content: 'North', vMerge: 'restart', vAlign: 'center' }, { content: '10' }, { content: '20' }, { content: '30' }, { content: '40' }] },
          { cells: [{ vMerge: 'continue' }, { content: 'Merged block', span: 2, vMerge: 'restart', shd: 'FFF2CC', vAlign: 'center' }, { content: '31' }, { content: '41' }] },
          { cells: [{ vMerge: 'continue' }, { span: 2, vMerge: 'continue', shd: 'FFF2CC' }, { content: '32' }, { content: '42' }] },
        ].map((row) => ({ cells: row.cells.map((c) => ({ ...c, vMerge: c.vMerge === 'continue' ? true : c.vMerge })) })),
      }));
      doc.add(p(''));
    },
  },
  {
    id: 'DX-TBL-03', title: 'Table across pages',
    expect: 'A 60-row table over three pages. The gray header row repeats at the top of every page. Row 20 has a long cell that may break across a page; row 40 (exactly 1.06 cm) and row 41 (at least 0.71 cm) keep their heights; row 50 does not break across pages.',
    build(doc, rand) {
      const grid = [1200, 3913, 3913];
      const rows = [{ header: true, cells: ['Row', 'Column A', 'Column B'].map((c) => ({ content: p(r(c, { b: true })), shd: 'D9D9D9' })) }];
      for (let i = 1; i <= 60; i++) {
        const long = i === 20 || i === 50 ? enParagraph(rand, 8) : enSentence(rand);
        rows.push({
          cantSplit: i === 50,
          height: i === 40 ? { val: 600, rule: 'exact' } : i === 41 ? { val: 400, rule: 'atLeast' } : undefined,
          cells: [{ content: String(i) }, { content: long }, { content: i === 40 ? 'Exactly 1.06 cm' : i === 41 ? 'At least 0.71 cm' : i === 50 ? "Can't split" : '' }],
        });
      }
      doc.add(table({ grid, rows }), p(''));
    },
  },
  {
    id: 'DX-TBL-04', title: 'Cell formatting',
    expect: 'In the tall row the three cells are aligned top, centre and bottom; the next row has text reading bottom-to-top and top-to-bottom; the cell with 0.5 cm margins has visible padding; the no-wrap cell does not wrap.',
    build(doc, rand) {
      const grid = [3008, 3009, 3009];
      doc.add(table({
        grid,
        rows: [
          { height: { val: 1400, rule: 'atLeast' }, cells: [{ content: 'Top', vAlign: 'top' }, { content: 'Centre', vAlign: 'center' }, { content: 'Bottom', vAlign: 'bottom' }] },
          { height: { val: 1600, rule: 'atLeast' }, cells: [{ content: 'Bottom to top', textDirection: 'btLr' }, { content: 'Top to bottom', textDirection: 'tbRl' }, { content: 'Normal' }] },
          { cells: [{ content: enSentence(rand), mar: { top: 284, left: 284, bottom: 284, right: 284 } }, { content: 'No wrap: this cell keeps its text on one line', noWrap: true }, { content: enSentence(rand) }] },
        ],
      }), p(''));
    },
  },
  {
    id: 'DX-TBL-05', title: 'Column widths and AutoFit',
    expect: 'Table 1 has fixed equal columns; table 2 fits its contents (narrow first column); table 3 fills the page width (100%); in table 4 the first column takes 20% and the others share the rest.',
    build(doc, rand) {
      const rows = () => [0, 1, 2].map((i) => ({ cells: [{ content: `${i + 1}` }, { content: enSentence(rand) }, { content: 'Short' }] }));
      doc.add(p('Fixed column widths:'), table({ grid: [3008, 3009, 3009], layout: 'fixed', width: { w: W, type: 'dxa' }, rows: rows() }));
      doc.add(p('AutoFit to contents:'), table({ grid: [400, 5000, 900], rows: rows().map((row) => ({ cells: row.cells.map((c) => ({ ...c, w: 0, wType: 'auto' })) })) }));
      doc.add(p('AutoFit to window (100%):'), table({ grid: [3008, 3009, 3009], width: { w: 5000, type: 'pct' }, rows: rows().map((row) => ({ cells: row.cells.map((c) => ({ ...c, w: 1667, wType: 'pct' })) })) }));
      doc.add(p('Preferred widths in percent (20 / 40 / 40):'), table({ grid: [1805, 3610, 3611], width: { w: 5000, type: 'pct' }, rows: rows().map((row) => ({ cells: row.cells.map((c, i) => ({ ...c, w: i === 0 ? 1000 : 2000, wType: 'pct' })) })) }));
      doc.add(p(''));
    },
  },
  {
    id: 'DX-TBL-06', title: 'Nested tables',
    expect: 'The outer 2 × 2 table has a 2 × 2 table in its top-right cell, which has another 2 × 2 table in its bottom-right cell.',
    build(doc) {
      const inner2 = table({ grid: [1000, 1000], rows: [{ cells: [{ content: 'c1' }, { content: 'c2' }] }, { cells: [{ content: 'c3' }, { content: 'c4' }] }] });
      const inner1 = table({ grid: [1900, 2200], rows: [{ cells: [{ content: 'b1' }, { content: 'b2' }] }, { cells: [{ content: 'b3' }, { content: inner2 }] }] });
      doc.add(table({ grid: [4513, 4513], rows: [{ cells: [{ content: 'Outer a1' }, { content: inner1 }] }, { cells: [{ content: 'Outer a3' }, { content: 'Outer a4' }] }] }), p(''));
    },
  },
  {
    id: 'DX-TBL-07', title: 'Table with text wrapping',
    expect: 'A small table floats at the right margin and the paragraphs wrap around it on the left.',
    build(doc, rand) {
      doc.add(table({
        grid: [1500, 1500],
        tblpPr: { leftFromText: 180, rightFromText: 180, vertAnchor: 'text', horzAnchor: 'margin', tblpXSpec: 'right', tblpY: 1 },
        rows: [{ cells: [{ content: 'Floating', shd: 'DEEAF6' }, { content: 'table' }] }, { cells: [{ content: '1' }, { content: '2' }] }, { cells: [{ content: '3' }, { content: '4' }] }],
      }));
      doc.add(...fill(rand, 4));
    },
  },
  {
    id: 'DX-TBL-08', title: 'Table formulas',
    expect: 'The Total row shows 60, 150 and 210 (=SUM(ABOVE)); the Average column shows 15.00, 25.00 and 35.00 (=AVERAGE(LEFT)).',
    build(doc) {
      const grid = [2256, 2256, 2257, 2257];
      const data = [[10, 20], [20, 30], [30, 40]];
      const rows = [{ cells: ['', 'Q1', 'Q2', 'Average'].map((c) => ({ content: p(r(c, { b: true })) })) }];
      data.forEach(([a, b], i) => rows.push({ cells: [{ content: `Row ${i + 1}` }, { content: String(a) }, { content: String(b) }, { content: p(fld('=AVERAGE(LEFT) \\# "0.00"', ((a + b) / 2).toFixed(2))) }] }));
      rows.push({ cells: [{ content: p(r('Total', { b: true })) }, { content: p(fld('=SUM(ABOVE)', '60')) }, { content: p(fld('=SUM(ABOVE)', '90')) }, { content: p(fld('=SUM(ABOVE)', '75.00')) }] });
      doc.add(table({ grid, rows }), p(''));
    },
  },
  {
    id: 'DX-TBL-09', title: 'Diagonal header and shading',
    expect: 'The top-left cell has a diagonal line from top left to bottom right, "Item" at top right and "Year" at bottom left. Thick outer border, thin inner lines, a shaded header row and a shaded first column.',
    build(doc) {
      const grid = [2000, 1756, 1756, 1757, 1757];
      const thick = { sz: 18 };
      const rows = [{
        height: { val: 700, rule: 'atLeast' },
        cells: [{ content: [p('Item', { jc: 'right', spacing: { after: 0 } }), p('Year', { spacing: { after: 0 } })].join(''), borders: { tl2br: { sz: 4 } }, shd: 'D9E2F3' },
          ...['North', 'South', 'East', 'West'].map((c) => ({ content: p(r(c, { b: true }), { jc: 'center' }), shd: 'D9E2F3' }))],
      }];
      for (const y of ['2024', '2025', '2026']) rows.push({ cells: [{ content: y, shd: 'F2F2F2' }, ...[1, 2, 3, 4].map((n) => ({ content: p(String(n * Number(y.slice(2))), { jc: 'center' }) }))] });
      doc.add(table({ grid, borders: { top: thick, left: thick, bottom: thick, right: thick, insideH: { sz: 4 }, insideV: { sz: 4 } }, rows }), p(''));
    },
  },
  {
    id: 'DX-TBL-10', title: 'Right-to-left table',
    expect: 'The first column is on the right. Headers read right to left: "الاسم" (name) on the right, "المدينة" (city) on the left.',
    build(doc) {
      const ar = { rtl: true, fonts: { cs: 'Arial' }, lang: { val: 'en-US', bidi: 'ar-SA' } };
      const cell = (text) => ({ content: p(r(text, ar), { bidi: true }) });
      doc.add(table({ grid: [3008, 3009, 3009], bidi: true, rows: [
        { cells: [cell('الاسم'), cell('العمر'), cell('المدينة')] },
        { cells: [cell('أحمد'), { content: '34' }, cell('القاهرة')] },
        { cells: [cell('سارة'), { content: '28' }, cell('عمّان')] },
      ] }), p(''));
    },
  },
  {
    id: 'DX-TBL-11', title: 'Wide table on a landscape page',
    expect: 'Page 1 portrait, page 2 landscape with a 12-column table that fits the width, page 3 portrait again.',
    build(doc, rand) {
      doc.add(p(enParagraph(rand, 3)), p('The next page is landscape.', { sectPr: sectPr({}) }));
      const grid = Array.from({ length: 12 }, () => 1163);
      const rows = [{ header: true, cells: grid.map((_, i) => ({ content: p(r(`Col ${i + 1}`, { b: true, sz: 9 })), shd: 'D9D9D9' })) }];
      for (let i = 0; i < 8; i++) rows.push({ cells: grid.map((_, j) => ({ content: p(r(String((i + 1) * (j + 3)), { sz: 9 })) })) });
      doc.add(table({ grid, rows }), p('Back to portrait on the next page.', { sectPr: sectPr({ page: PAGE.A4L, type: 'nextPage' }) }));
      doc.sect = { type: 'nextPage' };
      doc.add(p(enParagraph(rand, 3)));
    },
  },
  {
    id: 'DX-TBL-12', title: 'Lists, pictures, notes and links in cells',
    expect: 'Cell 1 holds a numbered list 1–3; cell 2 a picture; cell 3 text with footnote 1; cell 4 a link to github.com/storytold/wordcraft.',
    async build(doc) {
      const id = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
      const pic = picture(doc, { rId: doc.main.image(await image('picture', 'png'), 'png'), cx: cm(3.6), cy: cm(2.7), descr: 'Test picture' });
      const list = ['First', 'Second', 'Third'].map((t) => p(t, { numPr: { id } })).join('');
      doc.add(table({ grid: [4513, 4513], rows: [
        { cells: [{ content: list }, { content: p(pic) }] },
        { cells: [{ content: p([r('Text with a footnote'), doc.footnote('The footnote of a table cell.')]) }, { content: p(hyperlink(doc, 'https://github.com/storytold/wordcraft', 'WordCraft on GitHub')) }] },
      ] }), p(''));
    },
  },

  // ---- SEC ----
  {
    id: 'DX-SEC-01', title: 'Paper size and orientation',
    expect: 'Page 1 is A4 portrait (21 × 29.7 cm), page 2 Letter portrait (21.59 × 27.94 cm), page 3 A4 landscape.',
    build(doc) {
      doc.add(p('This section is A4 portrait, 210 × 297 mm.', { sectPr: sectPr({}) }));
      doc.add(p('This section is US Letter portrait, 8.5 × 11 in.', { sectPr: sectPr({ page: PAGE.LETTER, type: 'nextPage', margins: { left: 1440, right: 1440 } }) }));
      doc.sect = { page: PAGE.A4L, type: 'nextPage' };
      doc.add(p('This section is A4 landscape, 297 × 210 mm.'));
    },
  },
  {
    id: 'DX-SEC-02', title: 'Margins, gutter and mirror margins',
    expect: 'Mirror margins: on odd pages the 5.08 cm inside margin is on the left, on even pages on the right. From page 3, section 2 adds a 1 cm gutter on the inside.',
    build(doc, rand) {
      doc.settings.mirrorMargins = true;
      const m1 = { top: 720, bottom: 720, left: 2880, right: 720 };
      doc.add(...fill(rand, 14), p(enParagraph(rand), { sectPr: sectPr({ margins: m1 }) }));
      doc.sect = { type: 'nextPage', margins: { ...m1, gutter: 567 } };
      doc.add(...fill(rand, 14));
    },
  },
  {
    id: 'DX-SEC-03', title: 'Section breaks',
    expect: 'Sections 1 and 2 (continuous) on page 1; section 3 (odd page) on page 3, with page 2 blank; section 4 (even page) on page 4; section 5 (next page) on page 5.',
    build(doc) {
      const end = (text, type) => p(text, { sectPr: sectPr({ type }) });
      doc.add(end('Section 1 ends here.', undefined));
      doc.add(end('Section 2 starts on the same page (continuous break) and ends here.', 'continuous'));
      doc.add(end('Section 3 starts on the next odd page.', 'oddPage'));
      doc.add(end('Section 4 starts on the next even page.', 'evenPage'));
      doc.sect = { type: 'nextPage' };
      doc.add(p('Section 5 starts on the next page.'));
    },
  },
  {
    id: 'DX-SEC-04', title: 'Columns',
    expect: 'One line in one column, then a section with two equal columns and a line between them, balanced at its end; then three columns 3.5, 5.3 and 5.7 cm wide, with a column break after the first paragraph; then one column again.',
    build(doc, rand) {
      doc.add(p('One column before the columns.', { sectPr: sectPr({}) }));
      doc.add(...fill(rand, 3), p(enParagraph(rand), { sectPr: sectPr({ type: 'continuous', cols: '<w:cols w:num="2" w:sep="1" w:space="708"/>' }) }));
      doc.add(p([r(enParagraph(rand)), columnBreak()]), ...fill(rand, 3));
      doc.add(p(enParagraph(rand), { sectPr: sectPr({ type: 'continuous', cols: '<w:cols w:num="3" w:space="400" w:equalWidth="0"><w:col w:w="2000" w:space="400"/><w:col w:w="3000" w:space="400"/><w:col w:w="3226"/></w:cols>' }) }));
      doc.sect = { type: 'continuous' };
      doc.add(p('One column after the columns.'));
    },
  },
  {
    id: 'DX-SEC-05', title: 'Page borders and page colour',
    expect: 'The pages have a pale yellow page colour. Page 1 has a blue box 24 pt from the page edge; page 2 a red double box close to the text.',
    build(doc, rand) {
      doc.background = 'FFF2CC';
      doc.settings.displayBackgroundShape = true;
      const side = (b) => ['top', 'left', 'bottom', 'right'].map((s) => `<w:${s} w:val="${b.val}" w:sz="${b.sz}" w:space="${b.space}" w:color="${b.color}"/>`).join('');
      doc.add(...fill(rand, 5), p(enParagraph(rand), { sectPr: sectPr({ pgBorders: `<w:pgBorders w:offsetFrom="page">${side({ val: 'single', sz: 12, space: 24, color: '2F5496' })}</w:pgBorders>` }) }));
      doc.sect = { type: 'nextPage', pgBorders: `<w:pgBorders>${side({ val: 'double', sz: 6, space: 4, color: 'C00000' })}</w:pgBorders>` };
      doc.add(...fill(rand, 5));
    },
  },
  {
    id: 'DX-SEC-06', title: 'Line numbers',
    expect: 'Every fifth line is numbered in the left margin (5, 10, 15…), restarting on each page. The boxed paragraph is skipped.',
    build(doc, rand) {
      doc.sect = { lnNumType: { countBy: 5, distance: 360, restart: 'newPage' } };
      doc.add(...fill(rand, 8), p(enParagraph(rand), { suppressLineNumbers: true, pBdr: { all: { sz: 4, space: 4 } } }), ...fill(rand, 14));
    },
  },
  {
    id: 'DX-SEC-07', title: 'Vertical alignment',
    expect: 'Page 1 (a cover) is centred vertically; page 2 is justified vertically, its paragraphs spread from top to bottom; page 3 starts at the top.',
    build(doc, rand) {
      doc.add(p('Cover page', { style: 'Title', jc: 'center' }), p('Centred vertically on the page', { jc: 'center', sectPr: sectPr({ vAlign: 'center' }) }));
      doc.add(...fill(rand, 3), p(enParagraph(rand), { sectPr: sectPr({ vAlign: 'both', type: 'nextPage' }) }));
      doc.sect = { type: 'nextPage' };
      doc.add(...fill(rand, 2));
    },
  },
  {
    id: 'DX-SEC-08', title: 'Book fold',
    expect: 'Word shows half-sheet pages for book-fold printing. WordCraft may not lay it out (the developers list it as missing); check that the setting survives a save.',
    build(doc, rand) {
      doc.settings.mirrorMargins = true;
      doc.settings.bookFoldPrinting = true;
      doc.sect = { page: PAGE.A4L };
      doc.add(...fill(rand, 18));
    },
  },

  // ---- HF ----
  {
    id: 'DX-HF-01', title: 'Header, footer and page numbers',
    expect: 'Every page has the header "GetWordCraft test corpus · DX-HF-01" and a centred footer "Page X of 3".',
    build(doc, rand) {
      const h = doc.header(p('GetWordCraft test corpus · DX-HF-01', { style: 'Header' }));
      const f = doc.footer(p([r('Page '), fld('PAGE', '1'), r(' of '), fld('NUMPAGES', '3')], { style: 'Footer', jc: 'center' }));
      doc.sect = { headers: { default: h }, footers: { default: f } };
      doc.add(...fill(rand, 28));
    },
  },
  {
    id: 'DX-HF-02', title: 'Different first page and odd and even pages',
    expect: 'Page 1 has no header and no page number. Odd pages: header "Odd page" and the number on the right. Even pages: header "Even page" and the number on the left.',
    build(doc, rand) {
      doc.settings.evenAndOddHeaders = true;
      const num = (jc) => p(fld('PAGE', '2'), { style: 'Footer', jc });
      doc.sect = {
        titlePg: true,
        headers: { first: doc.header(p('', { style: 'Header' })), default: doc.header(p('Odd page', { style: 'Header', jc: 'right' })), even: doc.header(p('Even page', { style: 'Header' })) },
        footers: { first: doc.footer(p('', { style: 'Footer' })), default: doc.footer(num('right')), even: doc.footer(num('left')) },
      };
      doc.add(...fill(rand, 36));
    },
  },
  {
    id: 'DX-HF-03', title: 'Headers and page numbers per section',
    expect: 'Section 1 (pages i–ii) numbered in lowercase Roman with header "Front matter". Section 2 restarts at 1 with header "Section 2". Section 3 has its own header "Section 3" and continues the numbering.',
    build(doc, rand) {
      const footer = doc.footer(p(fld('PAGE', '1'), { style: 'Footer', jc: 'center' }));
      const sec = (header, extra) => sectPr({ headers: { default: doc.header(p(header, { style: 'Header' })) }, footers: { default: footer }, ...extra });
      doc.add(...fill(rand, 12), p(enParagraph(rand), { sectPr: sec('Front matter', { pgNumType: { fmt: 'lowerRoman', start: 1 } }) }));
      doc.add(...fill(rand, 12), p(enParagraph(rand), { sectPr: sec('Section 2', { type: 'nextPage', pgNumType: { start: 1 } }) }));
      doc.sect = { headers: { default: doc.header(p('Section 3', { style: 'Header' })) }, footers: { default: footer }, type: 'nextPage' };
      doc.add(...fill(rand, 8));
    },
  },
  {
    id: 'DX-HF-04', title: 'Picture and table in the header',
    expect: 'The header has a green logo (3 × 1 cm) on the left and, under it, a two-column table "Report" / "October 2026".',
    async build(doc, rand) {
      const logo = await image('logo', 'png');
      const h = doc.header((part) => [
        p(picture(doc, { rId: part.image(logo, 'png'), cx: cm(3), cy: cm(1), descr: 'Logo' }), { style: 'Header' }),
        table({ grid: [4513, 4513], rows: [{ cells: [{ content: 'Report' }, { content: p('October 2026', { jc: 'right', spacing: { after: 0 } }) }] }] }),
        p('', { style: 'Header' }),
      ]);
      doc.sect = { headers: { default: h } };
      doc.add(...fill(rand, 16));
    },
  },
  {
    id: 'DX-HF-05', title: 'STYLEREF in the header',
    expect: 'The header shows the Heading 1 of the current page: "Chapter One" on pages 1–2, "Chapter Two" on page 3, "Chapter Three" on page 4.',
    build(doc, rand) {
      const h = doc.header(p(fld('STYLEREF "Heading 1" \\* MERGEFORMAT', 'Chapter One'), { style: 'Header', jc: 'right' }));
      doc.sect = { headers: { default: h } };
      doc.add(p('Chapter One', { style: 'Heading1' }), ...fill(rand, 16));
      doc.add(p('Chapter Two', { style: 'Heading1', pageBreakBefore: true }), ...fill(rand, 4));
      doc.add(p('Chapter Three', { style: 'Heading1', pageBreakBefore: true }), ...fill(rand, 4));
    },
  },

  // ---- IMG ----
  {
    id: 'DX-IMG-01', title: 'Inline pictures',
    expect: 'A PNG 12 × 9 cm and a JPEG 6 × 4.5 cm, each in its own paragraph with a caption line under it. The yellow dot is in the top-right corner and the F reads normally.',
    async build(doc) {
      const png = doc.main.image(await image('picture', 'png'), 'png');
      const jpg = doc.main.image(await image('picture', 'jpeg', { variant: 1 }), 'jpeg');
      doc.add(p(picture(doc, { rId: png, cx: cm(12), cy: cm(9), descr: 'PNG test picture' })), p('PNG, 12 × 9 cm'));
      doc.add(p(picture(doc, { rId: jpg, cx: cm(6), cy: cm(4.5), descr: 'JPEG test picture' })), p('JPEG, 6 × 4.5 cm'));
    },
  },
  {
    id: 'DX-IMG-02', title: 'Text wrapping around pictures',
    expect: 'Six pictures with Square, Tight, Through, Top and bottom, Behind text and In front of text wrapping, in that order, each with text around it as the label says.',
    async build(doc, rand) {
      const rect = doc.main.image(await image('picture', 'png', { variant: 2 }), 'png');
      const circle = doc.main.image(await image('circle', 'png'), 'png');
      const cases = [
        ['Square', rect, { wrap: 'square' }],
        ['Tight (around the circle)', circle, { wrap: 'tight', polygon: OCTAGON }],
        ['Through', circle, { wrap: 'through', polygon: OCTAGON }],
        ['Top and bottom', rect, { wrap: 'topAndBottom' }],
        ['Behind text', rect, { wrap: 'none', behind: true }],
        ['In front of text', rect, { wrap: 'none' }],
      ];
      for (const [name, rId, a] of cases) {
        const size = rId === circle ? { cx: cm(4), cy: cm(4) } : { cx: cm(4), cy: cm(3) };
        const pic = picture(doc, { rId, ...size, descr: name, anchor: { h: { from: 'column', offset: cm(5) }, v: { from: 'paragraph', offset: cm(0.3) }, ...a } });
        doc.add(p([r(`${name}. `, { b: true }), pic, r(enParagraph(rand, 6))]), p(enParagraph(rand, 3)));
      }
    },
  },
  {
    id: 'DX-IMG-03', title: 'Picture position',
    expect: 'Picture A is centred on the page 8 cm from its top edge; B is at the right margin beside paragraph 2; C is 3 cm from the column edge and 1 cm below the top of paragraph 3; D is locked at the bottom-left corner of the margins.',
    async build(doc, rand) {
      const img = async (v) => doc.main.image(await image('picture', 'png', { variant: v }), 'png');
      const pic = async (v, anchor, d) => picture(doc, { rId: await img(v), cx: cm(3.2), cy: cm(2.4), descr: d, anchor: { wrap: 'square', ...anchor } });
      doc.add(p([await pic(0, { h: { from: 'page', align: 'center' }, v: { from: 'page', offset: cm(8) } }, 'A'), r(`A. ${enParagraph(rand, 5)}`)]));
      doc.add(p([await pic(1, { h: { from: 'margin', align: 'right' }, v: { from: 'paragraph', offset: 0 } }, 'B'), r(`B. ${enParagraph(rand, 5)}`)]));
      doc.add(p([await pic(3, { h: { from: 'column', offset: cm(3) }, v: { from: 'paragraph', offset: cm(1) } }, 'C'), r(`C. ${enParagraph(rand, 5)}`)]));
      doc.add(p([await pic(4, { h: { from: 'margin', align: 'left' }, v: { from: 'margin', align: 'bottom' }, locked: true }, 'D'), r(`D. ${enParagraph(rand, 5)}`)]));
      doc.add(...fill(rand, 3));
    },
  },
  {
    id: 'DX-IMG-04', title: 'Crop, rotation and flips',
    expect: 'Picture 1 is cropped by 10% on every side (the border is gone); picture 2 is turned 30° clockwise; picture 3 is flipped horizontally (the F faces left, the dot is top-left); picture 4 is flipped vertically (the dot is bottom-right).',
    async build(doc) {
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      const size = { cx: cm(6), cy: cm(4.5) };
      doc.add(p([r('1. Cropped 10%: '), picture(doc, { rId, ...size, crop: { l: 10000, t: 10000, r: 10000, b: 10000 } })]));
      doc.add(p([r('2. Rotated 30°: '), picture(doc, { rId, ...size, rot: 1800000, effect: { l: 260280, t: 431460, r: 260280, b: 431460 } })]));
      doc.add(p([r('3. Flipped horizontally: '), picture(doc, { rId, ...size, flipH: true })]));
      doc.add(p([r('4. Flipped vertically: '), picture(doc, { rId, ...size, flipV: true })]));
    },
  },
  {
    id: 'DX-IMG-05', title: 'Picture formats',
    expect: 'Four pictures labelled GIF, BMP, TIFF and SVG. The SVG one is drawn from the SVG; if a program cannot read SVG, it shows the PNG copy stored with it, which looks the same.',
    async build(doc) {
      const size = { cx: cm(6), cy: cm(4.5) };
      for (const [fmt, name, v] of [['gif', 'GIF', 1], ['bmp', 'BMP', 2], ['tiff', 'TIFF', 3]]) {
        doc.add(p(name), p(picture(doc, { rId: doc.main.image(await image('picture', fmt, { variant: v }), fmt), ...size, descr: name })));
      }
      const svg = doc.main.image(Buffer.from(pictureSvg(800, 600, 4)), 'svg');
      const fallback = doc.main.image(await image('picture', 'png', { variant: 4 }), 'png');
      doc.add(p('SVG'), p(picture(doc, { rId: fallback, svg, ...size, descr: 'SVG' })));
    },
  },
  {
    id: 'DX-IMG-07', title: 'Alt text',
    expect: 'Picture 1 has the alt text "A test picture with a large F and a yellow dot" and the title "Test picture". Picture 2 is marked as decorative.',
    async build(doc) {
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      doc.add(p(picture(doc, { rId, cx: cm(6), cy: cm(4.5), descr: 'A test picture with a large F and a yellow dot', title: 'Test picture' })));
      doc.add(p(picture(doc, { rId, cx: cm(3), cy: cm(2.25), decorative: true })));
    },
  },
  {
    id: 'DX-IMG-08', title: 'Linked pictures',
    expect: 'Picture 1 links to "missing-picture.png", which does not exist, so a placeholder or an error box shows. Picture 2 is linked and also saved in the file, so it shows.',
    async build(doc) {
      const link = doc.main.rel('image', 'missing-picture.png', true);
      const link2 = doc.main.rel('image', 'also-missing.png', true);
      const embed = doc.main.image(await image('picture', 'png', { variant: 5 }), 'png');
      doc.add(p('1. Linked only:'), p(picture(doc, { link, cx: cm(6), cy: cm(4.5), descr: 'Linked picture' })));
      doc.add(p('2. Linked and saved in the file:'), p(picture(doc, { link: link2, rId: embed, cx: cm(6), cy: cm(4.5), descr: 'Linked and embedded picture' })));
    },
  },
  {
    id: 'DX-IMG-09', title: 'Large photos',
    expect: 'Four photo-like 4000 × 3000 JPEGs shown 15 × 11.25 cm, one per page. Note how long the file takes to open and its size after saving.',
    async build(doc) {
      for (let i = 1; i <= 4; i++) {
        const rId = doc.main.image(await image('photo', 'jpeg', { w: 4000, h: 3000, seed: i }), 'jpeg');
        doc.add(p(picture(doc, { rId, cx: cm(15), cy: cm(11.25), descr: `Photo ${i}` })), p(`Photo ${i}, 4000 × 3000 pixels`));
        if (i < 4) doc.add(p(pageBreak()));
      }
    },
  },

  // ---- REF ----
  {
    id: 'DX-REF-01', title: 'Table of contents',
    expect: 'A three-level table of contents with dot leaders: Introduction 2, Background 2, Method 3, Test files 3, Generated files 3, Results 4, Discussion 5, Limits 5. Clicking an entry jumps to its heading.',
    build(doc, rand) {
      const heads = [
        [1, 'Introduction', 2], [2, 'Background', 2], [1, 'Method', 3], [2, 'Test files', 3], [3, 'Generated files', 3],
        [1, 'Results', 4], [1, 'Discussion', 5], [2, 'Limits', 5],
      ].map(([level, text, page], i) => ({ level, text, page, anchor: `_Toc${100 + i}` }));
      doc.add(p('Contents', { style: 'TOCHeading' }), ...toc(heads));
      for (const h of heads) {
        doc.add(p(bookmark(doc.nextBookmark(), h.anchor, r(h.text)), { style: `Heading${h.level}`, pageBreakBefore: h.level === 1 }));
        doc.add(p(enParagraph(rand, 4)));
      }
    },
  },
  {
    id: 'DX-REF-02', title: 'Footnotes and endnotes',
    expect: 'Ten footnotes numbered 1–10 at the bottom of their pages; footnote 3 is long and continues onto the next page. Five endnotes numbered i–v at the end of the document.',
    build(doc, rand) {
      doc.settings.endnoteFmt = '<w:numFmt w:val="lowerRoman"/>';
      doc.sect = { endnotePr: '<w:numFmt w:val="lowerRoman"/>' };
      let fn = 0;
      let en = 0;
      for (let i = 0; i < 20; i++) {
        const runs = [r(enParagraph(rand, 3))];
        if (i % 2 === 0 && fn < 10) {
          fn++;
          runs.push(doc.footnote(fn === 3 ? enParagraphs(rand, 550) : enSentence(rand)));
        }
        if (i % 4 === 1 && en < 5) {
          en++;
          runs.push(doc.endnote(enSentence(rand)));
        }
        doc.add(p(runs));
      }
    },
  },
  {
    id: 'DX-REF-03', title: 'Captions and a table of figures',
    expect: 'Two lists on page 1: figures (Figure 1 page 2, Figure 2 page 3, Figure 3 page 4) and tables (Table 1 page 4, Table 2 page 5). Captions sit under the figures and above the tables.',
    async build(doc, rand) {
      const caption = (labelText, n, text, anchor) =>
        p(bookmark(doc.nextBookmark(), anchor, [r(`${labelText} `), fld(`SEQ ${labelText} \\* ARABIC`, String(n)), r(`: ${text}`)].join('')), { style: 'Caption' });
      const figs = [['A test picture', 2], ['A second picture', 3], ['A third picture', 4]].map(([text, page], i) => ({ text: `Figure ${i + 1}: ${text}`, page, anchor: `_Toc${200 + i}`, n: i + 1, caption: text }));
      const tabs = [['Test results', 4], ['Summary', 5]].map(([text, page], i) => ({ text: `Table ${i + 1}: ${text}`, page, anchor: `_Toc${300 + i}`, n: i + 1, caption: text }));
      doc.add(p('Figures', { style: 'Heading2' }), ...toc(figs, { instr: 'TOC \\h \\z \\c "Figure"', style: 'TableofFigures' }));
      doc.add(p('Tables', { style: 'Heading2' }), ...toc(tabs, { instr: 'TOC \\h \\z \\c "Table"', style: 'TableofFigures' }));
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      for (const f of figs) doc.add(p(picture(doc, { rId, cx: cm(8), cy: cm(6), descr: f.caption }), { pageBreakBefore: true }), caption('Figure', f.n, f.caption, f.anchor), p(enParagraph(rand, 3)));
      for (const [i, tb] of tabs.entries()) {
        doc.add(caption('Table', tb.n, tb.caption, tb.anchor), table({ grid: [4513, 4513], rows: [0, 1, 2].map((k) => ({ cells: [{ content: `Row ${k + 1}` }, { content: String((k + 1) * 10) }] })) }), p(enParagraph(rand, 3)));
        if (i === 0) doc.add(p(pageBreak()));
      }
    },
  },
  {
    id: 'DX-REF-04', title: 'Cross-references',
    expect: 'Page 3 reads: "See section 2.1 (Test files) on page 2, which is above. Figure 1 shows the picture." After updating fields the numbers stay the same.',
    async build(doc, rand) {
      const num = doc.numbering.add([
        { fmt: 'decimal', text: '%1', pStyle: 'Heading1', left: 432, hanging: 432 },
        { fmt: 'decimal', text: '%1.%2', pStyle: 'Heading2', left: 576, hanging: 576 },
      ], { multi: 'multilevel' });
      doc.styles = stylesXml({ styles: standardStyles({ headingNum: num }) });
      doc.add(p('Introduction', { style: 'Heading1' }), p(enParagraph(rand, 4)));
      doc.add(p('Method', { style: 'Heading1', pageBreakBefore: true }), p(bookmark(doc.nextBookmark(), '_Ref100000001', r('Test files')), { style: 'Heading2' }), p(enParagraph(rand, 3)));
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      doc.add(p(picture(doc, { rId, cx: cm(6), cy: cm(4.5) })), p([bookmark(doc.nextBookmark(), '_Ref100000002', [r('Figure '), fld('SEQ Figure \\* ARABIC', '1')].join('')), r(': The test picture')], { style: 'Caption' }));
      doc.add(p('Results', { style: 'Heading1', pageBreakBefore: true }));
      doc.add(p([
        r('See section '), fld('REF _Ref100000001 \\r \\h', '2.1'), r(' ('), fld('REF _Ref100000001 \\h', 'Test files'),
        r(') on page '), fld('PAGEREF _Ref100000001 \\h', '2'), r(', which is '), fld('REF _Ref100000001 \\p \\h', 'above'),
        r('. '), fld('REF _Ref100000002 \\h', 'Figure 1'), r(' shows the picture.'),
      ]));
    },
  },
  {
    id: 'DX-REF-05', title: 'Hyperlinks',
    expect: 'Four blue underlined links: a web address, an e-mail address, a link to the bookmark "Target" on page 2, and a link with the screen tip "Opens the WordCraft releases".',
    build(doc, rand) {
      doc.add(
        p([r('Web: '), hyperlink(doc, 'https://github.com/storytold/wordcraft', 'github.com/storytold/wordcraft')]),
        p([r('E-mail: '), hyperlink(doc, 'mailto:hello@example.com', 'hello@example.com')]),
        p([r('Inside the document: '), `<w:hyperlink w:anchor="Target" w:history="1">${r('jump to the target on page 2', { style: 'Hyperlink' })}</w:hyperlink>`]),
        p([r('With a screen tip: '), hyperlink(doc, 'https://github.com/storytold/wordcraft/releases', 'WordCraft releases', { tooltip: 'Opens the WordCraft releases' })]),
        p(bookmark(doc.nextBookmark(), 'Target', r('This paragraph is the target.', { b: true })), { pageBreakBefore: true }),
        p(enParagraph(rand, 3)),
      );
    },
  },
  {
    id: 'DX-REF-06', title: 'Bookmarks',
    expect: 'Five bookmarks: PointMark (an empty point), InlineRange (two words), MultiPara (across two paragraphs), CellMark (inside a cell), TableSpan (from before the table to its last cell). Go To finds each.',
    build(doc, rand) {
      const b = (name, inner) => bookmark(doc.nextBookmark(), name, inner);
      const mp = doc.nextBookmark();
      const ts = doc.nextBookmark();
      doc.add(p([r('A point bookmark here: '), b('PointMark', ''), r(' and after it.')]));
      doc.add(p([r('A range around '), b('InlineRange', r('these words')), r(' in the middle.')]));
      doc.add(p([`<w:bookmarkStart w:id="${mp}" w:name="MultiPara"/>`, r(enParagraph(rand, 2))]), p([r(enParagraph(rand, 2)), `<w:bookmarkEnd w:id="${mp}"/>`]));
      doc.add(p([`<w:bookmarkStart w:id="${ts}" w:name="TableSpan"/>`, r('The table below:')]));
      doc.add(table({ grid: [4513, 4513], rows: [
        { cells: [{ content: p(b('CellMark', r('a bookmarked cell'))) }, { content: 'b' }] },
        { cells: [{ content: 'c' }, { content: p([r('last cell'), `<w:bookmarkEnd w:id="${ts}"/>`]) }] },
      ] }), p(''));
    },
  },
  {
    id: 'DX-REF-07', title: 'Index',
    expect: 'Page 4 holds a two-column index with 13 entries and 2 subentries under "Tables": Alignment 1 … Tabs 3, under letter headings.',
    build(doc, rand) {
      const pages = [['Alignment', 'Borders', 'Captions', 'Columns', 'Fields'], ['Footnotes', 'Headers', 'Lists', 'Margins', 'Pictures'], ['Sections', 'Styles', 'Tables', 'Tables:merged cells', 'Tables:nested', 'Tabs']];
      pages.forEach((terms, i) => {
        for (const term of terms) doc.add(p([r(`${term.replace(':', ', ')}. ${enSentence(rand)}`), xe(term)]));
        doc.add(p(enParagraph(rand, 3)));
        if (i < 2) doc.add(p(pageBreak()));
      });
      doc.add(p(pageBreak()), p('Index', { style: 'Heading1', sectPr: sectPr({}) }));
      const lines = [];
      let letter = '';
      pages.forEach((terms, i) => {
        for (const term of terms) {
          const [main, sub] = term.split(':');
          if (main[0] !== letter) lines.push({ text: (letter = main[0]), style: 'IndexHeading' });
          if (!sub) lines.push({ text: `${main}, ${i + 1}`, style: 'Index1' });
          else lines.push({ text: `${sub}, ${i + 1}`, style: 'Index2' });
        }
      });
      doc.sect = { type: 'continuous', cols: '<w:cols w:num="2" w:space="720"/>' };
    },
  },

  // ---- FLD ----
  {
    id: 'DX-FLD-01', title: 'Date and document fields',
    expect: 'Fields show (cached): October 17, 2026; 2026-10-17; the creation date; the title "DX-FLD-01 Date and document fields"; the author "GetWordCraft"; the file name; a word count. Updating them changes the dates to today.',
    build(doc) {
      doc.add(
        p([label('DATE (long)'), fld('DATE \\@ "MMMM d, yyyy"', 'October 17, 2026')]),
        p([label('DATE (ISO)'), fld('DATE \\@ "yyyy-MM-dd"', '2026-10-17')]),
        p([label('CREATEDATE'), fld('CREATEDATE \\@ "dddd, d MMMM yyyy"', 'Saturday, 17 October 2026')]),
        p([label('TITLE'), fld('TITLE', 'DX-FLD-01 Date and document fields')]),
        p([label('AUTHOR'), fld('AUTHOR', 'GetWordCraft')]),
        p([label('FILENAME'), fld('FILENAME', 'DX-FLD-01.docx')]),
        p([label('NUMWORDS'), fld('NUMWORDS', '60')]),
      );
    },
  },
  {
    id: 'DX-FLD-02', title: 'Formula, IF, SEQ and nested fields',
    expect: '"= 2*3+1" shows 7; the IF field "five is larger"; three SEQ fields 1, 2, 3; the nested IF "nested OK".',
    build(doc) {
      const nested =
        rx('<w:fldChar w:fldCharType="begin"/>') + rx('<w:instrText xml:space="preserve"> IF </w:instrText>') +
        fld('= 2+2', '4') + rx('<w:instrText xml:space="preserve"> = 4 "nested OK" "nested wrong" </w:instrText>') +
        rx('<w:fldChar w:fldCharType="separate"/>') + r('nested OK') + rx('<w:fldChar w:fldCharType="end"/>');
      doc.add(
        p([label('Formula'), fld('= 2*3+1', '7')]),
        p([label('IF'), fld('IF 5 > 3 "five is larger" "three is larger"', 'five is larger')]),
        p([label('SEQ'), fld('SEQ Item', '1'), r(', '), fld('SEQ Item', '2'), r(', '), fld('SEQ Item', '3')]),
        p([label('Nested'), nested]),
      );
    },
  },
  {
    id: 'DX-FLD-04', title: 'Mail merge main document',
    expect: 'A letter with merge fields «FirstName», «LastName», «Company» and «City». No data source is attached.',
    build(doc, rand) {
      const mf = (name) => fld(`MERGEFIELD ${name}`, `«${name}»`);
      doc.add(
        p([r('Dear '), mf('FirstName'), r(' '), mf('LastName'), r(',')]),
        p([r('Thank you for testing WordCraft at '), mf('Company'), r(' in '), mf('City'), r('.')]),
        p(enParagraph(rand, 3)),
      );
    },
  },

  // ---- REV ----
  {
    id: 'DX-REV-02', title: 'Tracked changes',
    expect: 'Track Changes is on. Alice inserted "carefully" and deleted "quickly"; Bob made "important" bold, centred paragraph 3 and deleted paragraph 4; Alice inserted paragraph 5. Both authors show in different colours.',
    build(doc, rand) {
      doc.settings.trackRevisions = true;
      const rv = revision(doc);
      const A = ['Alice', '2026-10-15T09:00:00Z'];
      const B = ['Bob', '2026-10-16T14:30:00Z'];
      doc.add(
        p([r('1. The editor checks the document '), rv.ins(...A, r('carefully ')), rv.del(...A, 'quickly '), r('before sending it.')]),
        p([r('2. This word is '), r('important', { b: true, raw: rv.rPrChange(...B) }), r(' and now bold.')]),
        p(r(`3. Centred by Bob. ${enSentence(rand)}`), { jc: 'center', pPrChange: rv.pPrChange(...B) }),
        p(rv.del(...B, `4. Deleted by Bob. ${enSentence(rand)}`), { rPr: rv.mark('del', ...B) }),
        p(rv.ins(...A, r(`5. Inserted by Alice. ${enSentence(rand)}`)), { rPr: rv.mark('ins', ...A) }),
        p(`6. ${enParagraph(rand, 2)}`),
      );
    },
  },

  // ---- PRT ----
  {
    id: 'DX-PRT-05', title: 'Document properties',
    expect: 'File properties: title "Property test", subject "WordCraft compatibility", author "GetWordCraft editors", keywords "docx; properties", comments "Generated test file"; custom properties Project = "WordCraft tests" and Reviewed = "No".',
    build(doc) {
      Object.assign(doc.meta, {
        title: 'Property test', subject: 'WordCraft compatibility', creator: 'GetWordCraft editors',
        keywords: 'docx; properties', description: 'Generated test file', custom: { Project: 'WordCraft tests', Reviewed: 'No' },
      });
      doc.add(p('Check the properties under File › Properties (or Info) in both programs.'));
    },
  },

  // ---- FNT ----
  {
    id: 'DX-FNT-02', title: 'Calibri',
    expect: 'About three pages of Calibri 11 pt with Word 2013–2019 spacing (1.08 lines, 8 pt after). Compare the last word on each page with Word.',
    build(doc) {
      doc.styles = stylesXml({ font: 'Calibri', spacing: { after: 160, line: 259, lineRule: 'auto' } });
      doc.add(...fontText().map((t) => p(t)));
    },
  },
  {
    id: 'DX-FNT-03', title: 'Common fonts',
    expect: 'One paragraph per font, each set in the font it names. Note the font each one is actually drawn with.',
    build(doc, rand) {
      for (const font of ['Times New Roman', 'Arial', 'Courier New', 'Cambria', 'Georgia', 'Verdana', 'Tahoma', 'Segoe UI', 'Helvetica', 'Garamond', 'Aptos', 'Calibri']) {
        doc.add(p([r(`${font}: `, { b: true, fonts: font }), r(enParagraph(rand, 2), { fonts: font })]));
      }
    },
  },
  {
    id: 'DX-FNT-04', title: 'Missing fonts',
    expect: 'Paragraphs set in fonts most computers lack. Each is drawn with a substitute; after saving, the font box still shows the original name.',
    build(doc, rand) {
      for (const font of ['Gill Sans Nova', 'Avenir Next LT Pro', 'Futura PT', 'Totally Missing Sans', 'Segoe Print', 'Palatino Linotype']) {
        doc.add(p([r(`${font}: `, { b: true }), r(enParagraph(rand, 2), { fonts: font })]));
      }
    },
  },
  {
    id: 'DX-FNT-06', title: 'Bold, italic and font weights',
    expect: 'Impact has no bold face, so its bold line is thickened by the program; the other lines use real weights: Arial Black, Arial Narrow, Segoe UI Light and Semibold, Helvetica Neue Light, and Times New Roman bold italic.',
    build(doc) {
      const s = 'The quick brown fox jumps over the lazy dog 0123456789';
      for (const [font, o] of [['Impact', { b: true }], ['Arial Black', {}], ['Arial Narrow', {}], ['Segoe UI Light', {}], ['Segoe UI Semibold', {}], ['Helvetica Neue Light', {}], ['Times New Roman', { b: true, i: true }]]) {
        doc.add(p([r(`${font}${o.b ? ' bold' : ''}${o.i ? ' italic' : ''}: `, { b: true }), r(s, { fonts: font, ...o })]));
      }
    },
  },

  // ---- LAY ----
  {
    id: 'DX-LAY-01', title: 'Pagination of a 10-page report',
    expect: 'About ten pages of Arial 11 pt with headings and lists. For each page, note the first and last word in both programs.',
    build(doc, rand) {
      const bullets = doc.numbering.add(BULLETS);
      doc.add(p('Ten-page report', { style: 'Title' }));
      for (let s = 1; s <= 8; s++) {
        doc.add(p(`Section ${s}`, { style: 'Heading1' }));
        for (let k = 0; k < 3; k++) doc.add(p(enParagraph(rand)));
        doc.add(p(`Part ${s}.1`, { style: 'Heading2' }), p(enParagraph(rand)));
        for (let k = 0; k < 4; k++) doc.add(p(enSentence(rand), { style: 'ListParagraph', numPr: { id: bullets } }));
        doc.add(p(enParagraph(rand)), p(enParagraph(rand)));
      }
    },
  },
  {
    id: 'DX-LAY-02', title: 'A 20-page report with pictures and tables',
    expect: 'About twenty pages: contents, six chapters, eight pictures, four tables, ten footnotes, header and "Page X of Y" footer. Baseline step: update the table of contents in Word before saving.',
    async build(doc, rand) {
      doc.sect = {
        headers: { default: doc.header(p('DX-LAY-02 · Report', { style: 'Header', jc: 'right' })) },
        footers: { default: doc.footer(p([r('Page '), fld('PAGE', '1'), r(' of '), fld('NUMPAGES', '20')], { style: 'Footer', jc: 'center' })) },
      };
      const chapters = ['Overview', 'Files', 'Layout', 'Tables', 'Pictures', 'Summary'];
      const entries = chapters.flatMap((c, i) => [{ level: 1, text: `${i + 1}. ${c}`, page: 2 + i * 3, anchor: `_Toc${400 + i * 2}` }, { level: 2, text: `${i + 1}.1 Details`, page: 3 + i * 3, anchor: `_Toc${401 + i * 2}` }]);
      doc.add(p('Twenty-page report', { style: 'Title' }), p('Contents', { style: 'TOCHeading' }), ...toc(entries));
      let fig = 0;
      let foot = 0;
      for (const [i, c] of chapters.entries()) {
        doc.add(p(bookmark(doc.nextBookmark(), entries[i * 2].anchor, r(entries[i * 2].text)), { style: 'Heading1', pageBreakBefore: true }));
        for (let k = 0; k < 4; k++) {
          const note = foot < 10 && k % 2 === 0;
          if (note) foot++;
          doc.add(p([r(enParagraph(rand)), note ? doc.footnote(enSentence(rand)) : '']));
        }
        if (fig < 8) {
          for (let k = 0; k < (i < 2 ? 2 : 1); k++) {
            fig++;
            const rId = doc.main.image(await image('picture', fig % 2 ? 'png' : 'jpeg', { variant: fig }), fig % 2 ? 'png' : 'jpeg');
            doc.add(p(picture(doc, { rId, cx: cm(10), cy: cm(7.5), descr: `Picture ${fig}` }), { jc: 'center', keepNext: true }), p(`Figure ${fig}. ${c}`, { style: 'Caption', jc: 'center' }));
          }
        }
        doc.add(p(bookmark(doc.nextBookmark(), entries[i * 2 + 1].anchor, r(entries[i * 2 + 1].text)), { style: 'Heading2' }));
        for (let k = 0; k < 5; k++) doc.add(p(enParagraph(rand)));
        if (i >= 2) {
          const rows = [{ header: true, cells: ['Item', 'Value', 'Notes'].map((h) => ({ content: p(r(h, { b: true })), shd: 'D9D9D9' })) }];
          for (let k = 0; k < 10; k++) rows.push({ cells: [{ content: `Item ${k + 1}` }, { content: String(17 * (k + 3)) }, { content: enSentence(rand) }] });
          doc.add(table({ grid: [2000, 1500, 5526], rows }), p(''));
        }
      }
    },
  },
  {
    id: 'DX-LAY-03', title: 'Compatibility modes',
    expect: 'Three files with the same content, saved for Word 2003 (mode 11), Word 2010 (mode 14) and Word 2013 and later (mode 15). Word shows "Compatibility Mode" for the first two. Baseline step: keep the mode; do not convert.',
    variants: [11, 14, 15].map((mode) => ({ suffix: `-${mode}`, arg: mode })),
    build: (doc, rand, mode) => layoutCompat(doc, rand, mode),
  },

  // ---- PRD ----
  {
    id: 'DX-PRD-SRC', title: 'Source document for other programs',
    expect: 'A three-page business report: title, headings, lists, a table with a merged header, a picture, a footnote, a comment, a link, header and page numbers. Open it in each program, then save or export a .docx from there (see dx-docx.md, PRD).',
    async build(doc, rand) {
      await prdSource(doc, rand);
    },
  },
];

/** The fixed text for DX-FNT-01 and DX-FNT-02: about 1,500 words. */
export function fontText() {
  return enParagraphs(rng(1001), 1500);
}

/** DX-PRD-SRC, also written as Markdown for the pandoc case. */
export async function prdSource(doc, rand) {
  const bullets = doc.numbering.add(BULLETS);
  const numbers = doc.numbering.add([{ fmt: 'decimal', text: '%1.' }]);
  doc.sect = {
    headers: { default: doc.header(p('Quarterly report · DX-PRD-SRC', { style: 'Header', jc: 'right' })) },
    footers: { default: doc.footer(p([r('Page '), fld('PAGE', '1')], { style: 'Footer', jc: 'center' })) },
  };
  const c = doc.comment({ author: 'Reviewer', initials: 'R', date: '2026-10-17T10:00:00Z', text: 'Please check this figure.' });
  doc.add(p('Quarterly report', { style: 'Title' }), p('Summary', { style: 'Heading1' }), p(enParagraph(rand)));
  doc.add(p([r('Revenue grew in every region. '), c.start, r('The total was 4,210 units'), c.end, r('.'), doc.footnote('Units shipped, not orders placed.')]));
  doc.add(p('Highlights', { style: 'Heading2' }), ...Array.from({ length: 4 }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id: bullets } })));
  doc.add(p('Next steps', { style: 'Heading2' }), ...Array.from({ length: 3 }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id: numbers } })));
  doc.add(p('Results by region', { style: 'Heading1', pageBreakBefore: true }));
  doc.add(table({ grid: [2256, 2256, 2257, 2257], rows: [
    { header: true, cells: [{ content: p(r('Region', { b: true })), vMerge: 'restart', shd: 'D9E2F3' }, { content: p(r('Units', { b: true }), { jc: 'center' }), span: 2, shd: 'D9E2F3' }, { content: p(r('Change', { b: true })), vMerge: 'restart', shd: 'D9E2F3' }] },
    { header: true, cells: [{ vMerge: true, shd: 'D9E2F3' }, { content: 'Q2', shd: 'D9E2F3' }, { content: 'Q3', shd: 'D9E2F3' }, { vMerge: true, shd: 'D9E2F3' }] },
    ...[['North', 900, 1010], ['South', 1100, 1240], ['East', 760, 830], ['West', 1050, 1130]].map(([n, a, b]) => ({ cells: [{ content: n }, { content: String(a) }, { content: String(b) }, { content: `${Math.round(((b - a) / a) * 100)}%` }] })),
  ] }), p(''));
  const rId = doc.main.image(await image('picture', 'png', { variant: 1 }), 'png');
  doc.add(p(picture(doc, { rId, cx: cm(10), cy: cm(7.5), descr: 'Chart placeholder picture' }), { jc: 'center' }), p('Figure 1. Units by region', { style: 'Caption', jc: 'center' }));
  doc.add(p(enParagraph(rand)), p([r('More information: '), hyperlink(doc, 'https://getwordcraft.org', 'getwordcraft.org')]));
  doc.add(p('Appendix', { style: 'Heading1', pageBreakBefore: true }), ...Array.from({ length: 5 }, () => p(enParagraph(rand))));
}

/** DX-LAY-03: the same content in each compatibility mode. */
async function layoutCompat(doc, rand, mode) {
  doc.settings.compatMode = mode;
  doc.styles = stylesXml({ spacing: { after: 200, line: 276, lineRule: 'auto' } });
  const bullets = doc.numbering.add(BULLETS);
  const rId = doc.main.image(await image('picture', 'png', { variant: 3 }), 'png');
  doc.add(p('Compatibility mode test', { style: 'Heading1' }), p(enParagraph(rand)));
  doc.add(p([picture(doc, { rId, cx: cm(5), cy: cm(3.75), anchor: { wrap: 'square', h: { from: 'margin', align: 'right' }, v: { from: 'paragraph', offset: 0 } } }), r(enParagraph(rand))]));
  for (let k = 0; k < 4; k++) doc.add(p(enParagraph(rand)));
  doc.add(...Array.from({ length: 5 }, () => p(enSentence(rand), { style: 'ListParagraph', numPr: { id: bullets } })));
  doc.add(table({ grid: [3008, 3009, 3009], rows: [0, 1, 2, 3].map((i) => ({ cells: [{ content: `Row ${i + 1}` }, { content: enSentence(rand) }, { content: String(i * 7) }] })) }));
  for (let k = 0; k < 8; k++) doc.add(p(enParagraph(rand)));
  doc.add(p('A heading kept with the next paragraph', { style: 'Heading2' }), p(enParagraph(rand)));
  for (let k = 0; k < 6; k++) doc.add(p(enParagraph(rand)));
}
