#!/usr/bin/env node
// Generates the test files into corpus/generated/.
//
//   node tools/make-corpus.mjs                 everything (a few minutes; the PF files are large)
//   node tools/make-corpus.mjs --skip-large    without the PF documents and DX-IMG-09
//   node tools/make-corpus.mjs --only DX-TBL-02,ZH-PCT-01
//
// The output is the same on every run. Generated .docx files are inputs to the Word baseline (README.md §3.4);
// the files the tests use are the ones Word saved, in corpus/docx/.

import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Doc, stylesXml } from './lib/ooxml.mjs';
import { rng } from './lib/text.mjs';
import { banner } from './probes/common.mjs';
import { dx } from './probes/dx.mjs';
import { misc } from './probes/misc.mjs';
import { pf } from './probes/pf.mjs';
import { zh, zhSetup } from './probes/zh.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'corpus', 'generated');
const args = process.argv.slice(2);
const only = args.includes('--only') ? new Set(args[args.indexOf('--only') + 1].split(',')) : null;
const skipLarge = args.includes('--skip-large');
const LARGE = new Set(['DX-IMG-09', ...pf.map((c) => c.id)]);

const seedOf = (s) => {
  let h = 0x811c9dc5;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h;
};

const built = new Map();
const manifest = [];

async function write(name, data, c) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  await writeFile(join(out, name), buf);
  manifest.push({ id: c.id, file: name, title: c.title, bytes: buf.length, sha256: createHash('sha256').update(buf).digest('hex') });
}

async function buildDoc(c, suite) {
  const variants = c.variants ?? [{ suffix: '', arg: undefined }];
  for (const v of variants) {
    const doc = new Doc({ title: `${c.id}${v.suffix} ${c.title}` });
    doc.styles = stylesXml({});
    if (c.setup) c.setup(doc, v.arg);
    else if (suite === 'zh') zhSetup(doc);
    const label = c.bannerLabel ?? (suite === 'zh' ? '预期' : 'Expected');
    banner(doc, c, { label, ...c.banner });
    await c.build(doc, rng(seedOf(c.id + v.suffix)), v.arg);
    const buf = doc.build();
    built.set(c.id + v.suffix, buf);
    await write(`${c.id}${v.suffix}.docx`, buf, c);
  }
}

const wanted = (c) => (!only || only.has(c.id)) && !(skipLarge && LARGE.has(c.id));

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const started = Date.now();
for (const [suite, list] of [['dx', dx], ['zh', zh], ['misc', misc.filter((c) => c.build)], ['pf', pf]]) {
  for (const c of list.filter(wanted)) {
    process.stdout.write(`${c.id} `);
    await buildDoc(c, suite);
  }
}
for (const c of misc.filter((x) => x.files && wanted(x))) {
  process.stdout.write(`${c.id} `);
  const ctx = {
    built: (id) => {
      if (!built.has(id)) throw new Error(`${c.id} needs ${id}; generate it in the same run`);
      return built.get(id);
    },
  };
  for (const f of await c.files(ctx)) await write(f.name, f.data, c);
}

manifest.sort((a, b) => a.file.localeCompare(b.file));
await writeFile(join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(out, 'SHA256SUMS.txt'), manifest.map((m) => `${m.sha256}  ${m.file}`).join('\n') + '\n');
const mb = manifest.reduce((n, m) => n + m.bytes, 0) / 1e6;
console.log(`\n${manifest.length} files, ${mb.toFixed(1)} MB, ${((Date.now() - started) / 1000).toFixed(0)} s → ${out}`);
