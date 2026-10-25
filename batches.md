# 分批计划

> 方案 1.1 · 2026-10-24。每一批在一台机器上做，尽量不超过 1 小时；测完一批，就把这一批的结果写进页面上线。

## 每一批怎么做

每批的用时里都包含约 10 分钟的固定部分：

1. **开始（约 3 分钟）**：确认装的是不是最新的正式版（§版本），运行 `node tools/new-run.mjs --os mac --version <版本> --batch <批次> --from <上一批的目录>`。`--from` 会把上一批 `run.yaml` 里的机器、参考软件和字体信息带过来，只要核对有没有变。把 WordCraft 的设置文件夹改个名，让它以默认设置启动。
2. **复判（约 4 分钟）**：上一批结束时抽到的用例，不看原记录，重新判定，写进上一批记录的 `recheck`（README.md §5.5）。第一批没有这一步。
3. **测试（约 45–50 分钟）**：按下表的用例做。表里"准备"一栏的事算在这里面。
4. **收尾（约 3 分钟）**：`node tools/check-run.mjs <本批目录> --sample 10`，修掉所有 error，记下抽到的复判用例，提交。

做不完就停在用例之间，没做的留空，下一批先补上。不要为了赶时间降低标准：拿不准仍然选更差的一级。

### 版本

每一批开始时用当时最新的正式版。一批之内不换版本。上一批之后有了新版本，就先装新版本（下载、核对 SHA-256，约 5 分钟，算在这一批里），这一批的结果记在新版本上。已经测过的批次不因为新版本重测，由回归批（`reg`）跟进。

### 上线

- 测完一批后 1–2 天内上线：编辑把记录写进"测完上线"一栏的页面，过 content-gate，核对页面和记录一致，部署。
- 第一次出现的页面（`/tests`、`/tests/docx-compatibility`、`/zh/tests/chinese-typesetting`、`/tests/performance`、`/tests/accessibility`），第一批就要能单独回答一个读者的问题，下表的顺序是按这个排的。
- 页面写明"计划 M 个用例，已测 N 个"，没测的列为"未测"，不拿官方说法顶替。每个结果标出测试时的 WordCraft 版本；不同批次版本不同，就分别写。
- 中英文都出的页面，两种语言同一次更新。

## 第 1 轮：P0（每台机器 27 批）

Mac 先做，Windows 再按同样的批次做一遍。用例只在一个系统上测的（比如 IN-SIG-01 只在 Mac、IN-SIG-02 只在 Windows），`new-run.mjs` 会按系统挑出来。用时是 Mac 上的估计，第一批做完后按实际改。

