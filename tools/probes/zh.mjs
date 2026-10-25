// Generated probes for the ZH suite (suites/zh-typesetting.md).
// Defaults follow Chinese Word: SimSun 10.5 pt (五号), justified, a 15.6 pt line grid, 2.54/3.17 cm margins.

import { PAGE, bookmark, cm, fld, p, pageBreak, picture, r, rx, sectPr, standardStyles, styleDefs, stylesXml, table, tw } from '../lib/ooxml.mjs';
import { enParagraph, hanzi, rng, zhParagraph, zhParagraphs, zhSentence } from '../lib/text.mjs';
import { image, toc } from './common.mjs';

const { pStyle } = styleDefs;
const LATIN = 'Times New Roman';

export const ZH_SECT = {
  margins: { top: 1440, bottom: 1440, left: 1800, right: 1800, header: 851, footer: 992 },
  docGrid: { type: 'lines', linePitch: 312 },
};

/** GB/T 9704-2012: type area 156 × 225 mm, 22 lines of 28 characters at 16 pt. */
const GW_MARGINS = { top: tw.mm(37), bottom: tw.mm(35), left: tw.mm(28), right: tw.mm(26), header: tw.mm(15), footer: tw.mm(23) };
const gwGrid = (pt = 16, perLine = 28, lines = 22) => {
  const width = PAGE.A4.w - GW_MARGINS.left - GW_MARGINS.right;
  const height = PAGE.A4.h - GW_MARGINS.top - GW_MARGINS.bottom;
  return { type: 'linesAndChars', linePitch: Math.floor(height / lines), charSpace: Math.round((width / 20 / perLine - pt) * 4096) };
};
export const GW_SECT = { margins: GW_MARGINS, docGrid: gwGrid() };

export function zhStyles({ ea = '宋体', latin = LATIN, sz = 10.5, headingFont = '黑体', headingNum, spacing, extra = '' } = {}) {
  return stylesXml({
    font: { latin, ea, cs: latin },
    sz,
    jc: 'both',
    spacing: spacing ?? { line: 240, lineRule: 'auto' },
    styles: standardStyles({ headingFont: { latin, ea: headingFont }, headingNum, headingColor: '000000', east: true }) + extra,
  });
}

/** Chinese defaults on a fresh document. Called before the banner. */
export function zhSetup(doc, { grid = 'default' } = {}) {
  doc.styles = zhStyles();
  doc.settings.characterSpacingControl = 'compressPunctuation';
  doc.settings.themeFontLang = { val: 'en-US', eastAsia: 'zh-CN' };
  doc.sect = grid === 'gongwen' ? { ...GW_SECT } : { ...ZH_SECT };
  if (grid === 'gongwen') doc.styles = zhStyles({ sz: 16 });
}

const fill = (rand, n, o) => Array.from({ length: n }, () => p(zhParagraph(rand), o));
const indent2 = (pt = 10.5) => ({ firstLineChars: 200, firstLine: Math.round(pt * 40) });
const label = (text) => r(`${text}：`, { fonts: { ea: '黑体' } });

