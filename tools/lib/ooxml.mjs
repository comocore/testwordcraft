// Small builders for WordprocessingML.
// Child elements are written in schema order: Word reports "unreadable content" for some out-of-order children.

import { zip } from './zip.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `w:${k}="${esc(v)}"`)
    .join(' ');

const onoff = (name) => (v) => (v === false ? `<w:${name} w:val="0"/>` : `<w:${name}/>`);

export const EMU_PER_CM = 360000;
export const cm = (n) => Math.round(n * EMU_PER_CM);
/** Twentieths of a point. */
export const tw = { cm: (n) => Math.round((n / 2.54) * 1440), mm: (n) => Math.round((n / 25.4) * 1440), pt: (n) => n * 20 };

export const PAGE = {
  A4: { w: 11906, h: 16838 },
  A4L: { w: 16838, h: 11906, orient: 'landscape' },
  LETTER: { w: 12240, h: 15840 },
};

const NS = {
  w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
  r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  pic: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
  m: 'http://schemas.openxmlformats.org/officeDocument/2006/math',
  mc: 'http://schemas.openxmlformats.org/markup-compatibility/2006',
  w14: 'http://schemas.microsoft.com/office/word/2010/wordml',
  wp14: 'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing',
};
const ROOT_NS = `${Object.entries(NS).map(([k, v]) => `xmlns:${k}="${v}"`).join(' ')} mc:Ignorable="w14 wp14"`;
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const CT = 'application/vnd.openxmlformats-officedocument.wordprocessingml';

// ---- runs and paragraphs ----

function rFonts(v) {
  if (typeof v === 'string') return `<w:rFonts w:ascii="${esc(v)}" w:hAnsi="${esc(v)}" w:cs="${esc(v)}"/>`;
  const a = {};
  if (v.latin) a.ascii = a.hAnsi = v.latin;
  if (v.ea) a.eastAsia = v.ea;
  if (v.cs) a.cs = v.cs;
  if (v.hint) a.hint = v.hint;
  return `<w:rFonts ${attrs(a)}/>`;
}

const RPR = [
  ['style', (v) => `<w:rStyle w:val="${v}"/>`],
  ['fonts', rFonts],
  ['b', onoff('b')], ['bCs', onoff('bCs')], ['i', onoff('i')], ['iCs', onoff('iCs')],
  ['caps', onoff('caps')], ['smallCaps', onoff('smallCaps')], ['strike', onoff('strike')], ['dstrike', onoff('dstrike')],
  ['outline', onoff('outline')], ['shadow', onoff('shadow')], ['emboss', onoff('emboss')], ['imprint', onoff('imprint')],
  ['noProof', onoff('noProof')], ['snapToGrid', onoff('snapToGrid')], ['vanish', onoff('vanish')],
  ['color', (v) => `<w:color w:val="${v}"/>`],
  ['spacing', (v) => `<w:spacing w:val="${v}"/>`],
  ['scale', (v) => `<w:w w:val="${v}"/>`],
  ['kern', (v) => `<w:kern w:val="${v}"/>`],
  ['position', (v) => `<w:position w:val="${v}"/>`],
  ['sz', (v) => `<w:sz w:val="${Math.round(v * 2)}"/><w:szCs w:val="${Math.round(v * 2)}"/>`],
  ['highlight', (v) => `<w:highlight w:val="${v}"/>`],
  ['u', (v) => (typeof v === 'string' ? `<w:u w:val="${v}"/>` : `<w:u ${attrs(v)}/>`)],
  ['bdr', (v) => `<w:bdr w:val="single" w:sz="4" w:space="0" w:color="${v === true ? 'auto' : v}"/>`],
  ['shd', (v) => `<w:shd w:val="clear" w:color="auto" w:fill="${v}"/>`],
  ['vertAlign', (v) => `<w:vertAlign w:val="${v}"/>`],
  ['rtl', onoff('rtl')], ['cs', onoff('cs')],
  ['em', (v) => `<w:em w:val="${v}"/>`],
  ['lang', (v) => (typeof v === 'string' ? `<w:lang w:val="${v}"/>` : `<w:lang ${attrs(v)}/>`)],
  ['eastAsianLayout', (v) => `<w:eastAsianLayout ${attrs(v)}/>`],
  // Already-ordered extras that belong at the end: w14 effects, then rPrChange.
  ['raw', (v) => v],
];

export const rPrInner = (o) => RPR.filter(([k]) => o[k] !== undefined).map(([k, f]) => f(o[k])).join('');
export const rPr = (o) => (o ? `<w:rPr>${rPrInner(o)}</w:rPr>` : '');

/** Text with \t and \n turned into tabs and line breaks. */
export function t(text) {
  return String(text)
    .split(/(\t|\n)/)
    .filter((s) => s !== '')
    .map((s) => (s === '\t' ? '<w:tab/>' : s === '\n' ? '<w:br/>' : `<w:t xml:space="preserve">${esc(s)}</w:t>`))
    .join('');
}

/** A run of text. */
export const r = (text, o) => `<w:r>${rPr(o)}${t(text)}</w:r>`;
/** A run with raw content, such as <w:tab/> or <w:footnoteReference/>. */
export const rx = (inner, o) => `<w:r>${rPr(o)}${inner}</w:r>`;
export const pageBreak = () => '<w:r><w:br w:type="page"/></w:r>';
export const columnBreak = () => '<w:r><w:br w:type="column"/></w:r>';