| 批次 | 内容 | 用例 | Mac 用时 | 测完上线 |
|---|---|---|---|---|
| `prep` | 准备：测试用户、测试文件、Word 基准、网络监控 | — | 约 55 分钟，其中约 25 分钟是脚本在跑 | 不上线 |
| `in1` | 下载、签名、安装、首次启动和网络 | IN-DL-01 IN-SIG-01 IN-SIG-02 IN-INS-01 IN-INS-02 IN-1ST-01 IN-NET-01 IN-NET-02 PF-SIZE-01 | 约 55 分钟 | 新页面 `/tests`（方法、机器、进度）；`/download/macos`、`/download/windows` 换成实际看到的步骤和截图；`/safety` 加上签名和网络连接的实测 |
| `dx1` | 四份真实的 Word 文档 | DX-REAL-01 DX-REAL-02 DX-REAL-03 DX-REAL-04 | 约 57 分钟 | 新页面 `/tests/docx-compatibility` |
| `zh1` | 公文、学位论文、申请书和中文 PDF | ZH-DOC-01 ZH-DOC-02 ZH-DOC-03 ZH-OUT-01 | 约 55 分钟 | 新页面 `/zh/tests/chinese-typesetting` |
| `mc1` | 命令行和接入 Claude Code | MC-CLI-01 MC-CLI-02 MC-CLI-03 MC-CLI-06 MC-MCP-01 MC-MCP-02 | 约 50 分钟 | 改写 `/mcp` 的命令行和接入部分 |
| `mc2` | 修订、文件夹限制和控制端口 | MC-MCP-03 MC-SEC-01 MC-SEC-02 MC-SEC-05 | 约 55 分钟 | 改写 `/mcp` 的安全选项部分 |
| `st1` | 坏文件、磁盘满、保存时强制退出、崩溃后恢复 | ST-BAD-01 ST-SAV-01 ST-SAV-02 ST-SAV-03 ST-REC-01 | 约 55 分钟 | `/safety` 加"会不会丢文件"；`/tests` |
| `pf1` | 启动和空闲内存 | PF-START-01 PF-START-02 PF-MEM-01 | 约 55 分钟 | 新页面 `/tests/performance` |
| `dx2` | 文字和段落 | DX-TXT-01 DX-TXT-07 DX-PAR-01 DX-PAR-02 DX-PAR-03 DX-PAR-04 | 约 53 分钟 | `/tests/docx-compatibility` |
| `zh2` | 禁则、标点压缩、中西文间距、行距和文档网格 | ZH-PCT-01 ZH-PCT-02 ZH-PCT-03 ZH-PAR-02 ZH-PAR-03 | 约 50 分钟 | `/zh/tests/chinese-typesetting`；中文对比页和功能页里"中文版式"的说法 |
| `dx3` | 样式、列表和 Calibri | DX-STY-01 DX-STY-02 DX-LST-01 DX-LST-02 DX-LST-03 DX-FNT-02 | 约 55 分钟 | `/tests/docx-compatibility` |
| `pf2` | 打开大文档 | PF-OPEN-01 PF-OPEN-02 PF-OPEN-04 | 约 55 分钟 | `/tests/performance` |
| `dx4` | 表格、纸张和分节 | DX-TBL-01 DX-TBL-02 DX-TBL-03 DX-SEC-01 DX-SEC-02 DX-SEC-03 | 约 50 分钟 | `/tests/docx-compatibility` |
| `zh3` | 中文字体、字号、字符缩进和中文编号 | ZH-FNT-01 ZH-FNT-02 ZH-FNT-04 ZH-PAR-01 ZH-NUM-01 | 约 52 分钟 | `/zh/tests/chinese-typesetting` |
| `dx5` | 页眉页脚、图片和长报告的分页 | DX-HF-01 DX-HF-02 DX-IMG-01 DX-IMG-02 DX-LAY-01 DX-LAY-02 | 约 58 分钟 | `/tests/docx-compatibility` |
| `pf3` | 打字、滚动和大文档的内存 | PF-EDIT-01 PF-MEM-02 PF-EDIT-02 PF-CPU-01 | 约 52 分钟 | `/tests/performance` |
| `dx6` | 目录、脚注、链接和修订 | DX-REF-01 DX-REF-02 DX-REF-05 DX-REV-02 DX-REV-05 | 约 50 分钟 | `/tests/docx-compatibility` |
| `zh4` | 章节编号、中文目录、课表、输入法和字数统计 | ZH-NUM-02 ZH-NUM-04 ZH-TBL-01 ZH-INP-01 ZH-INP-04 | 约 55 分钟 | `/zh/tests/chinese-typesetting` |
| `dx7` | Word 里做的形状、文本框、公式和 Aptos（先按 recipes.md 做文件） | DX-SHP-01 DX-SHP-02 DX-OBJ-04 DX-FNT-01 | 约 57 分钟 | `/tests/docx-compatibility` |
| `pf4` | 保存、导出 PDF 和命令行转换 | PF-SAVE-01 PF-SAVE-02 PF-CLI-01 | 约 50 分钟 | `/tests/performance` |
| `dx8` | Word 里做的图表、SmartArt、批注和打开密码（先做文件） | DX-OBJ-01 DX-OBJ-03 DX-REV-01 DX-PRT-01 | 约 58 分钟 | `/tests/docx-compatibility` |
| `dx9` | .doc、导出 PDF、Google 文档和 WPS 写出的文件 | DX-FMT-01 DX-FMT-04 DX-PRD-02 DX-PRD-05 | 约 50 分钟 | `/tests/docx-compatibility`；`/zh/compare/wps` 加上实测 |
| `dx10` | 在 WordCraft 里新建，再交给 Word | DX-NEW-01 DX-NEW-02 DX-NEW-03 DX-NEW-04 | 约 48 分钟 | `/tests/docx-compatibility`；`/compare/microsoft-word` 加上实测 |
| `ed1` | 文字格式、样式、列表、查找替换 | ED-01 ED-02 ED-03 ED-17 | 约 46 分钟 | `/compare/microsoft-word`"能照搬的用法"加上实测 |
| `ed2` | 快捷键、表格和图片 | ED-22 ED-04 ED-05 | 约 50 分钟 | 同上 |
| `ed3` | 页眉页脚、目录、修订批注、和 Word 互相粘贴 | ED-07 ED-09 ED-13 ED-21 | 约 52 分钟 | 同上 |
| `ax1` | 读屏软件读正文、操作功能区，只用键盘 | AX-VO-01 AX-VO-02 AX-NV-01 AX-NV-02 AX-KB-01 | 约 55 分钟 | 新页面 `/tests/accessibility` |

