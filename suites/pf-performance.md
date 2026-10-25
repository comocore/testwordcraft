# PF：性能

回答"它快不快、占不占资源"：启动、打开大文件、打字、滚动、保存、导出 PDF 的耗时和内存，在同一台机器上和 Word 对比。

依据：上游 README 说"typing in a 188-page document re-lays it out in about 1.4 ms"；`docs/gaps.md` #20 说大型真实文档（500 页以上、图片很多）"unmeasured"；`docs/layout-parity.md` 说 1,096 页的单表格文档"opening it still lays out for ~4–8 s"，Word 一栏全是"not measured"。

## 对比的软件

WordCraft 和 Word 必测。LibreOffice、WPS（Windows）有就一起测，在记录的 `other` 里写明软件和版本。每台机器、每个软件都用同一批文件。

## 测量条件

- 接电源；Mac 关闭"低电量模式"；Windows 电源模式记在 `run.yaml` 里，不要中途改。
- 退出其他程序（浏览器、同步盘、聊天软件），只留计时用的东西。开机后等 3 分钟再测。
- 文件放在本机磁盘上，不放云盘或移动硬盘。
- 每项测 5 次，记下全部 5 个数，页面上报中位数和范围。不删数据；某次明显异常（比中位数慢一倍以上），在 note 里写原因并补测一次，两个数都留着。

## 计时方法

需要秒级以下精度的项目（启动、打开、保存）用录屏加屏幕秒表：

1. 用浏览器打开 `tools/stopwatch.html`，把窗口缩小放在屏幕角落。它显示毫秒级的计时。
2. 开始录屏：Mac 用 ⌘⇧5，选项里勾"显示鼠标点按"；Windows 用 Win+Alt+R（Xbox Game Bar，设为 60 帧）或 OBS。
3. 做操作。起点是鼠标按下（Mac 录屏里出现点按的圆圈）或按下快捷键的那一帧；终点见各用例的定义。
4. 在播放器里逐帧（QuickTime 或 IINA 用 ← →，VLC 用 E）找到起点帧和终点帧，读出两帧上秒表的数，相减。

不需要精确到 0.1 秒的项目（全部替换、更新目录、导出 PDF）可以直接看秒表。

冷启动：Mac 在终端运行 `sudo purge` 清掉磁盘缓存，等 30 秒再启动；Windows 用 Sysinternals 的 RAMMap（以管理员身份运行）菜单 Empty › Empty Standby List。每次冷启动前都做一遍。热启动：退出程序后马上再启动。

内存和 CPU：Mac 用 `tools/sample-memory-mac.sh <进程名> <秒数>`，同时记下"活动监视器"里"内存"一栏的数（两者口径不同，都记）；Windows 用 `tools/sample-memory-win.ps1 -Name <进程名> -Seconds <秒数>`，同时记下任务管理器"详细信息"页"内存(活动的专用工作集)"一栏的数。进程名第一次测时在活动监视器或任务管理器里查清楚，写进 `run.yaml`。

## 用例