const PPR = [
  ['style', (v) => `<w:pStyle w:val="${v}"/>`],
  ['keepNext', onoff('keepNext')], ['keepLines', onoff('keepLines')], ['pageBreakBefore', onoff('pageBreakBefore')],
  ['framePr', (v) => `<w:framePr ${attrs(v)}/>`],
  ['widowControl', onoff('widowControl')],
  ['numPr', (v) => `<w:numPr><w:ilvl w:val="${v.lvl ?? 0}"/><w:numId w:val="${v.id}"/></w:numPr>`],
  ['suppressLineNumbers', onoff('suppressLineNumbers')],
  ['pBdr', (v) => (typeof v === 'string' ? v : borders('pBdr', v))],
  ['shd', (v) => `<w:shd w:val="clear" w:color="auto" w:fill="${v}"/>`],
  ['tabs', (v) => `<w:tabs>${v.map((x) => `<w:tab ${attrs({ val: x.val, leader: x.leader, pos: x.pos })}/>`).join('')}</w:tabs>`],
  ['suppressAutoHyphens', onoff('suppressAutoHyphens')],
  ['kinsoku', onoff('kinsoku')], ['wordWrap', onoff('wordWrap')], ['overflowPunct', onoff('overflowPunct')],
  ['topLinePunct', onoff('topLinePunct')], ['autoSpaceDE', onoff('autoSpaceDE')], ['autoSpaceDN', onoff('autoSpaceDN')],
  ['bidi', onoff('bidi')], ['adjustRightInd', onoff('adjustRightInd')], ['snapToGrid', onoff('snapToGrid')],
  ['spacing', (v) => `<w:spacing ${attrs(v)}/>`],
  ['ind', (v) => `<w:ind ${attrs(v)}/>`],
  ['contextualSpacing', onoff('contextualSpacing')], ['mirrorIndents', onoff('mirrorIndents')],
  ['jc', (v) => `<w:jc w:val="${v}"/>`],
  ['textDirection', (v) => `<w:textDirection w:val="${v}"/>`],
  ['textAlignment', (v) => `<w:textAlignment w:val="${v}"/>`],
  ['outlineLvl', (v) => `<w:outlineLvl w:val="${v}"/>`],
  // The paragraph mark's run properties: raw XML (it may start with <w:ins/>) or an rPr object.
  ['rPr', (v) => (typeof v === 'string' ? `<w:rPr>${v}</w:rPr>` : rPr(v))],
  ['sectPr', (v) => v],
  ['pPrChange', (v) => v],
];

export const pPrInner = (o) => PPR.filter(([k]) => o[k] !== undefined).map(([k, f]) => f(o[k])).join('');

/** A paragraph. `content` is a string of runs, an array of them, or plain text when it doesn't start with "<". */
export function p(content = '', o) {
  const body = Array.isArray(content) ? content.join('') : content.startsWith('<') ? content : content ? r(content) : '';
  return `<w:p>${o ? `<w:pPr>${pPrInner(o)}</w:pPr>` : ''}${body}</w:p>`;
}

/** Border elements in schema order, from { top, left, bottom, right, between, insideH, insideV, tl2br, tr2bl }. */
export function borders(tag, spec) {
  const order = ['top', 'left', 'bottom', 'right', 'between', 'bar', 'insideH', 'insideV', 'tl2br', 'tr2bl'];
  const one = (side, b) =>
    `<w:${side} ${attrs({ val: b.val ?? 'single', sz: b.sz ?? 4, space: b.space ?? 0, color: b.color ?? 'auto' })}/>`;
  const all = spec.all ? Object.fromEntries(['top', 'left', 'bottom', 'right'].map((s) => [s, spec.all])) : {};
  const merged = { ...all, ...spec };
  return `<w:${tag}>${order.filter((s) => merged[s]).map((s) => one(s, merged[s])).join('')}</w:${tag}>`;
}

/** A complex field: begin, instruction, separate, cached result, end. */
export function fld(instr, result = '', o) {
  const res = result.startsWith?.('<') ? result : result ? r(result, o) : '';
  return (
    rx('<w:fldChar w:fldCharType="begin"/>', o) +
    rx(`<w:instrText xml:space="preserve"> ${esc(instr)} </w:instrText>`, o) +
    rx('<w:fldChar w:fldCharType="separate"/>', o) +
    res +
    rx('<w:fldChar w:fldCharType="end"/>', o)
  );
}

export const bookmark = (id, name, inner) =>
  `<w:bookmarkStart w:id="${id}" w:name="${esc(name)}"/>${inner}<w:bookmarkEnd w:id="${id}"/>`;

// ---- tables ----

/**
 * A table. rows: [{ cells: [{ content, w, span, vMerge, shd, vAlign, borders, textDirection, noWrap, mar }], header, height, cantSplit }]
 */