`dx10`、`pf3`、`pf4` 和 `st1` 里有几个 P1 用例（DX-NEW-03、DX-NEW-04、PF-EDIT-02、PF-CPU-01、PF-CLI-01，以及只在 Windows 上测的 ST-SAV-02），它们用的文件和步骤与同一批的 P0 用例相同，放在一起更省时间。

### `prep` 做什么

只在每台机器第一次测试前做一次；Word 大版本更新后重做第 3–5 步。

1. 新建测试用的系统用户（README §3.3），在这个用户下装 Node.js（MCP Inspector 要用）和网络监控工具（Mac：LuLu；Windows：TCPView）。
2. `node tools/make-corpus.mjs` 生成测试文件。
3. 启动 Word 基准脚本（README §3.4 第 2 步），让它在后台跑。
4. 等脚本的时候，填好第一份 `run.yaml` 的机器、参考软件和字体信息（`new-run.mjs --batch prep` 会生成一份空白的）。
5. 脚本跑完后，更新 DX-LAY-02、ZH-DOC-02、PF-DOC-500 的目录（README §3.4 第 3 步）。脚本 1 小时内跑不完就让它继续，下一批开始前确认已经完成。

原来 §3.4 里一次做完的人工核对、W 类文件和 R 类文件，拆到用到它们的那一批里：每批先在 Word 里核对本批文件开头的"预期"两行（每个文件约 1 分钟），用到 W 类文件的先按 recipes.md 做，用到 R 类文件的先下载并在 Word 里导出参考 PDF。这些时间已经算进上表。

## 第 1 轮：P1（每台机器 38 批）

P0 全部测完后再做。顺序可以按读者的反馈调整；每批测完照样上线。P1 的用时只是粗估，P0 做完后按实际重排。

