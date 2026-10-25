import { esc, fld, p, r, rx } from '../lib/ooxml.mjs';
import { circleSvg, logoSvg, photoSvg, pictureSvg, render } from '../lib/images.mjs';

const cache = new Map();

/** Rendered test pictures, cached by kind, format and size. */
export async function image(kind, format, { w, h, variant = 0, seed = 1 } = {}) {
  const key = [kind, format, w, h, variant, seed].join(':');
  if (!cache.has(key)) {
    const svg = {
      picture: () => pictureSvg(w ?? 800, h ?? 600, variant),
      circle: () => circleSvg(w ?? 600),
      photo: () => photoSvg(w ?? 1600, h ?? 1200, seed),
      logo: () => logoSvg(w ?? 360, h ?? 120),
    }[kind]();
    cache.set(key, await render(svg, format, kind === 'photo' ? { quality: 85, grain: 14, seed } : {}));
  }
  return cache.get(key);
}

/** The case header at the top of every generated document: id, title and what a correct rendering shows. */
export function banner(doc, c, { label = 'Expected', style, snap } = {}) {
  const gray = { sz: 9, color: '595959' };
  const colon = /[^\x00-\x7f]/.test(label) ? '：' : ': ';
  const snapToGrid = snap === false ? false : undefined;
  doc.add(
    p(r(`${c.id} · ${c.title}`, { ...gray, b: true }), { style, snapToGrid, spacing: style ? undefined : { before: 0, after: 0 } }),
    p(r(`${label}${colon}${c.expect}`, gray), {
      style,
      snapToGrid,
      spacing: style ? undefined : { after: 240 },
      pBdr: style ? undefined : { bottom: { sz: 4, space: 4, color: 'BFBFBF' } },
    }),
  );
}

/** A table of contents field with a cached result. entries: [{ level, text, page, anchor }] */
export function toc(entries, { instr = 'TOC \\o "1-3" \\h \\z \\u', width = 9026, style } = {}) {
  const tabs = [{ val: 'right', leader: 'dot', pos: width }];
  const begin =
    rx('<w:fldChar w:fldCharType="begin"/>') +
    rx(`<w:instrText xml:space="preserve"> ${esc(instr)} </w:instrText>`) +
    rx('<w:fldChar w:fldCharType="separate"/>');
  return entries.map((e, i) =>
    p(
      [
        i === 0 ? begin : '',
        `<w:hyperlink w:anchor="${e.anchor}" w:history="1">${r(e.text)}${rx('<w:tab/>')}${fld(`PAGEREF ${e.anchor} \\h`, String(e.page))}</w:hyperlink>`,
        i === entries.length - 1 ? rx('<w:fldChar w:fldCharType="end"/>') : '',
      ],
      { style: style ?? `TOC${e.level}`, tabs },
    ),
  );
}

/** An index entry field (XE), which has no visible result. */
export const xe = (term) =>
  rx('<w:fldChar w:fldCharType="begin"/>') + rx(`<w:instrText xml:space="preserve"> XE "${esc(term)}" </w:instrText>`) + rx('<w:fldChar w:fldCharType="end"/>');

export function hyperlink(doc, url, text, { tooltip } = {}) {
  const id = doc.main.link(url);
  return `<w:hyperlink r:id="${id}" w:history="1"${tooltip ? ` w:tooltip="${esc(tooltip)}"` : ''}>${r(text, { style: 'Hyperlink' })}</w:hyperlink>`;
}

export const revision = (doc) => {
  const at = (author, date) => `w:id="${doc.nextId()}" w:author="${esc(author)}" w:date="${date}"`;
  return {
    ins: (author, date, inner) => `<w:ins ${at(author, date)}>${inner}</w:ins>`,
    del: (author, date, text) => `<w:del ${at(author, date)}><w:r><w:delText xml:space="preserve">${esc(text)}</w:delText></w:r></w:del>`,
    mark: (kind, author, date) => `<w:${kind} ${at(author, date)}/>`,
    rPrChange: (author, date) => `<w:rPrChange ${at(author, date)}><w:rPr/></w:rPrChange>`,
    pPrChange: (author, date, old = '') => `<w:pPrChange ${at(author, date)}><w:pPr>${old}</w:pPr></w:pPrChange>`,
  };
};