export function table({ grid, rows, style = 'TableGrid', width, layout, jc, tblpPr, bidi, borders: tb, cellMar, look = true, caption }) {
  const tblPr = [
    style && `<w:tblStyle w:val="${style}"/>`,
    tblpPr && `<w:tblpPr ${attrs(tblpPr)}/>`,
    tblpPr && '<w:tblOverlap w:val="never"/>',
    bidi && '<w:bidiVisual/>',
    width ? `<w:tblW w:w="${width.w}" w:type="${width.type}"/>` : '<w:tblW w:w="0" w:type="auto"/>',
    jc && `<w:jc w:val="${jc}"/>`,
    tb && borders('tblBorders', tb),
    layout && `<w:tblLayout w:type="${layout}"/>`,
    cellMar && `<w:tblCellMar>${['top', 'left', 'bottom', 'right'].filter((s) => cellMar[s] !== undefined).map((s) => `<w:${s} w:w="${cellMar[s]}" w:type="dxa"/>`).join('')}</w:tblCellMar>`,
    look && '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>',
    caption && `<w:tblCaption w:val="${esc(caption.title)}"/>`,
    caption?.description && `<w:tblDescription w:val="${esc(caption.description)}"/>`,
  ].filter(Boolean).join('');
  const gridXml = `<w:tblGrid>${grid.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
  const rowsXml = rows.map((row) => {
    const trPr = [
      row.cantSplit && '<w:cantSplit/>',
      row.height && `<w:trHeight w:val="${row.height.val}"${row.height.rule ? ` w:hRule="${row.height.rule}"` : ''}/>`,
      row.header && '<w:tblHeader/>',
    ].filter(Boolean).join('');
    let col = 0;
    const cells = row.cells.map((c) => {
      const span = c.span ?? 1;
      const w = c.w ?? grid.slice(col, col + span).reduce((a, b) => a + b, 0);
      col += span;
      const tcPr = [
        `<w:tcW w:w="${w}" w:type="${c.wType ?? 'dxa'}"/>`,
        span > 1 && `<w:gridSpan w:val="${span}"/>`,
        c.vMerge && (c.vMerge === 'restart' ? '<w:vMerge w:val="restart"/>' : '<w:vMerge/>'),
        c.borders && borders('tcBorders', c.borders),
        c.shd && `<w:shd w:val="clear" w:color="auto" w:fill="${c.shd}"/>`,
        c.noWrap && '<w:noWrap/>',
        c.mar && `<w:tcMar>${['top', 'left', 'bottom', 'right'].filter((s) => c.mar[s] !== undefined).map((s) => `<w:${s} w:w="${c.mar[s]}" w:type="dxa"/>`).join('')}</w:tcMar>`,
        c.textDirection && `<w:textDirection w:val="${c.textDirection}"/>`,
        c.vAlign && `<w:vAlign w:val="${c.vAlign}"/>`,
      ].filter(Boolean).join('');
      const s = c.content === undefined ? '' : String(c.content);
      // A cell holds paragraphs and tables and must end with a paragraph.
      let content = /^<w:(p|tbl)[ >]/.test(s) ? s : p(s);
      if (content.endsWith('</w:tbl>')) content += '<w:p/>';
      return `<w:tc><w:tcPr>${tcPr}</w:tcPr>${content}</w:tc>`;
    }).join('');
    return `<w:tr>${trPr ? `<w:trPr>${trPr}</w:trPr>` : ''}${cells}</w:tr>`;
  }).join('');
  return `<w:tbl><w:tblPr>${tblPr}</w:tblPr>${gridXml}${rowsXml}</w:tbl>`;
}

// ---- sections ----

export function sectPr(o = {}) {
  const parts = [];
  for (const [type, id] of Object.entries(o.headers ?? {})) parts.push(`<w:headerReference w:type="${type}" r:id="${id}"/>`);
  for (const [type, id] of Object.entries(o.footers ?? {})) parts.push(`<w:footerReference w:type="${type}" r:id="${id}"/>`);
  if (o.footnotePr) parts.push(`<w:footnotePr>${o.footnotePr}</w:footnotePr>`);
  if (o.endnotePr) parts.push(`<w:endnotePr>${o.endnotePr}</w:endnotePr>`);
  if (o.type) parts.push(`<w:type w:val="${o.type}"/>`);
  const pg = o.page ?? PAGE.A4;
  parts.push(`<w:pgSz w:w="${pg.w}" w:h="${pg.h}"${pg.orient ? ` w:orient="${pg.orient}"` : ''}/>`);
  const m = { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 708, footer: 708, gutter: 0, ...o.margins };
  parts.push(`<w:pgMar ${attrs(m)}/>`);
  if (o.pgBorders) parts.push(o.pgBorders);
  if (o.lnNumType) parts.push(`<w:lnNumType ${attrs(o.lnNumType)}/>`);
  if (o.pgNumType) parts.push(`<w:pgNumType ${attrs(o.pgNumType)}/>`);
  parts.push(o.cols ?? '<w:cols w:space="708"/>');
  if (o.vAlign) parts.push(`<w:vAlign w:val="${o.vAlign}"/>`);
  if (o.titlePg) parts.push('<w:titlePg/>');
  if (o.textDirection) parts.push(`<w:textDirection w:val="${o.textDirection}"/>`);
  if (o.bidi) parts.push('<w:bidi/>');
  parts.push(o.docGrid ? `<w:docGrid ${attrs(o.docGrid)}/>` : '<w:docGrid w:linePitch="360"/>');
  return `<w:sectPr>${parts.join('')}</w:sectPr>`;
}

/** The width of the text area of a section, in twentieths of a point. */
export const textWidth = (o = {}) => (o.page ?? PAGE.A4).w - (o.margins?.left ?? 1440) - (o.margins?.right ?? 1440);

// ---- parts with relationships ----

class Part {
  constructor(doc, name) {
    this.doc = doc;
    this.name = name;
    this.rels = [];
  }

  rel(type, target, external = false) {
    const id = `rId${this.rels.length + 1}`;
    this.rels.push({ id, type: `${REL}/${type}`, target, external });
    return id;
  }

  image(data, ext) {
    const n = this.doc.media.length + 1;
    const file = `image${n}.${ext}`;
    this.doc.media.push({ name: `word/media/${file}`, data });
    return this.rel('image', `media/${file}`);
  }

  link(url) {
    return this.rel('hyperlink', url, true);
  }

  relsXml() {
    return `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${this.rels
      .map((x) => `<Relationship Id="${x.id}" Type="${x.type}" Target="${esc(x.target)}"${x.external ? ' TargetMode="External"' : ''}/>`)
      .join('')}</Relationships>`;
  }
}

/**
 * A picture, inline or floating.
 * o: { rId, cx, cy, descr, title, decorative, anchor: { h, v, wrap, behind, polygon, locked }, crop, rot, flipH, flipV, link, svg }
 */
export function picture(doc, o) {
  const id = doc.nextDrawingId();
  const name = `Picture ${id}`;
  const decorative = o.decorative
    ? '<a:extLst><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="1"/></a:ext></a:extLst>'
    : '';
  const docPr = `<wp:docPr id="${id}" name="${name}"${o.descr ? ` descr="${esc(o.descr)}"` : ''}${o.title ? ` title="${esc(o.title)}"` : ''}>${decorative}</wp:docPr>`;
  const svgExt = o.svg
    ? `<a:extLst><a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}"><asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="${o.svg}"/></a:ext></a:extLst>`
    : '';
  const blipRef = o.link && !o.rId ? `r:link="${o.link}"` : o.link ? `r:embed="${o.rId}" r:link="${o.link}"` : `r:embed="${o.rId}"`;
  const crop = o.crop ? `<a:srcRect ${Object.entries(o.crop).map(([k, v]) => `${k}="${v}"`).join(' ')}/>` : '';
  const xfrmAttrs = [o.rot && `rot="${o.rot}"`, o.flipH && 'flipH="1"', o.flipV && 'flipV="1"'].filter(Boolean).join(' ');
  const graphic =
    `<a:graphic xmlns:a="${NS.a}"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    `<pic:pic xmlns:pic="${NS.pic}"><pic:nvPicPr><pic:cNvPr id="${id}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>` +
    `<pic:blipFill><a:blip ${blipRef}>${svgExt}</a:blip>${crop}<a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
    `<pic:spPr><a:xfrm${xfrmAttrs ? ` ${xfrmAttrs}` : ''}><a:off x="0" y="0"/><a:ext cx="${o.cx}" cy="${o.cy}"/></a:xfrm>` +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>';
  const locks = `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="${NS.a}" noChangeAspect="1"/></wp:cNvGraphicFramePr>`;
  const ext = o.effect ?? { l: 0, t: 0, r: 0, b: 0 };
  const effect = `<wp:effectExtent l="${ext.l}" t="${ext.t}" r="${ext.r}" b="${ext.b}"/>`;

  if (!o.anchor) {
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${o.cx}" cy="${o.cy}"/>${effect}${docPr}${locks}${graphic}</wp:inline></w:drawing></w:r>`;
  }
  const a = o.anchor;
  const pos = (axis, spec) => {
    const tag = axis === 'h' ? 'positionH' : 'positionV';
    const inner = spec.align ? `<wp:align>${spec.align}</wp:align>` : `<wp:posOffset>${spec.offset ?? 0}</wp:posOffset>`;
    return `<wp:${tag} relativeFrom="${spec.from}">${inner}</wp:${tag}>`;
  };
  const polygon = (a.polygon ?? [[0, 0], [0, 21600], [21600, 21600], [21600, 0]]);
  const poly = `<wp:wrapPolygon edited="0"><wp:start x="${polygon[0][0]}" y="${polygon[0][1]}"/>${polygon
    .slice(1)
    .concat([polygon[0]])
    .map(([x, y]) => `<wp:lineTo x="${x}" y="${y}"/>`)
    .join('')}</wp:wrapPolygon>`;
  const wrap = {
    square: '<wp:wrapSquare wrapText="bothSides"/>',
    tight: `<wp:wrapTight wrapText="bothSides">${poly}</wp:wrapTight>`,
    through: `<wp:wrapThrough wrapText="bothSides">${poly}</wp:wrapThrough>`,
    topAndBottom: '<wp:wrapTopAndBottom/>',
    none: '<wp:wrapNone/>',
  }[a.wrap ?? 'square'];
  const z = 251658240 + id * 1024;
  return (
    `<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="${z}" ` +
    `behindDoc="${a.behind ? 1 : 0}" locked="${a.locked ? 1 : 0}" layoutInCell="1" allowOverlap="1">` +
    `<wp:simplePos x="0" y="0"/>${pos('h', a.h ?? { from: 'column', offset: 0 })}${pos('v', a.v ?? { from: 'paragraph', offset: 0 })}` +
    `<wp:extent cx="${o.cx}" cy="${o.cy}"/>${effect}${wrap}${docPr}${locks}${graphic}</wp:anchor></w:drawing></w:r>`
  );
}