export const zh = [
  // ---- FNT ----
  {
    id: 'ZH-FNT-01', title: '常用中文字体 · Common Chinese fonts',
    expect: '每段用段首写的字体显示。前八段用中文字体名，后八段用英文字体名，同一种字体两种写法应显示得一样。记下每段实际用的字体。',
    build(doc, rand) {
      const fonts = [['宋体', 'SimSun'], ['黑体', 'SimHei'], ['楷体', 'KaiTi'], ['仿宋', 'FangSong'], ['微软雅黑', 'Microsoft YaHei'], ['等线', 'DengXian'], ['苹方-简', 'PingFang SC'], ['宋体-简', 'Songti SC']];
      const sample = `${zhSentence(rand)}ABC abc 0123456789`;
      for (const [cn] of fonts) doc.add(p([label(cn), r(sample, { fonts: { latin: LATIN, ea: cn } })]));
      for (const [cn, en] of fonts) doc.add(p([label(`${en}（${cn}）`), r(sample, { fonts: { latin: LATIN, ea: en } })]));
    },
  },
  {
    id: 'ZH-FNT-02', title: '公文字体 · Fonts of official documents',
    expect: '方正小标宋简体二号、仿宋_GB2312 三号、楷体_GB2312 三号、黑体三号各一段。多数电脑没有前三种字体，会用替代字体；保存后字体框里应仍是原来的字体名。',
    build(doc, rand) {
      for (const [font, size, name] of [['方正小标宋简体', 22, '二号'], ['仿宋_GB2312', 16, '三号'], ['楷体_GB2312', 16, '三号'], ['黑体', 16, '三号']]) {
        doc.add(p([r(`${font} ${name}：`, { sz: 10.5 }), r(zhSentence(rand), { fonts: { latin: font, ea: font }, sz: size })]));
      }
    },
  },
  {
    id: 'ZH-FNT-05', title: '中西文字体分开设置 · Separate Asian and Latin fonts',
    expect: '第一段中文是宋体、英文和数字是 Times New Roman；第二段中文黑体、英文 Arial；第三段中文楷体、英文 Georgia。',
    build(doc) {
      const text = '用 WordCraft 0.7.0 打开 Report-2026.docx，共 128 页，其中图片 36 张（JPEG 和 PNG）。';
      for (const [ea, latin] of [['宋体', 'Times New Roman'], ['黑体', 'Arial'], ['楷体', 'Georgia']]) {
        doc.add(p([label(`中文${ea}、西文 ${latin}`), r(text, { fonts: { latin, ea, cs: latin } })]));
      }
    },
  },
  {
    id: 'ZH-FNT-06', title: '生僻字和扩展区汉字 · Rare characters',
    expect: '所有字都应正常显示，不是方框或问号；光标用方向键一次移动一个字（扩展区的字在文件里占两个编码单元）。',
    build(doc) {
      doc.add(
        p([label('扩展 B 区'), r('𠀀 𠀁 𠮷 𪚥 𠊎')]),
        p([label('扩展 C 至 G 区'), r('𪜀 𫝀 𫠠 𬺰 𰀀')]),
        p([label('人名常用字'), r('喆 堃 昇 媛 珺 玥 赟 犇 淼 鑫 䶮 頔 彧 翀')]),
        p([label('繁体字'), r('臺灣 憂鬱 龜 鑰匙 體驗')]),
        p([label('夹在句中'), r('王𪚥同学和李堃同学一起测试了𠮷字的显示。')]),
      );
    },
  },
  {
    id: 'ZH-FNT-07', title: '繁体中文文档 · Traditional Chinese',
    expect: '正文用新細明體，引文用標楷體；标点用「」『』，全角。',
    build(doc) {
      doc.styles = zhStyles({ ea: '新細明體', headingFont: '標楷體' });
      doc.add(
        p('繁體中文測試', { style: 'Heading1' }),
        p('本文件以繁體中文撰寫，用來檢查新細明體與標楷體的顯示效果，以及標點符號的位置是否正確。', { ind: indent2() }),
        p([r('引用：', { fonts: { ea: '標楷體' } }), r('「這是一段使用標楷體的引文，其中還有『雙層引號』。」', { fonts: { ea: '標楷體' } })], { ind: indent2() }),
      );
    },
  },

  // ---- PAR ----
  {
    id: 'ZH-PAR-01', title: '按字符设置的缩进 · Indents in characters',
    expect: '第一段首行缩进 2 字符；第二段悬挂缩进 2 字符；第三段左缩进 2 字符；第四段是三号字，首行缩进 2 字符，缩进量是三号字的两个字宽，比前面的大。',
    build(doc, rand) {
      doc.add(
        p([label('首行缩进 2 字符'), r(zhParagraph(rand))], { ind: indent2() }),
        p([label('悬挂缩进 2 字符'), r(zhParagraph(rand))], { ind: { leftChars: 200, left: 420, hangingChars: 200, hanging: 420 } }),
        p([label('左缩进 2 字符'), r(zhParagraph(rand))], { ind: { leftChars: 200, left: 420 } }),
        p([r('三号字，首行缩进 2 字符：', { sz: 16 }), r(zhParagraph(rand), { sz: 16 })], { ind: indent2(16), rPr: { sz: 16 } }),
      );
    },
  },
  {
    id: 'ZH-PAR-02', title: '中文行距 · Line spacing',
    expect: '单倍、1.5 倍、固定值 28 磅、段前段后各 0.5 行，各一段。比较每段的行数和高度。',
    build(doc, rand) {
      const cases = [
        ['单倍行距', { line: 240, lineRule: 'auto' }],
        ['1.5 倍行距', { line: 360, lineRule: 'auto' }],
        ['固定值 28 磅', { line: 560, lineRule: 'exact' }],
        ['段前段后 0.5 行', { before: 156, beforeLines: 50, after: 156, afterLines: 50, line: 240, lineRule: 'auto' }],
      ];
      for (const [name, spacing] of cases) doc.add(p([label(name), r(zhParagraph(rand, 5))], { spacing, ind: indent2() }));
    },
  },
  {
    id: 'ZH-PAR-03', title: '文档网格 · Document grid',
    expect: 'a：中文 Word 默认的"只指定行网格"，每页 44 行、每行约 39 字。b：公文的"指定行和字符网格"，每页 22 行、每行 28 字，每行都正好 28 个字。',
    variants: [{ suffix: 'a', arg: 'default' }, { suffix: 'b', arg: 'gongwen' }],
    setup: (doc, grid) => zhSetup(doc, { grid }),
    build(doc, rand, grid) {
      const perLine = grid === 'gongwen' ? 28 : 39;
      for (let i = 0; i < 4; i++) doc.add(p(hanzi(rand, perLine * 9)));
      doc.add(...fill(rand, 6, { ind: indent2(grid === 'gongwen' ? 16 : 10.5) }));
      for (let i = 0; i < 4; i++) doc.add(p(hanzi(rand, perLine * 9)));
    },
  },
  {
    id: 'ZH-PAR-04', title: '两端对齐和分散对齐 · Justified and distributed',
    expect: '第一段两端对齐，最后一行左对齐；第二段分散对齐，最后一行也撑满；第三段中英混排两端对齐，字距均匀。',
    build(doc, rand) {
      doc.add(
        p([label('两端对齐'), r(zhParagraph(rand))], { jc: 'both', ind: indent2() }),
        p([label('分散对齐'), r(zhParagraph(rand))], { jc: 'distribute', ind: indent2() }),
        p([label('中英混排'), r('在 WordCraft 中打开 docx 文件后，Track Changes、Comments 和 Table of Contents 都应保留；Microsoft Word 2016 以后的版本也是这样处理的。'.repeat(2))], { jc: 'both', ind: indent2() }),
      );
    },
  },
  {
    id: 'ZH-PAR-05', title: '中英混排的行高 · Line height with mixed scripts',
    expect: '同一行里有中文、英文、数字和小四、三号字。行高随最大的字增加，基线对齐，没有字被切掉。',
    build(doc, rand) {
      doc.add(
        p([r('五号中文和 English text 以及 12345 '), r('小四号', { sz: 12 }), r('、'), r('三号字', { sz: 16 }), r(`，${zhSentence(rand)}`)], { ind: indent2() }),
        p([r(zhSentence(rand)), r('Georgia 14pt', { sz: 14, fonts: 'Georgia' }), r(zhSentence(rand))], { ind: indent2() }),
      );
    },
  },

  // ---- PCT ----
  {
    id: 'ZH-PCT-01', title: '行首行尾禁则 · Line-start and line-end rules',
    expect: '每行正好 28 字。开启禁则的段落（单数号）里，逗号、句号、右引号不出现在行首，左括号不出现在行尾；关闭禁则的段落（双数号）里允许出现。',
    setup: (doc) => zhSetup(doc, { grid: 'gongwen' }),
    banner: { snap: false },
    build(doc, rand) {
      const cases = [
        ['逗号', () => `${hanzi(rand, 28)}，${hanzi(rand, 20)}。`],
        ['句号', () => `${hanzi(rand, 28)}。${hanzi(rand, 20)}。`],
        ['右引号', () => `“${hanzi(rand, 27)}”${hanzi(rand, 20)}。`],
        ['右括号', () => `（${hanzi(rand, 27)}）${hanzi(rand, 20)}。`],
        ['左括号在行尾', () => `${hanzi(rand, 27)}（${hanzi(rand, 4)}）${hanzi(rand, 20)}。`],
      ];
      let n = 0;
      for (const [name, make] of cases) {
        const text = make();
        doc.add(p(r(`${++n}. ${name}，开启禁则：`, { sz: 9 }), { snapToGrid: false }), p(text));
        doc.add(p(r(`${++n}. ${name}，关闭禁则：`, { sz: 9 }), { snapToGrid: false }), p(text, { kinsoku: false }));
      }
    },
  },
  {
    id: 'ZH-PCT-02', title: '标点压缩 · Punctuation compression',
    expect: 'a 的"字符间距控制"是"只压缩标点符号"，连续的标点（。”）（），“）挤在一起；b 是"不压缩"，每个标点占一个字宽。两份文件同样的段落，a 的行应更短或换行更晚。第三段开启了"允许行首标点压缩"。',
    variants: [{ suffix: 'a', arg: 'compressPunctuation' }, { suffix: 'b', arg: 'doNotCompress' }],
    build(doc, rand, mode) {
      doc.settings.characterSpacingControl = mode;
      const dense = () => `他说：“${zhSentence(rand).slice(0, -1)}。”（${zhSentence(rand).slice(0, -1)}）。“${zhSentence(rand).slice(0, -1)}”，《${zhSentence(rand).slice(0, 8)}》、“${zhSentence(rand).slice(0, 6)}”。`;
      doc.add(p(dense(), { ind: indent2() }), p(dense(), { ind: indent2() }));
      doc.add(p(`“${dense()}`, { topLinePunct: true, ind: indent2() }));
    },
  },
  {
    id: 'ZH-PCT-03', title: '中文与西文、数字之间的间距 · Space between Chinese and Latin text or digits',
    expect: '第一段开启了两项自动间距：中文与 Word、128 等之间有约四分之一字的空隙；第二段关闭，中文和西文、数字紧贴在一起。文字里没有手动打的空格。',
    build(doc) {
      const text = '使用Word和WordCraft打开docx文件，共测试了128个用例，通过率约为75%，平均每个用例用时3分钟。';
      doc.add(p([label('开启'), r(text.repeat(2))], { ind: indent2() }));
      doc.add(p([label('关闭'), r(text.repeat(2))], { autoSpaceDE: false, autoSpaceDN: false, ind: indent2() }));
    },
  },
  {
    id: 'ZH-PCT-04', title: '标点溢出边界 · Hanging punctuation',
    expect: '每行 28 字。第一段允许标点溢出边界：第 29 个位置的句号挂在右边界外；第二段不允许：句号前的一个字被挤到下一行，或者整行压缩。',
    setup: (doc) => zhSetup(doc, { grid: 'gongwen' }),
    banner: { snap: false },
    build(doc, rand) {
      const text = `${hanzi(rand, 28)}。${hanzi(rand, 30)}。`;
      doc.add(p(r('允许标点溢出边界：', { sz: 9 }), { snapToGrid: false }), p(text, { overflowPunct: true }));
      doc.add(p(r('不允许标点溢出边界：', { sz: 9 }), { snapToGrid: false }), p(text, { overflowPunct: false }));
    },
  },
  {
    id: 'ZH-PCT-05', title: '允许西文在单词中间换行 · Breaking Latin words',
    expect: '第一段（默认）长英文单词和网址整体换到下一行，行尾留空；第二段开启"允许西文在单词中间换行"，单词在行尾被拆开，行尾没有空隙。',
    build(doc, rand) {
      const text = `${zhSentence(rand).slice(0, 26)}internationalization${zhSentence(rand).slice(0, 20)}https://github.com/storytold/wordcraft/releases/latest${zhSentence(rand)}`;
      doc.add(p([label('默认'), r(text)], { ind: indent2() }));
      doc.add(p([label('允许在单词中间换行'), r(text)], { wordWrap: false, ind: indent2() }));
    },
  },

  // ---- NUM ----
  {
    id: 'ZH-NUM-01', title: '中文编号 · Chinese numbering',
    expect: '五级编号依次是：一、二、；（一）（二）；1. 2.；（1）（2）；①②。编号后不加制表符，首行缩进 2 字符。',
    build(doc, rand) {
      const lvl = (fmt, text) => ({ fmt, text, suff: 'nothing', ind: { left: 0, firstLineChars: 200, firstLine: 420 } });
      const id = doc.numbering.add([
        lvl('chineseCounting', '%1、'), lvl('chineseCounting', '（%2）'), lvl('decimal', '%3.'), lvl('decimal', '（%4）'), lvl('decimalEnclosedCircleChinese', '%5'),
      ], { multi: 'multilevel' });
      for (const l of [0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 1, 2]) doc.add(p(zhSentence(rand), { numPr: { id, lvl: l } }));
    },
  },
  {
    id: 'ZH-NUM-02', title: '章节编号 · Chapter numbering',
    expect: '标题编号为"第一章""1.1""1.1.1"（第二级起用阿拉伯数字，正规形式）；另有一组"第1条""第2条"的合同条款编号。',
    build(doc, rand) {
      const id = doc.numbering.add([
        { fmt: 'chineseCounting', text: '第%1章', pStyle: 'Heading1', suff: 'space', ind: { left: 0, firstLine: 0 } },
        { fmt: 'decimal', text: '%1.%2', pStyle: 'Heading2', isLgl: true, suff: 'space', ind: { left: 0, firstLine: 0 } },
        { fmt: 'decimal', text: '%1.%2.%3', pStyle: 'Heading3', isLgl: true, suff: 'space', ind: { left: 0, firstLine: 0 } },
      ], { multi: 'multilevel' });
      doc.styles = zhStyles({ headingNum: id });
      for (const [l, text] of [[1, '绪论'], [2, '研究背景'], [3, '国内外现状'], [2, '研究内容'], [1, '方法'], [2, '测试文件']]) {
        doc.add(p(text, { style: `Heading${l}` }), p(zhParagraph(rand), { ind: indent2() }));
      }
      const clause = doc.numbering.add([{ fmt: 'decimal', text: '第%1条', suff: 'space', ind: { left: 0, firstLineChars: 200, firstLine: 420 } }]);
      for (let i = 0; i < 4; i++) doc.add(p(zhSentence(rand), { numPr: { id: clause } }));
    },
  },
  {
    id: 'ZH-NUM-03', title: '中文页码 · Page numbers',
    expect: '第 1–2 页页脚为"第 X 页 共 Y 页"；第 3–4 页为"— X —"（公文样式，从 1 重新编号）；第 5–6 页为"第一页""第二页"这样的中文数字页码。',
    build(doc, rand) {
      const foot = (content) => doc.footer(p(content, { style: 'Footer', jc: 'center' }));
      const f1 = foot([r('第 '), fld('PAGE', '1'), r(' 页 共 '), fld('NUMPAGES', '6'), r(' 页')]);
      const f2 = foot([r('— '), fld('PAGE', '1'), r(' —')]);
      const f3 = foot([r('第'), fld('PAGE', '一'), r('页')]);
      doc.add(...fill(rand, 18, { ind: indent2() }), p(zhParagraph(rand), { sectPr: sectPr({ ...ZH_SECT, footers: { default: f1 } }) }));
      doc.add(...fill(rand, 18, { ind: indent2() }), p(zhParagraph(rand), { sectPr: sectPr({ ...ZH_SECT, footers: { default: f2 }, type: 'nextPage', pgNumType: { start: 1 } }) }));
      doc.sect = { ...ZH_SECT, footers: { default: f3 }, type: 'nextPage', pgNumType: { fmt: 'chineseCounting', start: 1 } };
      doc.add(...fill(rand, 18, { ind: indent2() }));
    },
  },
  {
    id: 'ZH-NUM-04', title: '中文目录 · Table of contents',
    expect: '三级目录，点前导符：第一章 绪论 2，1.1 研究背景 2，1.2 研究内容 2，第二章 方法 3，2.1 测试文件 3，2.1.1 生成方式 3，第三章 结果 4，第四章 结论 5。',
    build(doc, rand) {
      const heads = [[1, '第一章 绪论', 2], [2, '1.1 研究背景', 2], [2, '1.2 研究内容', 2], [1, '第二章 方法', 3], [2, '2.1 测试文件', 3], [3, '2.1.1 生成方式', 3], [1, '第三章 结果', 4], [1, '第四章 结论', 5]]
        .map(([level, text, page], i) => ({ level, text, page, anchor: `_Toc${500 + i}` }));
      doc.add(p('目　录', { style: 'TOCHeading', jc: 'center' }), ...toc(heads, { width: 8306 }));
      for (const h of heads) {
        doc.add(p(bookmark(doc.nextBookmark(), h.anchor, r(h.text)), { style: `Heading${h.level}`, pageBreakBefore: h.level === 1 }));
        doc.add(p(zhParagraph(rand), { ind: indent2() }));
      }
    },
  },
  {
    id: 'ZH-NUM-05', title: '带章节号的题注和交叉引用 · Captions with chapter numbers',
    expect: '标题编号 1、2；题注依次为"图 1-1""图 1-2""表 2-1""图 2-1"；最后一段写着"如图 1-2 所示，表 2-1 列出了……"。更新域后不变。',
    async build(doc, rand) {
      const id = doc.numbering.add([{ fmt: 'decimal', text: '%1', pStyle: 'Heading1', suff: 'space', ind: { left: 0, firstLine: 0 } }]);
      doc.styles = zhStyles({ headingNum: id });
      const rId = doc.main.image(await image('picture', 'png'), 'png');
      const cap = (lab, ch, n, title, bm) =>
        p([bookmark(doc.nextBookmark(), bm, [r(`${lab} `), fld('STYLEREF 1 \\s', String(ch)), r('-'), fld(`SEQ ${lab} \\* ARABIC \\s 1`, String(n))].join('')), r(` ${title}`)], { style: 'Caption', jc: 'center' });
      const fig = (ch, n, title, bm) => [p(picture(doc, { rId, cx: cm(6), cy: cm(4.5), descr: title }), { jc: 'center', keepNext: true }), cap('图', ch, n, title, bm)];
      doc.add(p('绪论', { style: 'Heading1' }), p(zhParagraph(rand), { ind: indent2() }), ...fig(1, 1, '测试流程', '_Ref200000001'), ...fig(1, 2, '测试环境', '_Ref200000002'));
      doc.add(p('方法', { style: 'Heading1' }), cap('表', 2, 1, '测试用例', '_Ref200000003'));
      doc.add(table({ grid: [2768, 2769, 2769], jc: 'center', rows: [['编号', '名称', '结果'], ['1', '字体', '通过'], ['2', '段落', '通过']].map((row) => ({ cells: row.map((c) => ({ content: p(c, { jc: 'center' }) })) })) }));
      doc.add(...fig(2, 1, '测试结果', '_Ref200000004'));
      doc.add(p([r('如'), fld('REF _Ref200000002 \\h', '图 1-2'), r('所示，'), fld('REF _Ref200000003 \\h', '表 2-1'), r(`列出了全部用例。${zhSentence(rand)}`)], { ind: indent2() }));
    },
  },
  {
    id: 'ZH-NUM-06', title: '中文日期域 · Chinese date fields',
    expect: '域结果（缓存）为"2026年10月17日"和"星期六"；更新域后变为当天日期。',
    build(doc) {
      doc.add(
        p([label('日期'), fld('DATE \\@ "yyyy年M月d日"', '2026年10月17日')]),
        p([label('星期'), fld('DATE \\@ "dddd"', '星期六', { lang: { val: 'zh-CN', eastAsia: 'zh-CN' } })]),
      );
    },
  },

  // ---- ASN ----
  {
    id: 'ZH-ASN-01', title: '拼音指南 · Phonetic guide',
    expect: '"汉字拼音排版测试"每个字上方有拼音（hàn zì pīn yīn pái bǎn cè shì）；第二行拼音居中对齐，第三行左对齐。拼音字号 5 磅，行高随之增加。',
    build(doc) {
      const ruby = (base, rt, align = 'distributeSpace') =>
        `<w:r><w:ruby><w:rubyPr><w:rubyAlign w:val="${align}"/><w:hps w:val="10"/><w:hpsRaise w:val="20"/><w:hpsBaseText w:val="21"/><w:lid w:val="zh-CN"/></w:rubyPr>` +
        `<w:rt>${r(rt, { fonts: { hint: 'eastAsia' }, sz: 5 })}</w:rt><w:rubyBase>${r(base, { fonts: { hint: 'eastAsia' } })}</w:rubyBase></w:ruby></w:r>`;
      const pairs = [['汉', 'hàn'], ['字', 'zì'], ['拼', 'pīn'], ['音', 'yīn'], ['排', 'pái'], ['版', 'bǎn'], ['测', 'cè'], ['试', 'shì']];
      for (const align of ['distributeSpace', 'center', 'left']) doc.add(p([label(align), ...pairs.map(([b, t]) => ruby(b, t, align))]));
    },
  },
  {
    id: 'ZH-ASN-02', title: '带圈字符 · Enclosed characters',
    expect: '"优"在圆圈里，"甲"在方框里，"1"在三角里，"秘"在菱形里。前两个是"缩小文字"，后两个是"增大圈号"。',
    build(doc) {
      const enclose = (shape, ch, mode) => {
        const shapeRun = mode === 'grow' ? { fonts: { ea: '宋体' }, position: -4, sz: 15.5 } : { fonts: { ea: '宋体' } };
        const charRun = mode === 'grow' ? {} : { position: 3, sz: 7.5 };
        return (
          rx('<w:fldChar w:fldCharType="begin"/>') + rx('<w:instrText xml:space="preserve">eq \\o\\ac(</w:instrText>') +
          rx(`<w:instrText>${shape}</w:instrText>`, shapeRun) + rx('<w:instrText>,</w:instrText>') +
          rx(`<w:instrText>${ch}</w:instrText>`, charRun) + rx('<w:instrText>)</w:instrText>') + rx('<w:fldChar w:fldCharType="end"/>')
        );
      };
      doc.add(p([r('缩小文字：'), enclose('○', '优', 'shrink'), r(' '), enclose('□', '甲', 'shrink')]));
      doc.add(p([r('增大圈号：'), enclose('△', '1', 'grow'), r(' '), enclose('◇', '秘', 'grow')]));
    },
  },
  {
    id: 'ZH-ASN-03', title: '竖排文字 · Vertical text',
    expect: '第 1 页横排，表格第一列文字竖排。第 2 页整节竖排：从右往左一列一列排，汉字直立，英文和数字横躺，标点在字的右上方。',
    build(doc, rand) {
      doc.add(p(zhParagraph(rand), { ind: indent2() }));
      doc.add(table({ grid: [800, 7506], rows: [{ height: { val: 1800, rule: 'atLeast' }, cells: [{ content: '竖排单元格', textDirection: 'tbRl' }, { content: zhParagraph(rand) }] }] }));
      doc.add(p('下一页是竖排的一节。', { sectPr: sectPr({ ...ZH_SECT }) }));
      doc.sect = { ...ZH_SECT, type: 'nextPage', textDirection: 'tbRl' };
      doc.add(p('竖排的标题', { style: 'Heading1' }));
      doc.add(...fill(rand, 3, { ind: indent2() }), p('其中有英文 WordCraft、数字 2026 和标点：“引号”、（括号）、书名号《文字处理》。', { ind: indent2() }));
    },
  },
  {
    id: 'ZH-ASN-04', title: '双行合一、合并字符和纵横混排 · Combined lines, combined characters, horizontal in vertical',
    expect: '第 1 页："第一行第二行"排成括号里的上下两行；"合并字符"四个字合成一个字的宽度。第 2 页竖排，"12"和"2026"横着排在竖行里。开发者说这部分不支持：重点看保存后是否保留。',
    build(doc, rand) {
      doc.add(p([r('双行合一：'), r('第一行第二行', { eastAsianLayout: { id: 1, combine: 1, combineBrackets: 'round' } }), r(`。${zhSentence(rand)}`)]));
      const combine =
        rx('<w:fldChar w:fldCharType="begin"/>') + rx('<w:instrText xml:space="preserve">eq \\o(\\s\\up 5(</w:instrText>', { sz: 5 }) +
        rx('<w:instrText>合并</w:instrText>', { sz: 5 }) + rx('<w:instrText>),\\s\\do 2(</w:instrText>', { sz: 5 }) +
        rx('<w:instrText>字符</w:instrText>', { sz: 5 }) + rx('<w:instrText>))</w:instrText>', { sz: 5 }) + rx('<w:fldChar w:fldCharType="end"/>');
      doc.add(p([r('合并字符：'), combine, r(`。${zhSentence(rand)}`)], { sectPr: sectPr({ ...ZH_SECT }) }));
      doc.sect = { ...ZH_SECT, type: 'nextPage', textDirection: 'tbRl' };
      doc.add(p([r('纵横混排：第'), r('12', { eastAsianLayout: { id: 2, vert: 1 } }), r('章写于'), r('2026', { eastAsianLayout: { id: 3, vert: 1, vertCompress: 1 } }), r(`年。${zhSentence(rand)}`)]));
    },
  },
  {
    id: 'ZH-ASN-05', title: '着重号 · Emphasis marks',
    expect: '"重点内容"四个字下面各有一个点。',
    build(doc, rand) {
      doc.add(p([r(zhSentence(rand).slice(0, 10)), r('重点内容', { em: 'dot' }), r(zhSentence(rand))], { ind: indent2() }));
    },
  },

  // ---- TBL ----
  {
    id: 'ZH-TBL-01', title: '中文表格（课表） · Timetable',
    expect: '居中的课表：左上角斜线表头（右上"星期"、左下"节次"）；"上午""下午"各合并两行并竖排；标题行跨页重复；备注单元格首行缩进 2 字符。',
    build(doc, rand) {
      const days = ['星期一', '星期二', '星期三', '星期四', '星期五'];
      const courses = ['语文', '数学', '英语', '物理', '化学', '历史', '地理', '生物'];
      const grid = [700, 1100, 1300, 1301, 1301, 1301, 1302];
      const c = (text, o = {}) => ({ content: p(text, { jc: 'center', spacing: { after: 0 } }), vAlign: 'center', ...o });
      const head = {
        header: true,
        height: { val: 700, rule: 'atLeast' },
        cells: [
          { content: [p('星期', { jc: 'right' }), p('节次')].join(''), borders: { tl2br: { sz: 4 } }, span: 2, shd: 'E7E6E6' },
          ...days.map((d) => c(d, { shd: 'E7E6E6' })),
        ],
      };
      const rows = [head];
      for (const [half, start] of [['上午', 1], ['下午', 3]]) {
        for (let k = 0; k < 2; k++) {
          const lesson = start + k;
          rows.push({
            height: { val: 600, rule: 'atLeast' },
            cells: [
              k === 0 ? c(half, { vMerge: 'restart', textDirection: 'tbRl' }) : { vMerge: true },
              c(`第${lesson}节`),
              ...days.map(() => c(courses[Math.floor(rand() * courses.length)])),
            ],
          });
        }
      }
      rows.push({ cells: [c('备注', { span: 2 }), { content: p(zhParagraph(rand), { ind: indent2() }), span: 5 }] });
      doc.add(p('课程表', { jc: 'center', rPr: { sz: 16 } }), table({ grid, jc: 'center', rows }), p(''));
    },
  },

  // ---- DOC ----
  {
    id: 'ZH-DOC-01', title: '公文（GB/T 9704-2012 格式） · Official document',
    expect: '版心 156 × 225 mm；正文三号仿宋，每面 22 行、每行 28 字；红色发文机关标志和红色分隔线；标题二号小标宋；一级标题黑体、二级楷体；页码"— 1 —"四号宋体，单页居右空一字、双页居左空一字；最后有版记。',
    setup: (doc) => zhSetup(doc, { grid: 'gongwen' }),
    banner: { snap: false },
    build(doc, rand) {
      const FS = { fonts: { latin: '仿宋_GB2312', ea: '仿宋_GB2312' } };
      const body = (text) => p(r(text, FS), { ind: indent2(16) });
      doc.styles = zhStyles({ ea: '仿宋_GB2312', latin: 'Times New Roman', sz: 16 });
      doc.settings.evenAndOddHeaders = true;
      const pageNo = (jc, ind) => p([r('— ', { fonts: { latin: '宋体', ea: '宋体' }, sz: 14 }), fld('PAGE', '1', { fonts: { latin: '宋体', ea: '宋体' }, sz: 14 }), r(' —', { fonts: { latin: '宋体', ea: '宋体' }, sz: 14 })], { style: 'Footer', jc, ind, snapToGrid: false });
      doc.sect = { ...GW_SECT, footers: { default: doc.footer(pageNo('right', { right: 280 })), even: doc.footer(pageNo('left', { left: 280 })) } };
      doc.add(p(r('测试单位文件', { fonts: { latin: '方正小标宋简体', ea: '方正小标宋简体' }, sz: 36, color: 'FF0000', spacing: 40 }), { jc: 'center', spacing: { before: 600 } }));
      doc.add(p(''), p(r('测文〔2026〕1号', FS), { jc: 'center', pBdr: { bottom: { sz: 18, space: 8, color: 'FF0000' } } }));
      doc.add(p(''), p(r('关于开展文字处理软件兼容性测试的通知', { fonts: { latin: '方正小标宋简体', ea: '方正小标宋简体' }, sz: 22 }), { jc: 'center' }), p(''));
      doc.add(p(r('各有关单位：', FS)));
      doc.add(body(zhParagraph(rand)), body(zhParagraph(rand)));
      const h1 = (text) => p(r(text, { fonts: { latin: '黑体', ea: '黑体' } }), { ind: indent2(16) });
      const h2 = (text) => p(r(text, { fonts: { latin: '楷体_GB2312', ea: '楷体_GB2312' } }), { ind: indent2(16) });
      doc.add(h1('一、测试目的'), body(zhParagraph(rand)), h1('二、测试内容'), h2('（一）测试范围'), body(zhParagraph(rand)));
      doc.add(h2('（二）测试方法'), body(`1. ${zhSentence(rand)}`), body(`2. ${zhSentence(rand)}`), body(`（1）${zhSentence(rand)}`), body(`（2）${zhSentence(rand)}`));
      doc.add(h1('三、工作要求'), body(zhParagraph(rand)), body(zhParagraph(rand)), body(zhParagraph(rand)));
      doc.add(p(''), body('附件：1. 测试用例清单'), p(r('2. 测试记录模板', FS), { ind: { leftChars: 500, left: 1600 } }), p(''), p(''));
      doc.add(p(r('测试单位', FS), { jc: 'right', ind: { rightChars: 600, right: 1920 } }), p(r('2026年10月17日', FS), { jc: 'right', ind: { rightChars: 400, right: 1280 } }));
      doc.add(p(r('（此件公开发布）', FS), { ind: indent2(16) }), p(pageBreak()));
      const S14 = { fonts: { latin: '仿宋_GB2312', ea: '仿宋_GB2312' }, sz: 14 };
      doc.add(p(r('抄送：测试一组，测试二组。', S14), { ind: { left: 280, right: 280 }, pBdr: { top: { sz: 8, space: 1 }, bottom: { sz: 6, space: 1 } } }));
      doc.add(p([r('测试单位办公室', S14), r('\t'), r('2026年10月17日印发', S14)], { ind: { left: 280, right: 280 }, tabs: [{ val: 'right', pos: 8565 }], pBdr: { bottom: { sz: 8, space: 1 } } }));
    },
  },
  {
    id: 'ZH-DOC-02', title: '学位论文结构 · Thesis',
    expect: '封面无页码；摘要、Abstract 和目录用罗马数字页码 I、II、III；正文从 1 开始。偶数页页眉"示例大学硕士学位论文"，奇数页页眉是当前章的编号和标题；章标题"1 绪论"另起一页居中；图题注在图下、表题注在表上，带章节号；脚注是①②，每页重新编号；参考文献编号 [1]–[5]。基准步骤：在 Word 中更新目录后再保存。',
    async build(doc, rand) {
      const heads = doc.numbering.add([
        { fmt: 'decimal', text: '%1', pStyle: 'Heading1', suff: 'space', ind: { left: 0, firstLine: 0 } },
        { fmt: 'decimal', text: '%1.%2', pStyle: 'Heading2', suff: 'space', ind: { left: 0, firstLine: 0 } },
        { fmt: 'decimal', text: '%1.%2.%3', pStyle: 'Heading3', suff: 'space', ind: { left: 0, firstLine: 0 } },
      ], { multi: 'multilevel' });
      const refs = doc.numbering.add([{ fmt: 'decimal', text: '[%1]', ind: { left: 480, hanging: 480 } }]);
      doc.styles = zhStyles({
        sz: 12,
        headingNum: heads,
        spacing: { line: 400, lineRule: 'exact' },
        extra: pStyle('AbstractTitle', '摘要标题', { ui: 20, pPr: { jc: 'center', spacing: { before: 240, after: 240 } }, rPr: { fonts: { latin: 'Times New Roman', ea: '黑体' }, sz: 16 } }),
      })
        .replace(/(<w:style w:type="paragraph" w:styleId="Heading1">[\s\S]*?<w:keepLines\/>)/, '$1<w:pageBreakBefore/>')
        .replace('<w:outlineLvl w:val="0"/>', '<w:jc w:val="center"/><w:outlineLvl w:val="0"/>');
      doc.settings.evenAndOddHeaders = true;
      doc.settings.footnoteFmt = '<w:numFmt w:val="decimalEnclosedCircleChinese"/><w:numRestart w:val="eachPage"/>';
      const M = { top: 1418, bottom: 1418, left: 1701, right: 1418, header: 851, footer: 992 };
      const grid = { type: 'lines', linePitch: 400 };
      const ind = indent2(12);
      const evenHeader = doc.header(p('示例大学硕士学位论文', { style: 'Header', jc: 'center', pBdr: { bottom: { sz: 4, space: 1 } } }));
      const pageFooter = doc.footer(p(fld('PAGE', '1'), { style: 'Footer', jc: 'center' }));

      // Cover
      doc.add(p(''), p(r('示例大学', { sz: 26, fonts: { ea: '黑体' } }), { jc: 'center', spacing: { before: 1200 } }), p(r('硕士学位论文', { sz: 22, fonts: { ea: '黑体' } }), { jc: 'center' }));
      doc.add(p(''), p(''), p(r('文字处理软件的文档兼容性研究', { sz: 18, fonts: { ea: '黑体' } }), { jc: 'center' }), p(''), p(''));
      const info = [['作者姓名', '张　三'], ['指导教师', '李　四　教授'], ['学科专业', '计算机应用技术'], ['完成日期', '2026年10月']];
      doc.add(table({ grid: [2000, 3500], jc: 'center', style: null, look: false, rows: info.map(([k, v]) => ({ cells: [{ content: p(r(k, { sz: 14 }), { jc: 'distribute' }) }, { content: p(r(v, { sz: 14 }), { jc: 'center' }), borders: { bottom: { sz: 4 } } }] })) }));
      doc.add(p('', { sectPr: sectPr({ margins: M, docGrid: grid, titlePg: true }) }));

      // Front matter
      doc.add(p('摘　要', { style: 'AbstractTitle' }), ...fill(rand, 3, { ind }), p([r('关键词：', { fonts: { ea: '黑体' } }), r('文档格式；兼容性；排版；文字处理软件')]));
      doc.add(p(r('Abstract', { b: true }), { style: 'AbstractTitle', pageBreakBefore: true }), p(enParagraph(rand, 6), { ind }), p(enParagraph(rand, 5), { ind }), p([r('Key words: ', { b: true }), r('document format; compatibility; typesetting; word processor')]));
      const chapters = [
        ['绪论', [['研究背景', []], ['研究内容', ['测试文件']]]],
        ['方法', [['测试环境', []], ['测试步骤', ['判定标准']]]],
        ['结果', [['显示效果', []], ['往返保存', []]]],
        ['结论', [['主要结论', []], ['不足与展望', []]]],
      ];
      const entries = [];
      let page = 1;
      chapters.forEach(([title, subs], i) => {
        entries.push({ level: 1, text: `${i + 1} ${title}`, page, anchor: `_Toc${600 + entries.length}` });
        subs.forEach(([s, subsubs], j) => {
          entries.push({ level: 2, text: `${i + 1}.${j + 1} ${s}`, page, anchor: `_Toc${600 + entries.length}` });
          subsubs.forEach((ss) => entries.push({ level: 3, text: `${i + 1}.${j + 1}.1 ${ss}`, page: page + 1, anchor: `_Toc${600 + entries.length}` }));
        });
        page += 3;
      });
      entries.push({ level: 1, text: '参考文献', page, anchor: '_Toc690' }, { level: 1, text: '致　谢', page: page + 1, anchor: '_Toc691' });
      doc.add(p('目　录', { style: 'AbstractTitle', pageBreakBefore: true }), ...toc(entries, { width: 8787 }));
      doc.add(p('', { sectPr: sectPr({ margins: M, docGrid: grid, type: 'nextPage', pgNumType: { fmt: 'upperRoman', start: 1 }, headers: { default: evenHeader, even: evenHeader }, footers: { default: pageFooter, even: pageFooter } }) }));

      // Body
      const oddHeader = doc.header(p([fld('STYLEREF "Heading 1" \\n', '1'), r(' '), fld('STYLEREF "Heading 1"', '绪论')], { style: 'Header', jc: 'center', pBdr: { bottom: { sz: 4, space: 1 } } }));
      const rId = doc.main.image(await image('picture', 'png', { variant: 2 }), 'png');
      let e = 0;
      for (const [i, [title, subs]] of chapters.entries()) {
        const ch = i + 1;
        doc.add(p(bookmark(doc.nextBookmark(), entries[e++].anchor, r(title)), { style: 'Heading1' }));
        doc.add(p([r(zhParagraph(rand)), doc.footnote(zhSentence(rand))], { ind }), p(zhParagraph(rand), { ind }));
        for (const [j, [s, subsubs]] of subs.entries()) {
          doc.add(p(bookmark(doc.nextBookmark(), entries[e++].anchor, r(s)), { style: 'Heading2' }), ...fill(rand, 2, { ind }));
          if (j === 0 && ch <= 3) {
            doc.add(p(picture(doc, { rId, cx: cm(8), cy: cm(6), descr: `图 ${ch}-1` }), { jc: 'center', keepNext: true }));
            doc.add(p([r('图 '), fld('STYLEREF 1 \\s', String(ch)), r('-'), fld('SEQ 图 \\* ARABIC \\s 1', '1'), r(` ${title}示意图`)], { style: 'Caption', jc: 'center' }));
          }
          if (j === 1 && ch <= 3) {
            doc.add(p([r('表 '), fld('STYLEREF 1 \\s', String(ch)), r('-'), fld('SEQ 表 \\* ARABIC \\s 1', '1'), r(` ${title}数据`)], { style: 'Caption', jc: 'center', keepNext: true }));
            doc.add(table({ grid: [2000, 2000, 2000], jc: 'center', rows: [['项目', '数量', '比例'], ['通过', '42', '75%'], ['差异', '10', '18%'], ['失败', '4', '7%']].map((row, k) => ({ header: k === 0, cells: row.map((c) => ({ content: p(c, { jc: 'center', spacing: { line: 300, lineRule: 'exact' } }) })) })) }));
            doc.add(p(zhParagraph(rand), { ind }));
          }
          for (const ss of subsubs) doc.add(p(bookmark(doc.nextBookmark(), entries[e++].anchor, r(ss)), { style: 'Heading3' }), ...fill(rand, 2, { ind }));
        }
      }
      doc.add(p(bookmark(doc.nextBookmark(), '_Toc690', r('参考文献')), { style: 'Heading1', numPr: { id: 0 } }));
      const sample = ['张三, 李四. 示例文档格式兼容性研究[J]. 示例学报, 2025, 12(3): 45-52.', '王五. 示例文字处理软件设计[M]. 北京: 示例出版社, 2024.', 'Smith A, Brown B. An example study of document layout[J]. Example Journal, 2023, 8(2): 10-20.', '赵六. 示例排版规则的实现[D]. 示例市: 示例大学, 2022.', 'Example Organization. Example file format specification[S]. 2021.'];
      for (const s of sample) doc.add(p(s, { numPr: { id: refs }, spacing: { line: 300, lineRule: 'exact' } }));
      doc.add(p(bookmark(doc.nextBookmark(), '_Toc691', r('致　谢')), { style: 'Heading1', numPr: { id: 0 } }), ...fill(rand, 2, { ind }));
      doc.sect = { margins: M, docGrid: grid, type: 'nextPage', pgNumType: { start: 1 }, footnotePr: '<w:numFmt w:val="decimalEnclosedCircleChinese"/><w:numRestart w:val="eachPage"/>', headers: { default: oddHeader, even: evenHeader }, footers: { default: pageFooter, even: pageFooter } };
    },
    setup: (doc) => zhSetup(doc),
  },
];

/** Chinese text for the 300-page performance document. */
export const zhFiller = (seed, chars) => zhParagraphs(rng(seed), chars);