| 批次 | 内容 | 用例 | Mac 用时 | 测完上线 |
|---|---|---|---|---|
| `dx11` | 下划线、大小写、间距、底纹边框、符号字体、从右到左 | DX-TXT-02 DX-TXT-03 DX-TXT-04 DX-TXT-06 DX-TXT-08 DX-TXT-10 DX-PAR-06 | 约 51 分钟 | `/tests/docx-compatibility` |
| `dx12` | 制表位、分页控制、首字下沉、样式和编号细节、常见字体 | DX-PAR-05 DX-PAR-07 DX-PAR-08 DX-STY-03 DX-LST-04 DX-LST-06 DX-FNT-03 | 约 54 分钟 | 同上 |
| `dx13` | 表格细节和缺失的字体 | DX-TBL-04 DX-TBL-05 DX-TBL-06 DX-TBL-07 DX-TBL-09 DX-TBL-11 DX-TBL-12 DX-FNT-04 | 约 55 分钟 | 同上 |
| `dx14` | 分栏、页面边框、各节页眉、兼容模式、图片定位和裁剪 | DX-SEC-04 DX-SEC-05 DX-HF-03 DX-HF-04 DX-LAY-03 DX-IMG-03 DX-IMG-04 | 约 54 分钟 | 同上 |
| `dx15` | 图片格式、替代文字、大照片、题注、交叉引用、书签和索引 | DX-IMG-05 DX-IMG-07 DX-IMG-09 DX-REF-03 DX-REF-04 DX-REF-06 DX-REF-07 | 约 53 分钟 | 同上 |
| `dx16` | 域，Word 里做的主题和表格样式 | DX-FLD-01 DX-FLD-02 DX-STY-04 DX-STY-06 | 约 48 分钟 | 同上 |
| `dx17` | Word 里做的链接文本框、组合、流程图和艺术字 | DX-SHP-03 DX-SHP-04 DX-SHP-05 DX-SHP-07 | 约 53 分钟 | 同上 |
| `dx18` | 封面、水印、WordCraft 不画的图表、嵌入的 Excel | DX-SHP-08 DX-SEC-09 DX-OBJ-02 DX-OBJ-05 | 约 56 分钟 | 同上 |
| `dx19` | 图标、引文和书目、移动修订、表格里的修订 | DX-OBJ-08 DX-REF-08 DX-REV-03 DX-REV-04 | 约 54 分钟 | 同上 |
| `dx20` | 真实修订、内容控件、旧式窗体域、限制编辑 | DX-REV-07 DX-CC-01 DX-CC-02 DX-PRT-02 | 约 56 分钟 | 同上 |
| `dx21` | 宏文档、嵌入字体、RTF 和 ODT | DX-PRT-03 DX-FNT-05 DX-FMT-02 DX-FMT-03 | 约 52 分钟 | 同上；`/compare/libreoffice` 加上 ODT 的实测 |
| `dx22` | Word 2003 XML、扩展名不符、带密码的 .doc、其他软件写出的文件 | DX-FMT-06 DX-PKG-01 DX-PRT-07 DX-PRD-03 DX-PRD-04 DX-PRD-01 | 约 53 分钟 | 同上 |
| `dx23` | 真实文档：Microsoft 模板和英国政府合同 | DX-REAL-05 DX-REAL-06 DX-REAL-07 DX-REAL-08 | 约 54 分钟 | 同上 |
| `dx24` | 真实文档：美国政府报告、英文学位论文；新建后交给 Word | DX-REAL-09 DX-REAL-10 DX-NEW-05 DX-NEW-07 | 约 50 分钟 | 同上 |
| `dx25` | 私有样本 1–4 | DX-PRIV-01 DX-PRIV-02 DX-PRIV-03 DX-PRIV-04 | 约 50 分钟 | 只公开汇总 |
| `dx26` | 私有样本 5–8 | DX-PRIV-05 DX-PRIV-06 DX-PRIV-07 DX-PRIV-08 | 约 50 分钟 | 同上 |
| `dx27` | 私有样本 9–12 | DX-PRIV-09 DX-PRIV-10 DX-PRIV-11 DX-PRIV-12 | 约 50 分钟 | 同上 |
| `dx28` | 私有样本 13–16 | DX-PRIV-13 DX-PRIV-14 DX-PRIV-15 DX-PRIV-16 | 约 50 分钟 | 同上 |
| `dx29` | 私有样本 17–20 | DX-PRIV-17 DX-PRIV-18 DX-PRIV-19 DX-PRIV-20 | 约 50 分钟 | 同上 |
| `zh5` | 字体列表、中西文字体、生僻字、对齐、行高、标点溢出、英文换行 | ZH-FNT-03 ZH-FNT-05 ZH-FNT-06 ZH-PAR-04 ZH-PAR-05 ZH-PCT-04 ZH-PCT-05 | 约 55 分钟 | `/zh/tests/chinese-typesetting` |
| `zh6` | 拼音指南、带圈字符、竖排、双行合一、中文页码 | ZH-ASN-01 ZH-ASN-02 ZH-ASN-03 ZH-ASN-04 ZH-NUM-03 | 约 52 分钟 | 同上 |
| `zh7` | 中文标点输入、第三方输入法、选择和光标、查找替换、拼写误报、题注 | ZH-PCT-06 ZH-INP-02 ZH-INP-03 ZH-INP-05 ZH-INP-06 ZH-NUM-05 | 约 55 分钟 | 同上 |
| `zh8` | 中文邮件合并、中文路径、高校论文模板、WPS 简历 | ZH-INP-07 ZH-OUT-02 ZH-DOC-04 ZH-DOC-05 | 约 54 分钟 | 同上；`/zh/compare/wps` |
| `zh9` | 中文合同、写好交给 Word、中文界面和术语 | ZH-DOC-06 ZH-DOC-07 ZH-UI-01 ZH-UI-03 | 约 55 分钟 | 同上 |
| `pf5` | 1000 页、5000 行表格和 300 页中文文档 | PF-OPEN-03 PF-OPEN-05 PF-OPEN-06 | 约 55 分钟 | `/tests/performance` |
| `pf6` | 全部替换、更新目录、长时间编辑的内存 | PF-EDIT-03 PF-EDIT-04 PF-MEM-03 | 约 56 分钟 | 同上 |
| `mc3` | 其他格式的转换、text 和 inspect、脚本文件、只读目录、目录不存在、渲染页面 | MC-CLI-04 MC-CLI-05 MC-CLI-08 MC-SEC-03 MC-SEC-04 MC-MCP-04 | 约 53 分钟 | `/mcp` |
| `mc4` | 其他 MCP 客户端、操作正在运行的 App、密钥文件、只监听本机 | MC-MCP-05 MC-MCP-06 MC-SEC-06 MC-SEC-07 | 约 48 分钟 | 同上 |
| `in2` | 文件关联、显卡和日志；Windows 便携版和标准用户 | IN-ASC-01 IN-GPU-01 IN-LOG-01 IN-INS-03 IN-INS-04 | Mac 约 30 分钟，Windows 约 55 分钟 | 下载页；`/safety`（日志） |
| `in3` | 升级和 ArtCraft Launcher | IN-UPD-01 IN-LAU-01 | 约 35 分钟 | 下载页的"如何更新" |
| `ed4` | 形状、横向页、脚注、题注、视图 | ED-06 ED-08 ED-10 ED-11 ED-27 | 约 54 分钟 | `/compare/microsoft-word` |
| `ed5` | 引文、比较文档、邮件合并、撤销 | ED-12 ED-14 ED-15 ED-20 | 约 52 分钟 | 同上 |
| `ed6` | 拼写语法、自动更正、打印、检查器、拖放 | ED-18 ED-19 ED-23 ED-25 ED-30 | 约 56 分钟 | 同上 |
| `ax2` | 打字和选择、转子、讲述人、焦点、辅助功能检查器 | AX-VO-03 AX-VO-04 AX-NV-03 AX-NR-01 AX-KB-02 AX-CHK-01 | 约 50 分钟 | `/tests/accessibility` |
| `ax3` | 高对比度、缩放和大字、减弱动态效果 | AX-VIS-01 AX-VIS-02 AX-VIS-03 | 约 30 分钟 | 同上 |
| `st2` | 坏文件、云盘和网络位置、同时被 Word 打开、只读 | ST-BAD-02 ST-BAD-03 ST-BAD-04 ST-SAV-04 ST-SAV-05 ST-SAV-06 | 约 54 分钟 | `/safety` |
| `st3` | 连续使用 45 分钟 | ST-LNG-01 | 约 55 分钟 | `/safety`、`/tests/performance` |
| `end` | 卸载和这一轮的汇总 | IN-UNI-01 | 约 30 分钟 | 下载页的"卸载"；`/tests` 写这一轮的汇总 |

`end` 要放在最后，因为卸载以后就不能接着测了。P2 用例不排进第 1 轮，读者问到或者有空时再按同样的规则排批。

## 回归批 `reg`

新版本发布后三天内在 Mac 上做一批，约 55 分钟：

| 批次 | 内容 | 用例 | Mac 用时 | 测完上线 |
|---|---|---|---|---|
| `reg` | 回归：四个覆盖面最广的用例 | DX-LAY-02 DX-REV-02 ZH-DOC-01 ZH-DOC-02 | 约 55 分钟 | 该版本的发布说明页加"实测变化"；测试页标出复测过的版本 |

- 发布说明里提到修了我们判过非 `pass` 的用例，就把这些用例另排一批回归（`new-run.mjs --batch reg --add DX-TBL-02,ZH-PCT-01`，用 `--add` 加用例、按 1 小时控制数量），不和上面的四个挤在一批里。
- 一周里出了好几个版本，只回归最新的那个。
- 大约每个月，或者上游宣布进入 Beta 时，在最新版本上重做一轮 P0。