// ---- styles ----

const STYLE_SET = {
  Normal: '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>',
  DefaultParagraphFont: '<w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style>',
  TableNormal: '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>',
  NoList: '<w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style>',
  TableGrid: '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="39"/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr></w:style>',
};

function pStyle(id, name, { basedOn = 'Normal', next, ui, pPr: pp, rPr: rp, link, hidden } = {}) {
  return (
    `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${esc(name)}"/>${basedOn ? `<w:basedOn w:val="${basedOn}"/>` : ''}` +
    `${next ? `<w:next w:val="${next}"/>` : ''}${link ? `<w:link w:val="${link}"/>` : ''}<w:uiPriority w:val="${ui ?? 9}"/>` +
    `${hidden ? '<w:semiHidden/><w:unhideWhenUsed/>' : ''}<w:qFormat/>` +
    `${pp ? `<w:pPr>${pPrInner(pp)}</w:pPr>` : ''}${rp ? rPr(rp) : ''}</w:style>`
  );
}

function cStyle(id, name, { basedOn = 'DefaultParagraphFont', rPr: rp, link, ui = 99, hidden } = {}) {
  return (
    `<w:style w:type="character" w:styleId="${id}"><w:name w:val="${esc(name)}"/><w:basedOn w:val="${basedOn}"/>` +
    `${link ? `<w:link w:val="${link}"/>` : ''}<w:uiPriority w:val="${ui}"/>${hidden ? '<w:semiHidden/><w:unhideWhenUsed/>' : ''}${rPr(rp)}</w:style>`
  );
}

