// Reads the case tables in suites/*.md, which are the list of cases.
// A row is a case when its first cell is an ID such as DX-TBL-02, or a range such as DX-PRIV-01~20.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const SUITES = {
  dx: { file: 'dx-docx.md', name: 'DOCX 兼容性' },
  zh: { file: 'zh-typesetting.md', name: '中文排版' },
  pf: { file: 'pf-performance.md', name: '性能' },
  mc: { file: 'mc-mcp-cli.md', name: 'MCP 和命令行' },
  in: { file: 'in-install.md', name: '下载、安装和网络' },
  ed: { file: 'ed-editing.md', name: '日常编辑' },
  ax: { file: 'ax-accessibility.md', name: '无障碍' },
  st: { file: 'st-stability.md', name: '稳定性和数据安全' },
};

export const VERDICTS = ['pass', 'minor', 'major', 'fail', 'na', 'blocked', 'skip'];
export const FLAGS = ['dataLoss', 'crash', 'repair', 'warning'];
export const STAGES = ['O', 'D', 'E', 'S', 'R', 'X', 'T', 'M'];

const ID = /^([A-Z]{2}(?:-[A-Z0-9]+)+)(?:~(\d+))?$/;

export async function loadCases(suitesDir) {
  const cases = [];
  for (const [suite, { file }] of Object.entries(SUITES)) {
    const text = await readFile(join(suitesDir, file), 'utf8');
    for (const line of text.split('\n')) {
      if (!line.startsWith('|')) continue;
      const cells = line.split(/(?<!\\)\|/).slice(1, -1).map((s) => s.trim().replace(/\\\|/g, '|'));
      if (cells.length < 7) continue;
      const m = ID.exec(cells[0]);
      if (!m) continue;
      const [, priority, systems, stages, source, title, how] = cells;
      const base = {
        suite,
        priority,
        systems: systems.split(/\s+/).map((s) => s.toLowerCase()),
        stages: stages.split(/\s+/).filter(Boolean),
        source,
        title,
        how,
      };
      if (m[2]) {
        const [, prefix, start] = /^(.*-)(\d+)$/.exec(m[1]);
        for (let n = Number(start); n <= Number(m[2]); n++) cases.push({ ...base, id: `${prefix}${String(n).padStart(start.length, '0')}` });
      } else {
        cases.push({ ...base, id: m[1] });
      }
    }
  }
  const seen = new Set();
  for (const c of cases) {
    if (seen.has(c.id)) throw new Error(`duplicate case ${c.id}`);
    seen.add(c.id);
    for (const s of c.stages) if (!STAGES.includes(s)) throw new Error(`${c.id}: unknown stage ${s}`);
  }
  return cases;
}

const BATCH = /^`([a-z]+\d*)`$/;
const CASE_ID = /^[A-Z]{2}(?:-[A-Z0-9]+)+$/;

/**
 * Reads the batch tables in batches.md: a row is a batch when its first cell is an id in backticks,
 * such as `dx2`, and its third cell lists the case ids.
 */
export async function loadBatches(file) {
  const batches = new Map();
  for (const line of (await readFile(file, 'utf8')).split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((s) => s.trim());
    const m = BATCH.exec(cells[0] ?? '');
    if (!m) continue;
    if (batches.has(m[1])) throw new Error(`batch ${m[1]} is defined twice`);
    const ids = (cells[2] ?? '').split(/\s+/).filter((s) => CASE_ID.test(s));
    batches.set(m[1], { id: m[1], title: cells[1], cases: ids });
  }
  return batches;
}

/** The unit a PF measurement is recorded in. */
export const unitOf = (id) => (/^PF-(SIZE|MEM)/.test(id) ? 'MB' : /^PF-CPU/.test(id) ? '%' : 's');
