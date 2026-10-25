# 测试记录

每一批测试一个目录：`<日期>-<mac|win>-<WordCraft 版本>-<批次>`，如 `2026-10-25-mac-0.10.0-dx1`。一批只测一个版本、一台机器，批次和用例见 [batches.md](../batches.md)。

```sh
# 一批的记录；--from 带上上一批的机器、参考软件和字体信息
node tools/new-run.mjs --os mac --version 0.10.0 --batch dx2 --from runs/2026-10-25-mac-0.10.0-dx1
# 回归批再加几个用例
node tools/new-run.mjs --os mac --version 0.11.0 --batch reg --add DX-TBL-02,ZH-PCT-01
# 检查并汇总，同时列出要复判的用例
node tools/check-run.mjs runs/2026-10-25-mac-0.10.0-dx1 --sample 10
```

不带 `--batch` 时，还可以像以前一样按套件和优先级生成（`--priority P0 --suites dx,zh`），目录名里没有批次，只在批次以外临时加测时用。

## 目录里有什么

| 文件或目录 | 内容 |
|---|---|
| `run.yaml` | 批次和环境：系统、机器、WordCraft 安装包和 SHA-256、Word 版本、字体、工具。开始前填好，中途的变化写进 `changes` |
| `dx.yaml` … `st.yaml` | 本批涉及的套件各一个文件，已列出本机要测的用例，只要填空。每批都有 `st.yaml` 里的 ST-LOG-01，记这一批里的崩溃和卡死 |
| `evidence/` | 截图、录屏、命令输出、采样的 CSV。文件名规则见 README.md §6 |
| `outputs/` | WordCraft 保存或导出的文件（`<ID>.wordcraft.docx` 等） |
| `logs/` | 复制出来的 WordCraft 日志 |

## 一条记录

```yaml
  - id: DX-TBL-02
    p: P0
    title: "合并单元格"
    O: pass
    D: minor
    E: pass
    S: pass
    R: pass
    flags: []
    note: "纵向合并的“Merged block”底纹在 WordCraft 里只画了上半格；其余和 Word 一样。"
    evidence: [DX-TBL-02-D-wordcraft.png, DX-TBL-02-D-word.png]
    issue: ""
    checked: 2026-10-20
```

- 每个阶段填一个等级：`pass minor major fail na blocked skip`。没测的留空。
- `flags` 可填 `dataLoss`（保存或往返后内容丢了且没有提示）、`crash`（崩溃或 30 秒没反应）、`repair`（Word 打开 WordCraft 存的文件时要求修复）、`warning`（WordCraft 打开时给出提示）。
- 任何 `minor`、`major`、`fail`、`blocked`、`skip` 或标记，`note` 必填：写清是哪里、什么样，让没看截图的人也明白。
- `evidence` 写 `evidence/` 里的文件名。有差异的用例至少放一对截图（WordCraft 和 Word）。私有样本（DX-PRIV）不放任何截图。
- `issue`：向上游报告后填 issue 的地址。
- `checked`：判定的日期。

性能（PF）的记录是测量值：

```yaml
  - id: PF-START-01
    p: P0
    title: "冷启动"
    unit: "s"
    wordcraft: [0.92, 0.88, 0.95, 0.90, 0.89]
    word: [3.41, 3.12, 3.30, 3.25, 3.18]
    other: [5.02, 4.88, 4.95, 4.91, 5.10]
    other_app: "LibreOffice 25.8.2"
    M:
    flags: []
    note: "终点：空白文档出现且光标闪烁。"
    evidence: [PF-START-01-wordcraft-1.mov]
    issue: ""
    checked: 2026-10-21
```

## 复判

`--sample 10` 按本批的目录名作种子，从已判定的用例里随机列出 10%（至少 1 个）。在之后某一批的开头、至少隔一天，不看原记录，重新判定，写进原来那一批记录的 `recheck`：

```yaml
    recheck: { date: 2026-10-22, D: major }
```

两次不同时，再看一遍，在 note 里写"复判：minor → major，原因……"，并把阶段的等级改成最终结果。页面上报告复判的一致率。

## 提交

每批测完运行一次 `check-run.mjs`，没有 error 再提交。截图用 PNG；录屏超过 50 MB 的不进仓库，放在外部存储，在 note 里写位置。