阶段都是 M（测量）。"文件"一栏是 `corpus/docx/` 里的文件名。

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| PF-SIZE-01 | P0 | Mac Win | M | — | 下载和安装体积 | 安装包大小；安装后占用（Mac：`du -sh /Applications/<应用>.app`；Windows：安装目录的属性）。单位 MB |
| PF-START-01 | P0 | Mac Win | M | — | 冷启动 | 终点：出现可以输入的空白文档（光标在闪）。如果程序先显示开始页，终点是开始页完全显示，在 note 里说明。5 次，单位秒 |
| PF-START-02 | P0 | Mac Win | M | — | 热启动 | 同上，退出后立即再启动 |
| PF-OPEN-01 | P0 | Mac Win | M | G | 打开 100 页文档 | PF-DOC-100：程序已启动，用"打开"对话框打开。终点：第一页完整显示。另记"总页数稳定下来"的时间（状态栏页数不再变）。单位秒 |
| PF-OPEN-02 | P0 | Mac Win | M | G | 打开 500 页文档 | PF-DOC-500（论文规模，带目录和脚注）。同上 |
| PF-OPEN-03 | P1 | Mac Win | M | G | 打开 1000 页文档 | PF-DOC-1000。同上 |
| PF-OPEN-04 | P0 | Mac Win | M | G | 打开带 150 张照片的文档 | PF-DOC-IMG（约 50 MB）。同上，另记翻到最后一页时图片是否都显示 |
| PF-OPEN-05 | P1 | Mac Win | M | G | 打开 5000 行的表格 | PF-DOC-TABLE。上游测过滚动，打开要 4–8 秒 |
| PF-OPEN-06 | P1 | Mac Win | M | G | 打开 300 页中文文档 | PF-DOC-ZH |
| PF-OPEN-07 | P2 | Mac Win | M | G | 打开修订和批注很多的文档 | PF-DOC-REVIEW：2000 处修订、300 条批注 |
| PF-EDIT-01 | P0 | Mac Win | M | G | 长文档里打字 | 打开 PF-DOC-500，跳到第 250 页，在段落中间连续打字 1 分钟（录屏）。逐帧看有没有字晚出现、掉字、光标跳。等级：没有可见延迟记 pass，偶尔可见记 minor，持续可见记 major，卡住记 fail；数字栏填你估计的最长延迟（秒）。可选：用 Typometer 测输入延迟，结果写在 note |
| PF-EDIT-02 | P1 | Mac Win | M | G | 滚动 | PF-DOC-500 和 PF-DOC-IMG：拖动滚动条用约 2 秒从头拖到尾；再用触控板或滚轮快速滚动 10 秒。看白页、卡顿（录屏）。等级同上 |
| PF-EDIT-03 | P1 | Mac Win | M | G | 全部替换 | PF-DOC-500：把 "the"（全字匹配、区分大小写）全部替换为 "THE"。记耗时和替换次数（应和 Word 一致） |
| PF-EDIT-04 | P1 | Mac Win | M | G | 更新目录 | PF-DOC-500：更新整个目录（页码和标题）的耗时 |
| PF-SAVE-01 | P0 | Mac Win | M | G | 保存 | PF-DOC-500 和 PF-DOC-IMG：改一个字后另存为新文件的耗时，以及新文件大小和原文件大小 |
| PF-SAVE-02 | P0 | Mac Win | M | G | 导出 PDF | PF-DOC-500 导出 PDF 的耗时和 PDF 大小、页数 |
| PF-MEM-01 | P0 | Mac Win | M | — | 空闲内存 | 启动后打开空白文档，等 30 秒。单位 MB |
| PF-MEM-02 | P0 | Mac Win | M | G | 大文档的内存 | 分别打开 PF-DOC-500 和 PF-DOC-IMG，翻到最后一页，等 30 秒后记内存；同时用采样脚本记 2 分钟 |
| PF-MEM-03 | P1 | Mac Win | M | G | 长时间编辑的内存增长 | 打开 PF-DOC-100，按下面的"固定编辑循环"做 30 分钟，每 5 分钟记一次内存（7 个数） |
| PF-CPU-01 | P1 | Mac Win | M | — | 空闲时的 CPU | 打开 PF-DOC-100 后不动，用采样脚本记 2 分钟的平均 CPU 占用。上游的光标有闪烁和滑动动画，看它是否持续占 CPU |
| PF-CLI-01 | P1 | Mac Win | M | G | 命令行转换速度 | `wordcraft-cli convert` 把 PF-DOC-100、PF-DOC-500 转成 PDF。Mac 用 `time`，Windows 用 `Measure-Command { … }`。5 次 |
| PF-LOW-01 | P2 | Win | M | — | 旧电脑或集成显卡 | 如果有老电脑（如 Intel 核显、8 GB 以下内存）：冷启动、打开 PF-DOC-100、滚动。上游说没有 DirectX 12 驱动时改用 OpenGL；日志里 `graphics:` 开头的行记下用了哪个 |

## 固定编辑循环

PF-MEM-03 和 ST-LNG-01 用。每个循环约 5 分钟，按顺序做：

1. 跳到第 10 页一个段落中间，输入一句话（约 50 个字符）。
2. 选中这一段，加粗，再取消加粗。
3. 在段落后插入 3×3 表格，在每个格子里输入一个数。
4. 撤销 3 次，再重做 3 次。
5. 拖动滚动条到最后一页，再回到第 1 页。
6. 把一段的字体改成 Georgia，再改回来。
7. 查找 "page"，跳到下一个结果 5 次。
8. 另存为 `outputs/PF-MEM-03-<循环号>.docx`。

## 记录

记录模板里每个 PF 用例有 `wordcraft`、`word`、`other` 三个列表，各填 5 个数（按测量顺序），单位写在 `unit`。打字和滚动两项另有等级字段 `M`。