export const styleDefs = { pStyle, cStyle };

/** The usual built-in styles. Headings can be linked to a numbering instance. */
export function standardStyles({ headingFont, headingNum, headingColor, east = false } = {}) {
  const hf = headingFont ? { fonts: headingFont } : {};
  const hn = (lvl) => (headingNum ? { numPr: { id: headingNum, lvl } } : {});
  const heading = (n, size, extra = {}) =>
    pStyle(`Heading${n}`, `heading ${n}`, {
      next: 'Normal',
      pPr: { keepNext: true, keepLines: true, ...hn(n - 1), spacing: { before: n === 1 ? 360 : 240, after: 120 }, outlineLvl: n - 1 },
      rPr: { ...hf, b: !east, color: headingColor ?? (n === 1 ? '1F3864' : '2F5496'), sz: size, ...extra },
    });
  return [
    heading(1, 16),
    heading(2, east ? 14 : 13),
    heading(3, 12, { i: !east }),
    pStyle('Title', 'Title', { next: 'Normal', ui: 10, pPr: { spacing: { after: 240 }, contextualSpacing: true }, rPr: { ...hf, sz: 28, kern: 28 } }),
    pStyle('Subtitle', 'Subtitle', { next: 'Normal', ui: 11, pPr: { spacing: { after: 240 } }, rPr: { color: '595959', sz: 14, spacing: 15 } }),
    pStyle('Quote', 'Quote', { next: 'Normal', ui: 29, pPr: { spacing: { before: 200, after: 160 }, ind: { left: 864, right: 864 }, jc: 'center' }, rPr: { i: true, color: '404040' } }),
    pStyle('IntenseQuote', 'Intense Quote', { next: 'Normal', ui: 30, pPr: { pBdr: { top: { sz: 4, space: 10, color: '4472C4' }, bottom: { sz: 4, space: 10, color: '4472C4' } }, spacing: { before: 360, after: 360 }, ind: { left: 864, right: 864 }, jc: 'center' }, rPr: { i: true, color: '4472C4' } }),
    pStyle('Caption', 'caption', { next: 'Normal', ui: 35, pPr: { spacing: { after: 200 } }, rPr: { i: true, color: '44546A', sz: 9 } }),
    pStyle('ListParagraph', 'List Paragraph', { ui: 34, pPr: { ind: { left: 720 }, contextualSpacing: true } }),
    pStyle('TOCHeading', 'TOC Heading', { basedOn: 'Heading1', next: 'Normal', ui: 39, pPr: { outlineLvl: 9 } }),
    pStyle('TOC1', 'toc 1', { next: 'Normal', ui: 39, hidden: true, pPr: { spacing: { after: 100 } } }),
    pStyle('TOC2', 'toc 2', { next: 'Normal', ui: 39, hidden: true, pPr: { spacing: { after: 100 }, ind: { left: 220 } } }),
    pStyle('TOC3', 'toc 3', { next: 'Normal', ui: 39, hidden: true, pPr: { spacing: { after: 100 }, ind: { left: 440 } } }),
    pStyle('TableofFigures', 'table of figures', { next: 'Normal', ui: 99, hidden: true, pPr: { spacing: { after: 0 } } }),
    pStyle('Index1', 'index 1', { next: 'Normal', ui: 99, hidden: true, pPr: { spacing: { after: 0 }, ind: { left: 220, hanging: 220 } } }),
    pStyle('Index2', 'index 2', { next: 'Normal', ui: 99, hidden: true, pPr: { spacing: { after: 0 }, ind: { left: 440, hanging: 220 } } }),
    pStyle('IndexHeading', 'index heading', { basedOn: 'Normal', next: 'Index1', ui: 99, hidden: true, rPr: { b: true } }),
    pStyle('FootnoteText', 'footnote text', { link: 'FootnoteTextChar', ui: 99, hidden: true, pPr: { spacing: { after: 0, line: 240, lineRule: 'auto' } }, rPr: { sz: 10 } }),
    cStyle('FootnoteTextChar', 'Footnote Text Char', { link: 'FootnoteText', rPr: { sz: 10 } }),
    cStyle('FootnoteReference', 'footnote reference', { hidden: true, rPr: { vertAlign: 'superscript' } }),
    pStyle('EndnoteText', 'endnote text', { ui: 99, hidden: true, pPr: { spacing: { after: 0, line: 240, lineRule: 'auto' } }, rPr: { sz: 10 } }),
    cStyle('EndnoteReference', 'endnote reference', { hidden: true, rPr: { vertAlign: 'superscript' } }),
    pStyle('CommentText', 'annotation text', { ui: 99, hidden: true, rPr: { sz: 10 } }),
    cStyle('CommentReference', 'annotation reference', { hidden: true, rPr: { sz: 8 } }),
    pStyle('Header', 'header', { ui: 99, hidden: true, pPr: { tabs: [{ val: 'center', pos: 4513 }, { val: 'right', pos: 9026 }], spacing: { after: 0, line: 240, lineRule: 'auto' } } }),
    pStyle('Footer', 'footer', { ui: 99, hidden: true, pPr: { tabs: [{ val: 'center', pos: 4513 }, { val: 'right', pos: 9026 }], spacing: { after: 0, line: 240, lineRule: 'auto' } } }),
    cStyle('Hyperlink', 'Hyperlink', { rPr: { color: '0563C1', u: 'single' } }),
    ...Object.values(STYLE_SET),
  ].join('');
}

