# WordCraft 实测方案

Hands-on tests of [WordCraft](https://github.com/storytold/wordcraft), the open-source word processor, with Microsoft Word on the same machine as the reference: the method, the cases, the test file generator and the raw records behind the test pages on [getwordcraft.org](https://getwordcraft.org). The method is written in Chinese; case IDs, file names and record fields are the same on every page. GetWordCraft is an independent site, not affiliated with ArtCraft or Microsoft.

这里是 [getwordcraft.org](https://getwordcraft.org) 测试页面背后的方法、用例、测试文件生成脚本和原始记录。GetWordCraft 是独立网站，和 ArtCraft、微软都没有关系。许可见 [corpus/README.md](corpus/README.md#公开和许可)。

> 版本 1.1 · 2026-10-24 · 适用于 WordCraft 0.10.0 及以后
>
> 本方案和全部用例在开始测试之前提交。之后的修改记在文末的"修订记录"里，测试页面会链接到这里，读者可以看到我们有没有在测完之后改标准。

## 1. 要回答的问题

| 读者的问题 | 套件 |
|---|---|
| 别人发来的 .docx 能不能正常打开？改完存回去，对方用 Word 打开还一样吗？ | [DX：DOCX 兼容性](suites/dx-docx.md) |
| 中文文档、公文、论文排得对不对？ | [ZH：中文排版](suites/zh-typesetting.md) |
| 快不快，占多少内存？ | [PF：性能](suites/pf-performance.md) |
| 命令行和 MCP 是不是像文档写的那样工作？安全选项管不管用？ | [MC：MCP 和命令行](suites/mc-mcp-cli.md) |
| 安装、升级、卸载顺不顺利？会不会联网？ | [IN：下载、安装和网络](suites/in-install.md) |
| 用 Word 的习惯能不能完成日常工作？ | [ED：日常编辑](suites/ed-editing.md) |
| 读屏软件和键盘用户能不能用？ | [AX：无障碍](suites/ax-accessibility.md) |
| 会不会崩溃、丢文件？ | [ST：稳定性和数据安全](suites/st-stability.md) |

上游自己的文档列出了很多"还没测"的地方：`docs/gaps.md` 的第 1 号差距是"DOCX never tested on real-world files"，读屏软件"not yet tried with real screen readers"，大型文档的性能"unmeasured"，Word 2003 XML 的保存"never opened in Word yet (needs a tester)"。各套件开头写了它依据的是哪几条。

## 2. 原则

- **只发布测到的。** 没测的写"未测"，不拿官方说法顶替。官方说法和实测不一致时，两者都写，注明版本和日期。
- **结果和环境绑在一起。** 每个结果都写明 WordCraft 版本、系统、机器和测试日期。
- **先定方法，再测。** 等级定义、用例和步骤在测试前定好。
- **以同一台机器上的 Microsoft Word 为参考。** 版面比较只在同一台机器的 Word 和 WordCraft 之间做。
- **人来判定。** 脚本只负责生成文件、批量另存和采样计时；每一个等级都由测试者看过之后给出。MCP 套件里 AI agent 本身是被测对象，判定仍由人做。
- **拿不准时选更差的一级**，并在备注里写原因。
- **不打总分，不打星。** 只报告各等级的数量和具体问题。
- **可以复现。** 测试文件、生成脚本、原始记录和截图都保留，能公开的公开（§10）。

## 3. 对象、环境和准备

### 3.1 版本

测试分批做（§4.1），每一批开始时用当时最新的正式版，一批之内不换版本。WordCraft 几天就出一个新版本，一轮测完要好几周，所以不再要求一整轮固定一个版本：每个结果都记着它是在哪个版本上测的，页面上照实写；已经测过的批次由回归批跟进（§8）。

安装包只从官方 GitHub Release 下载，下载后用 `SHA256SUMS.txt` 核对，把文件名和 SHA-256 写进 `run.yaml`。

### 3.2 机器

| 机器 | 用途 | 参考软件 |
|---|---|---|
| Mac（Apple M4，32 GB，macOS 26.6.2） | 主测试机；生成参考 PDF | Microsoft Word for Mac（Microsoft 365）、Pages |
| Windows 电脑 | 第二台测试机 | Word for Windows（如果有）、WPS（如果有） |

Windows 电脑的配置第一次测试时写进 `run.yaml`。没有 Word 的机器只做功能测试，版面对比（D、S 阶段）记 `na`。

### 3.3 每台机器的准备

1. **新建一个专门测试用的系统用户**（如 "Tester"），在这个用户下测试。这样 WordCraft 以默认设置启动，截图里也不会出现自己的名字和文件。
2. 系统语言用简体中文。英文页面需要的少量英文界面截图，测完后在 WordCraft 里临时切换界面语言补拍。
3. 关掉 Word 和系统的自动更新，避免中途换版本。实在更新了，写进 `run.yaml` 的 `changes`。
4. 记下字体情况：Word for Mac 自带的字体（Calibri、Aptos、宋体等）一般放在 Word 的应用包里，其他程序用不到。在 WordCraft 的字体列表里查一下能不能看到 Calibri、Aptos 和宋体，结果写进 `run.yaml`。**不要为了测试另装字体。**
5. 截图前，WordCraft 和 Word 都设 100% 缩放、页面视图，两个窗口一样大。
6. 截图保存位置设到本轮的 `evidence/` 目录（Mac：⌘⇧5 › 选项 › 存储位置）。
7. 性能测试前接上电源，关掉低电量模式（pf-performance.md 有完整的条件）。
8. 测试前把 WordCraft 的设置目录清空或改名（Mac：`~/Library/Application Support/WordCraft`；Windows：`%APPDATA%\WordCraft`），`run.yaml` 里 `settings: fresh`。

### 3.4 测试文件和 Word 基准

DX 和 ZH 的 G 类文件由脚本生成，经 Word 打开并另存后才是正式测试文件。这样测试文件里是 Word 自己写的 XML，和读者收到的文件一样。只在 Mac 上做一次；Word 大版本更新后重做。

第 1–3 步和第 7 步在准备批 `prep` 里做。第 4–6 步拆到用到这些文件的那一批里，每批只核对、制作、下载本批要用的文件（[batches.md](batches.md)）。

1. 生成：`node tools/make-corpus.mjs`，输出在 `corpus/generated/`。
2. 批量另存：`osascript tools/word-baseline-mac.applescript "$PWD/corpus"`。脚本让 Word 依次打开每个文件，另存到 `corpus/docx/`，导出 PDF 到 `corpus/reference/word-mac/`。脚本出错就手动做这两步。
3. 三个文件的目录页码是脚本估算的，批量另存之后要补一步：在 Word 里打开 `corpus/docx/` 里的 DX-LAY-02、ZH-DOC-02、PF-DOC-500，全选后按 F9 更新域，保存，再重新导出 PDF。
4. **人工核对**：在 Word 里打开 `corpus/docx/` 里的每个文件，对照开头两行"Expected / 预期"检查。不符的记在 `corpus/baseline.yaml`，这个文件先不用，告诉编辑修生成脚本。
5. 按 [corpus/recipes.md](corpus/recipes.md) 在 Word 里做 W 类文件，同样存到 `corpus/docx/` 并导出 PDF。
6. 按 [corpus/real-world.md](corpus/real-world.md) 下载 R 类文件，在 Word 里直接导出 PDF（不另存）。
7. 有 Windows 版 Word 时：`.\tools\word-baseline-win.ps1` 从 `corpus/docx/` 导出 `reference/word-win/` 的 PDF（不另存），并记下每个文件在 Word 里的页数。

## 4. 套件、优先级和用时

- **P0**：第 1 轮先测的范围，各套件的第一个页面由这些用例的结果组成。
- **P1**：第 1 轮完整测试的范围，P0 测完后再做。
- **P2**：有时间再做，或者读者问到再做。

| 套件 | 用例 | P0 | P1 | 第 1 轮的批次（每台机器） |
|---|---|---|---|---|
| DX DOCX 兼容性 | 205 | 47 | 96 | 29 批 |
| ZH 中文排版 | 53 | 19 | 26 | 9 批 |
| PF 性能 | 22 | 11 | 9 | 6 批 |
| MC MCP 和命令行 | 24 | 10 | 10 | 4 批 |
| IN 下载、安装和网络 | 17 | 8 | 8 | 3 批，加最后的 `end` |
| ED 日常编辑 | 29 | 11 | 14 | 6 批 |
| AX 无障碍 | 15 | 5 | 9 | 3 批 |
| ST 稳定性和数据安全 | 14 | 5 | 8 | 3 批 |
| 合计 | 379 | 116 | 180 | P0 27 批（含准备），P1 38 批 |

用例数包括只在一个系统上测的用例，所以单台机器的数目略少，`new-run.mjs` 会列出准确的清单。

### 4.1 分批

全部测试拆成每批不超过约 1 小时的小批，测完一批就上线一批（[batches.md](batches.md)）。这样做是因为：

- 一位测试者很难连续抽出好几个小时，1 小时一批可以随时开始、随时停下；
- 读者能更早看到结果，页面一批一批地补全；
- WordCraft 更新很快，小批次的结果离当时的最新版更近。

每批由 batches.md 里的一行定义：批次代号、用例、Mac 上的估计用时和测完后更新哪些页面。每批的用时里包含约 10 分钟的固定部分（开始、复判上一批抽到的用例、检查和提交），测试本身约 45–50 分钟。一个批次一般只含一个套件的用例；同一批里个别 P1 用例，是因为它们和 P0 用例用同样的文件和步骤。

用时是估计值，前几批做完后按实际情况更新 batches.md。一批做不完，就停在用例之间，下一批先补上；不为了赶时间降低判定标准。

第 1 轮在每台机器上大约是 65 批，Mac 和 Windows 各做一遍。Windows 上没有 Word 时，版面对比的阶段记 `na`，每批会快一些。

## 5. 判定

### 5.1 等级

| 等级 | 含义 | 例子 |
|---|---|---|
| `pass` 一致 | 和 Word 参考看不出差别；功能按预期完成 | 同样的换行、分页和位置。只是同一种字体画得略有不同，不算差别 |
| `minor` 小差别 | 内容完整、格式基本对，有看得见但不影响使用的差别 | 某一段多换了一行，但页数不变；间距差一两磅；替代字体字形不同、字宽接近 |
| `major` 明显差别 | 内容还在，但格式或位置错到影响使用；或者要绕路才能完成 | 页数不同；表格列宽乱了；图片跑到别的页；编号错；要手动修好才能发给别人 |
| `fail` 失败 | 打不开；内容丢失或错误；崩溃、卡死；功能没有或者用不了 | 批注没了；公式显示成空白；打开时程序退出 |
| `na` 不适用 | 这台机器或这个用例不涉及 | 只有 Windows 版 Word 才有的功能，在 Mac 上 |
| `blocked` 受阻 | 前一步失败，这一步没法测 | O 是 `fail`，后面的阶段都记 `blocked` |
| `skip` 没测 | 这次没测，note 写原因 | 没有打印机 |

### 5.2 标记

| 标记 | 什么时候用 |
|---|---|
| `dataLoss` | 保存或往返之后，文字、图片、批注、修订、格式等内容消失了，而且没有任何提示。最严重的问题，页面上单独列出 |
| `crash` | 崩溃，或者 30 秒没有反应。同时在 ST-LOG-01 里记一笔 |
| `repair` | Word 打开 WordCraft 存的文件时提示"无法读取的内容"或要求修复 |
| `warning` | WordCraft 打开文件时给出提示。note 里照抄提示原文 |

### 5.3 阶段

| 代号 | 阶段 | 做什么 |
|---|---|---|
| O | 打开 | 在 WordCraft 里打开文件 |
| D | 显示 | 和 Word 参考同页、同缩放对比 |
| E | 编辑 | 做用例写明的编辑 |
| S | 交还 Word | WordCraft 另存，用 Word 打开，和原文件在 Word 里的样子对比 |
| R | 重开 | 在 WordCraft 里重新打开存出的文件，和保存前对比 |
| X | 导出 | 导出或转换，检查得到的文件 |
| T | 任务 | 按步骤完成任务 |
| M | 测量 | 记录数值 |

每个套件的说明里写了这些阶段在该套件里具体看什么。

### 5.4 规则

- 一个阶段只给一个等级，有几处问题时按最重的给。
- 拿不准时选更差的一级，note 里写原因。
- 因为本机没有某个字体、WordCraft 用了替代字体而造成的差别，照常给等级（读者遇到的就是这个结果），note 里写"字体替换：原字体 → 实际字体"。
- 上游文档写明不支持的功能，照样测、照样给等级。有没有提示、保存后东西还在不在，比"显示得对不对"更重要。
- 先写 note，再给等级。note 要写到不看截图也能明白：哪一页、哪个元素、和 Word 比怎么不同。

### 5.5 复判

每批收尾时用 `check-run.mjs --sample 10` 随机抽 10% 的用例（至少 1 个），在之后某一批的开头不看原记录重新判定，和第一次判定至少隔一天：下一批在同一天做的话，留到隔天的第一批。做法见 [runs/README.md](runs/README.md)。页面上报告两次判定的一致率。

## 6. 证据

**截图**

- 文件名：`<用例ID>-<阶段>-<软件>[-<序号>].png`，软件写 `wordcraft`、`word`、`pages`、`wps`、`gdocs`、`lo`、`system`（系统弹窗）。例：`DX-TBL-02-D-wordcraft.png`、`IN-INS-02-T-system-1.png`。
- 对比截图两边同一页、100% 缩放、窗口一样大，只截窗口，不截整个屏幕。
- 等级是 `minor`、`major`、`fail` 的阶段，至少一对截图（WordCraft 和 Word）。P0 用例即使 `pass` 也截一对，页面展示用。
- 截图里不能有个人信息：用户名、邮箱、真实文件名和路径。

**录屏**：启动、打开计时、输入法、卡顿和崩溃用录屏，命名同截图，扩展名 `.mov` 或 `.mp4`。

**文件**：WordCraft 保存或导出的文件放 `outputs/`，名为 `<ID>.wordcraft.<扩展名>`。

**日志**：每批测完把 WordCraft 日志复制到 `logs/<日期>.log`；崩溃后马上复制 `wordcraft.log` 和 `wordcraft.1.log`。位置：Mac `~/Library/Application Support/WordCraft/logs/`，Windows `%APPDATA%\WordCraft\logs\`。上游说日志里不写文档文字（IN-LOG-01 会核实）。

**命令输出**：签名检查、CLI、网络监控等的输出，存成 `evidence/<ID>-<说明>.txt`。

## 7. 记录

每一批一个记录目录，格式和工具见 [runs/README.md](runs/README.md)。每批的流程（详见 [batches.md](batches.md)）：

1. `node tools/new-run.mjs --os mac --version 0.10.0 --batch dx2 --from <上一批的目录>`。
2. 复判上一批抽到的用例。
3. 按本批的用例测，边测边填对应的 `.yaml`。
4. `node tools/check-run.mjs <本批目录> --sample 10`，修掉所有 error，记下要复判的用例，提交。

## 8. 回归测试

每个新版本发布后三天内，在 Mac 上做一个回归批 `reg`（约 55 分钟）：四个覆盖面最广的核心用例 DX-LAY-02、DX-REV-02、ZH-DOC-01、ZH-DOC-02。一周里出了几个版本，只回归最新的那个。

发布说明里提到修了我们判过非 `pass` 的用例时，把这些用例另排回归批（`--batch reg --add …`），每批照样控制在 1 小时内。

结果写进该版本的发布说明页（"实测变化"），测试页面上标出哪些结果已经在新版本上复测过。每隔大约一个月，或者上游宣布进入 Beta 时，在最新版本上重做一轮 P0。

## 9. 向上游报告问题

1. 先在 [WordCraft 的 issue](https://github.com/storytold/wordcraft/issues) 里搜，有人报过就在那条下面补充我们的版本、系统和测试文件。
2. 没有就新建：写清步骤、预期、实际结果、版本、系统，附上最小的测试文件（我们自己做的文件以 CC BY 4.0 提供）和截图、日志片段。
3. 把 issue 地址填进记录的 `issue` 字段。问题修好后，在回归测试里复测。

issue 只用来说明问题。不在 issue 里推广 GetWordCraft；只有测试文件和方法说明需要时才链接过来。

## 10. 公开

- 测试文件：见 [corpus/README.md](corpus/README.md)。我们做的文件以 CC BY 4.0 公开；第三方文档只公开来源和 SHA-256。
- 原始记录：`runs/` 里的 `run.yaml` 和各套件的记录、截图，整体公开。私有样本只公开汇总。
- 页面：在 [getwordcraft.org](https://getwordcraft.org) 上。每批测完后 1–2 天内写进页面上线，第一次出现的页面在它的第一批之后上线（[batches.md](batches.md)）。页面写明测试日期、版本、机器和参考的 Word 版本，计划和已测的用例数，链接到本方案和原始记录。

## 11. 局限

- 一位测试者，两台机器。判定有主观成分，用复判来控制。
- 参考是 Word for Mac；Windows 版 Word 有时显示略有不同，所以版面比较只在同一台机器上做。
- 测试文件和真实文档的样本有限，不代表所有文件。
- 结果只对写明的版本有效。WordCraft 更新很快，页面上的结果会标出是在哪个版本上测的。

## 修订记录

| 日期 | 版本 | 修改 |
|---|---|---|
| 2026-10-18 | 1.0 | 第一版：8 个套件，376 个用例，测试文件生成脚本和记录工具 |
| 2026-10-24 | 1.1 | 测试开始之前修订：改成每批约 1 小时、测完一批上线一批（§4.1、[batches.md](batches.md)），每批用当时的最新版（§3.1），一次性的准备拆进各批（§3.4），回归批缩到 4 个核心用例（§8）；`new-run.mjs` 加 `--batch`、`--add`、`--from`。用例按上游 0.8.0–0.10.0 的变化更新：ED-24 移到 ST-REC-01 并升为 P0（0.8.0 的崩溃恢复）；新增 DX-PRT-07（带密码的 .doc）、MC-CLI-08（脚本文件和密码）、IN-LAU-01（ArtCraft Launcher）；ST-LNG-01 从 2 小时缩到 45 分钟；ZH-PCT-03、ZH-ASN-04、ZH-INP-01、ZH-FNT-07、ZH-UI-01、DX-PRT-01、DX-PRT-04、DX-FMT-01、MC-CLI-02、IN-UPD-01 的说明按新版本改写。共 379 个用例，P0 116 个 |
| 2026-10-24 | 1.1 | 移到单独的公开仓库：路径从 `testing/` 改为仓库根目录，"本站"改称 GetWordCraft，脚本以 MIT 或 Apache-2.0 双许可、其余以 CC BY 4.0 公开。用例、等级和步骤没有改动 |