export function stylesXml({ font = 'Arial', ea, cs, sz = 11, lang = { val: 'en-US', eastAsia: 'zh-CN', bidi: 'ar-SA' }, spacing = { after: 120, line: 240, lineRule: 'auto' }, jc, kern, styles }) {
  const fonts = typeof font === 'string' ? { latin: font, ea, cs: cs ?? font } : font;
  const rDef = rPrInner({ fonts, sz, kern, lang });
  const pDef = pPrInner({ spacing, jc });
  return (
    `${XML}<w:styles ${ROOT_NS}><w:docDefaults><w:rPrDefault><w:rPr>${rDef}</w:rPr></w:rPrDefault>` +
    `<w:pPrDefault><w:pPr>${pDef}</w:pPr></w:pPrDefault></w:docDefaults>${styles ?? standardStyles()}</w:styles>`
  );
}

// ---- numbering ----

/** Word's default three-level bullet list. */
export const BULLETS = [
  { fmt: 'bullet', text: '', font: 'Symbol', left: 720 },
  { fmt: 'bullet', text: 'o', font: 'Courier New', left: 1440 },
  { fmt: 'bullet', text: '', font: 'Wingdings', left: 2160 },
];

class Numbering {
  constructor() {
    this.abstracts = [];
    this.nums = [];
  }

  /** levels: [{ fmt, text, start, left, hanging, font, suff, pStyle, jc, isLgl, rPr }] → numId */
  add(levels, { multi = levels.length > 1 ? 'hybridMultilevel' : 'singleLevel', restartFrom } = {}) {
    const aid = this.abstracts.length;
    const lvls = levels.map((l, i) => {
      const rp = l.font ? { fonts: { latin: l.font, hint: 'default' }, ...l.rPr } : l.rPr;
      return (
        `<w:lvl w:ilvl="${i}"><w:start w:val="${l.start ?? 1}"/><w:numFmt w:val="${l.fmt}"/>` +
        `${l.pStyle ? `<w:pStyle w:val="${l.pStyle}"/>` : ''}${l.isLgl ? '<w:isLgl/>' : ''}${l.suff ? `<w:suff w:val="${l.suff}"/>` : ''}` +
        `<w:lvlText w:val="${esc(l.text)}"/><w:lvlJc w:val="${l.jc ?? 'left'}"/>` +
        `<w:pPr>${l.ind ? `<w:ind ${attrs(l.ind)}/>` : `<w:ind w:left="${l.left ?? 720 * (i + 1)}" w:hanging="${l.hanging ?? 360}"/>`}</w:pPr>${rp ? rPr(rp) : ''}</w:lvl>`
      );
    });
    this.abstracts.push(`<w:abstractNum w:abstractNumId="${aid}"><w:multiLevelType w:val="${multi}"/>${lvls.join('')}</w:abstractNum>`);
    return this.instance(aid, restartFrom);
  }

  /** Another list using the same definition. `restart` restarts level 0 at that value. */
  instance(aid, restart) {
    const id = this.nums.length + 1;
    const override = restart ? `<w:lvlOverride w:ilvl="0"><w:startOverride w:val="${restart}"/></w:lvlOverride>` : '';
    this.nums.push(`<w:num w:numId="${id}"><w:abstractNumId w:val="${aid}"/>${override}</w:num>`);
    return id;
  }

  abstractOf(numId) {
    return Number(/w:abstractNumId w:val="(\d+)"/.exec(this.nums[numId - 1])[1]);
  }

  xml() {
    return `${XML}<w:numbering ${ROOT_NS}>${this.abstracts.join('')}${this.nums.join('')}</w:numbering>`;
  }
}

// ---- the document ----

export class Doc {
  constructor({ title, creator = 'GetWordCraft', subject, keywords, description, custom } = {}) {
    this.meta = { title, creator, subject, keywords, description, custom };
    this.main = new Part(this, 'word/document.xml');
    this.media = [];
    this.headers = [];
    this.footers = [];
    this.footnotes = [];
    this.endnotes = [];
    this.comments = [];
    this.body = [];
    this.numbering = new Numbering();
    this.settings = {};
    this.styles = null;
    this.background = null;
    this.extraParts = [];
    this.counters = { drawing: 0, id: 0, bookmark: 0 };
    this.sect = {};
  }

  nextDrawingId() { return ++this.counters.drawing; }
  nextId() { return ++this.counters.id; }
  nextBookmark() { return this.counters.bookmark++; }

  add(...xml) {
    this.body.push(...xml.flat());
    return this;
  }

  /** Adds a header or footer part; `build` gets the part, for pictures inside it. Returns the relationship id. */
  header(build, kind = 'hdr') {
    const list = kind === 'hdr' ? this.headers : this.footers;
    const n = list.length + 1;
    const file = `${kind === 'hdr' ? 'header' : 'footer'}${n}.xml`;
    const part = new Part(this, `word/${file}`);
    const content = typeof build === 'function' ? build(part) : build;
    list.push({ file, part, content: Array.isArray(content) ? content.join('') : content });
    return this.main.rel(kind === 'hdr' ? 'header' : 'footer', file);
  }

  footer(build) { return this.header(build, 'ftr'); }

  /** Adds a footnote and returns the run that references it. */
  footnote(text) {
    const id = this.footnotes.length + 1;
    const paras = Array.isArray(text) ? text : [text];
    const body = paras.map((tx, i) => p([i === 0 ? rx('<w:footnoteRef/>', { style: 'FootnoteReference' }) : '', tx.startsWith('<') ? tx : r(` ${tx}`)], { style: 'FootnoteText' })).join('');
    this.footnotes.push(`<w:footnote w:id="${id}">${body}</w:footnote>`);
    return rx(`<w:footnoteReference w:id="${id}"/>`, { style: 'FootnoteReference' });
  }

  endnote(text) {
    const id = this.endnotes.length + 1;
    this.endnotes.push(`<w:endnote w:id="${id}">${p([rx('<w:endnoteRef/>', { style: 'EndnoteReference' }), r(` ${text}`)], { style: 'EndnoteText' })}</w:endnote>`);
    return rx(`<w:endnoteReference w:id="${id}"/>`, { style: 'EndnoteReference' });
  }

  /** Adds a comment; returns { start, end } markers to wrap the commented text with. */
  comment({ author, initials, date, text }) {
    const id = this.comments.length;
    this.comments.push(
      `<w:comment w:id="${id}" w:author="${esc(author)}" w:date="${date}" w:initials="${esc(initials)}">` +
      `${p([rx('<w:annotationRef/>', { style: 'CommentReference' }), r(text)], { style: 'CommentText' })}</w:comment>`,
    );
    return {
      start: `<w:commentRangeStart w:id="${id}"/>`,
      end: `<w:commentRangeEnd w:id="${id}"/>${rx(`<w:commentReference w:id="${id}"/>`, { style: 'CommentReference' })}`,
    };
  }

  settingsXml() {
    const s = this.settings;
    const parts = [
      '<w:zoom w:percent="100"/>',
      s.displayBackgroundShape && '<w:displayBackgroundShape/>',
      s.mirrorMargins && '<w:mirrorMargins/>',
      s.trackRevisions && '<w:trackRevisions/>',
      s.documentProtection,
      `<w:defaultTabStop w:val="${s.defaultTabStop ?? 720}"/>`,
      s.autoHyphenation && '<w:autoHyphenation/>',
      s.consecutiveHyphenLimit && `<w:consecutiveHyphenLimit w:val="${s.consecutiveHyphenLimit}"/>`,
      s.hyphenationZone && `<w:hyphenationZone w:val="${s.hyphenationZone}"/>`,
      s.evenAndOddHeaders && '<w:evenAndOddHeaders/>',
      s.bookFoldPrinting && '<w:bookFoldPrinting/>',
      `<w:characterSpacingControl w:val="${s.characterSpacingControl ?? 'doNotCompress'}"/>`,
      this.footnotes.length && `<w:footnotePr>${s.footnoteFmt ?? ''}<w:footnote w:id="-1"/><w:footnote w:id="0"/></w:footnotePr>`,
      this.endnotes.length && `<w:endnotePr>${s.endnoteFmt ?? ''}<w:endnote w:id="-1"/><w:endnote w:id="0"/></w:endnotePr>`,
      `<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="${s.compatMode ?? 15}"/></w:compat>`,
      s.themeFontLang && `<w:themeFontLang ${attrs(s.themeFontLang)}/>`,
    ].filter(Boolean);
    return `${XML}<w:settings ${ROOT_NS}>${parts.join('')}</w:settings>`;
  }

  build() {
    const main = this.main;
    const entries = [];
    const overrides = [
      ['/word/document.xml', `${CT}.document.main+xml`],
      ['/word/styles.xml', `${CT}.styles+xml`],
      ['/word/settings.xml', `${CT}.settings+xml`],
      ['/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'],
      ['/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml'],
    ];
    main.rel('styles', 'styles.xml');
    main.rel('settings', 'settings.xml');
    const parts = [];
    if (this.numbering.nums.length) {
      main.rel('numbering', 'numbering.xml');
      overrides.push(['/word/numbering.xml', `${CT}.numbering+xml`]);
      parts.push({ name: 'word/numbering.xml', data: this.numbering.xml() });
    }
    if (this.footnotes.length) {
      main.rel('footnotes', 'footnotes.xml');
      overrides.push(['/word/footnotes.xml', `${CT}.footnotes+xml`]);
      parts.push({ name: 'word/footnotes.xml', data: notesXml('footnote', this.footnotes) });
    }
    if (this.endnotes.length) {
      main.rel('endnotes', 'endnotes.xml');
      overrides.push(['/word/endnotes.xml', `${CT}.endnotes+xml`]);
      parts.push({ name: 'word/endnotes.xml', data: notesXml('endnote', this.endnotes) });
    }
    if (this.comments.length) {
      main.rel('comments', 'comments.xml');
      overrides.push(['/word/comments.xml', `${CT}.comments+xml`]);
      parts.push({ name: 'word/comments.xml', data: `${XML}<w:comments ${ROOT_NS}>${this.comments.join('')}</w:comments>` });
    }
    for (const [list, tag, ct] of [[this.headers, 'hdr', 'header'], [this.footers, 'ftr', 'footer']]) {
      for (const h of list) {
        overrides.push([`/word/${h.file}`, `${CT}.${ct}+xml`]);
        parts.push({ name: `word/${h.file}`, data: `${XML}<w:${tag} ${ROOT_NS}>${h.content}</w:${tag}>` });
        if (h.part.rels.length) parts.push({ name: `word/_rels/${h.file}.rels`, data: h.part.relsXml() });
      }
    }
    for (const x of this.extraParts) {
      overrides.push([`/${x.name}`, x.contentType]);
      parts.push({ name: x.name, data: x.data });
    }

    const background = this.background ? `<w:background w:color="${this.background}"/>` : '';
    const document = `${XML}<w:document ${ROOT_NS}>${background}<w:body>${this.body.join('')}${sectPr(this.sect)}</w:body></w:document>`;

    const packageRels = [
      ['rId1', `${REL}/officeDocument`, 'word/document.xml'],
      ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'],
      ['rId3', `${REL}/extended-properties`, 'docProps/app.xml'],
    ];
    if (this.meta.custom) {
      packageRels.push(['rId4', `${REL}/custom-properties`, 'docProps/custom.xml']);
      overrides.push(['/docProps/custom.xml', 'application/vnd.openxmlformats-officedocument.custom-properties+xml']);
    }

    const defaults = [['rels', 'application/vnd.openxmlformats-package.relationships+xml'], ['xml', 'application/xml']];
    const mediaTypes = { png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', tiff: 'image/tiff', svg: 'image/svg+xml' };
    for (const ext of new Set(this.media.map((m) => m.name.split('.').pop()))) defaults.push([ext, mediaTypes[ext]]);

    entries.push({
      name: '[Content_Types].xml',
      data: `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">${defaults
        .map(([e, c]) => `<Default Extension="${e}" ContentType="${c}"/>`)
        .join('')}${overrides.map(([n, c]) => `<Override PartName="${n}" ContentType="${c}"/>`).join('')}</Types>`,
    });
    entries.push({
      name: '_rels/.rels',
      data: `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${packageRels
        .map(([id, type, target]) => `<Relationship Id="${id}" Type="${type}" Target="${target}"/>`)
        .join('')}</Relationships>`,
    });
    entries.push({ name: 'docProps/core.xml', data: this.coreXml() });
    entries.push({
      name: 'docProps/app.xml',
      data: `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>GetWordCraft test corpus</Application></Properties>`,
    });
    if (this.meta.custom) entries.push({ name: 'docProps/custom.xml', data: this.customXml() });
    entries.push({ name: 'word/document.xml', data: document });
    entries.push({ name: 'word/styles.xml', data: this.styles ?? stylesXml({}) });
    entries.push({ name: 'word/settings.xml', data: this.settingsXml() });
    entries.push(...parts);
    entries.push(...this.media);
    entries.push({ name: 'word/_rels/document.xml.rels', data: main.relsXml() });
    return zip(entries);
  }

  coreXml() {
    const m = this.meta;
    const el = (tag, v) => (v ? `<${tag}>${esc(v)}</${tag}>` : '');
    return (
      `${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ` +
      'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
      'xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      `${el('dc:title', m.title)}${el('dc:subject', m.subject)}${el('dc:creator', m.creator)}${el('cp:keywords', m.keywords)}` +
      `${el('dc:description', m.description)}${el('cp:lastModifiedBy', m.creator)}` +
      '<dcterms:created xsi:type="dcterms:W3CDTF">2026-10-17T00:00:00Z</dcterms:created>' +
      '<dcterms:modified xsi:type="dcterms:W3CDTF">2026-10-17T00:00:00Z</dcterms:modified></cp:coreProperties>'
    );
  }

  customXml() {
    const props = Object.entries(this.meta.custom)
      .map(([name, v], i) => `<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="${i + 2}" name="${esc(name)}"><vt:lpwstr>${esc(v)}</vt:lpwstr></property>`)
      .join('');
    return `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">${props}</Properties>`;
  }
}

function notesXml(kind, notes) {
  const sep = (type, id, inner) =>
    `<w:${kind} w:type="${type}" w:id="${id}"><w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r>${inner}</w:r></w:p></w:${kind}>`;
  return `${XML}<w:${kind}s ${ROOT_NS}>${sep('separator', -1, '<w:separator/>')}${sep('continuationSeparator', 0, '<w:continuationSeparator/>')}${notes.join('')}</w:${kind}s>`;
}
