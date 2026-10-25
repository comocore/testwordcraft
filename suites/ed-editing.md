# ED：日常编辑

一个 Word 用户每天要做的事，在 WordCraft 里能不能照原来的方法做完，结果是否一样。每项都先在 Word 里做一遍，再在 WordCraft 里用同样的方法做。

判定：照 Word 的方法能做完、结果一样，记 `pass`；能做完但方法或结果有小差别，记 `minor`；要绕路才能做完，或结果明显不同，记 `major`；做不到，记 `fail`。note 里写清楚差在哪一步。

需要文件的用例从 `corpus/docx/` 取；用例里没写文件的，新建一个空白文档来做。

## 用例

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| ED-01 | P0 | Mac Win | T | — | 文字格式和格式刷 | 选中文字后加粗、倾斜，改字体、字号、颜色；单击格式刷刷一次；双击格式刷连续刷三处后按 Esc；清除格式 |
| ED-02 | P0 | Mac Win | T | — | 样式 | 应用标题 1；右键样式库里的样式 › 修改（字号、颜色）；从所选内容新建样式；"更新样式以匹配所选内容" |
| ED-03 | P0 | Mac Win | T | — | 列表的回车和 Tab | 输入 `1. ` 后自动变成编号，`* ` 变成项目符号；回车续号；空项回车结束列表；Tab 降级、Shift+Tab 升级；退格键删掉编号。逐项和 Word 比 |
| ED-04 | P0 | Mac Win | T | — | 表格操作 | 按网格插入 4×4 表格；Tab 移到下一格，在最后一格按 Tab 加一行；合并、拆分；拖动列线；套用表格样式；重复标题行；按第二列排序；把一段用制表符分隔的文字转成表格 |
| ED-05 | P0 | Mac Win | T | — | 图片 | 用菜单、拖入文件、粘贴截图三种方法插入；拖角点缩放；裁剪；改成四周型环绕后拖到别处（上游 #82）；加替代文字 |
| ED-06 | P1 | Mac Win | T | — | 形状和文本框 | 插入形状并在里面打字；插入文本框；对齐两个形状；组合（上游 #142） |
| ED-07 | P0 | Mac Win | T | — | 页眉页脚和页码 | 双击页面顶部进入页眉；插入页码；设首页不同、奇偶页不同；双击正文退出 |
| ED-08 | P1 | Mac Win | T | — | 分节和横向页 | 在第 2 页插入一个横向页，前后保持纵向，页码连续 |
| ED-09 | P0 | Mac Win | T | — | 目录 | 设好三级标题后插入自动目录；改一个标题后更新目录；点目录项跳转 |
| ED-10 | P1 | Mac Win | T | — | 脚注和尾注 | 插入、删除；把全部脚注转成尾注；改编号格式 |
| ED-11 | P1 | Mac Win | T | — | 题注和交叉引用 | 给两张图加题注；插入一个交叉引用；在前面插入新图后更新 |
| ED-12 | P1 | Mac Win | T | — | 引文和书目 | 新建来源、插入引文、插入书目；依次换成 APA、MLA、Chicago、IEEE |
| ED-13 | P0 | Mac Win | T | — | 修订和批注 | 在选项里设用户名；开启修订后改动；加批注、回复；上一条下一条；接受、拒绝；切换"显示标记"的几种视图 |
| ED-14 | P1 | Mac Win | T | G | 比较文档 | 复制 DX-LAY-01，在副本里改 5 处，再用"比较"对比两份。结果和 Word 的比较结果对照 |
| ED-15 | P1 | Mac Win | T | G | 邮件合并 | 用 `ED-15-recipients.csv` 和 `.xlsx`（在 `corpus/generated/`）做信函合并：插入合并域、地址块、问候语，预览，完成合并到新文档 |
| ED-16 | P2 | Mac Win | T | — | 信封和标签 | 做一个信封、一页地址标签 |
| ED-17 | P0 | Mac Win | T | — | 查找和替换 | 用 DX-LAY-01：普通查找、全字匹配、区分大小写、通配符（或正则）、替换格式（把 "page" 全部改成红色）、导航窗格搜索 |
| ED-18 | P1 | Mac Win | T | G | 英文拼写和语法 | 打开 ED-18，按附表 2 核对：标出了几个、建议对不对、误报几个（倒数第二句里的专有名词不应被标出）。和 Word 的结果并列记下 |
| ED-19 | P1 | Mac Win | T | — | 自动更正 | 智能引号、`--` 变破折号、`(c)` 变 ©、句首自动大写、"TWo INitial CApitals"的更正 |
| ED-20 | P1 | Mac Win | T | — | 撤销和重做 | 连续做 50 步各种操作，撤销到底，再全部重做；文档应和开始时、结束时都一致 |
| ED-21 | P0 | Mac Win | T | — | 和 Word 互相复制粘贴 | Word → WordCraft、WordCraft → Word 两个方向，各粘贴：带格式的文字、表格、图片、编号列表、公式（DX-OBJ-04）。上游说复制公式时剪贴板里放的是 MathML，粘贴到 Word 的效果没验证过 |
| ED-22 | P0 | Mac Win | T | — | 常用快捷键 | 按附表 1 逐条试，记下不支持或行为不同的 |
| ED-23 | P1 | Mac Win | T | G | 打印 | 有打印机时：打印 DX-LAY-02 的第 2–3 页，双面、灰度，和 Word 打印出的纸对比（对着光叠在一起看）。上游说实际打印效果"needs hardware validation"。没有打印机记 `skip` |
| ED-25 | P1 | Mac Win | T | G | 文档检查器和辅助功能检查器 | 用 DX-REV-01 跑文档检查器，用 AX-DOC-BAD 跑辅助功能检查器，和 Word 列出的问题对照 |
| ED-26 | P2 | Mac Win | T | — | 朗读 | 审阅 › 朗读：语速、跳句；中文能否朗读 |
| ED-27 | P1 | Mac Win | T | — | 视图 | 页面视图、阅读模式、草稿、Web 版式、专注模式、多页、缩放；深色模式下文档的颜色 |
| ED-28 | P2 | Mac Win | T | — | 自定义功能区和快速访问工具栏 | 加一个按钮、移除一个，重启后是否保留 |
| ED-29 | P2 | Mac Win | T | — | 界面语言 | 不改系统语言，在 WordCraft 里切换界面语言：能否切换，要不要重启 |
| ED-30 | P1 | Mac Win | T | — | 拖放 | 把文件拖进窗口打开；把图片拖进文档；在文档里拖动选中的文字（上游说还不支持拖动文字） |

ED-24（自动保存和恢复）在方案 1.1 移到了 [ST-REC-01](st-stability.md)，升为 P0。

## 附表 1：常用快捷键（ED-22）

先在 Word 里试一遍，以 Word 的实际行为为准；表里的 Mac 写法如果在你的 Word 里不对，按 Word 改正后再测 WordCraft，并在 note 里写明。Word 里也不起作用的那条记 `na`。

| # | 功能 | Windows | Mac |
|---|---|---|---|
| 1 | 加粗 | Ctrl+B | ⌘B |
| 2 | 倾斜 | Ctrl+I | ⌘I |
| 3 | 下划线 | Ctrl+U | ⌘U |
| 4 | 撤销 | Ctrl+Z | ⌘Z |
| 5 | 重做或重复 | Ctrl+Y | ⌘Y |
| 6 | 剪切、复制、粘贴 | Ctrl+X / C / V | ⌘X / C / V |
| 7 | 全选 | Ctrl+A | ⌘A |
| 8 | 查找 | Ctrl+F | ⌘F |
| 9 | 替换 | Ctrl+H | ⌃H |
| 10 | 保存 | Ctrl+S | ⌘S |
| 11 | 另存为 | F12 | ⌘⇧S |
| 12 | 打开 | Ctrl+O | ⌘O |
| 13 | 新建 | Ctrl+N | ⌘N |
| 14 | 打印 | Ctrl+P | ⌘P |
| 15 | 居中 | Ctrl+E | ⌘E |
| 16 | 左对齐 | Ctrl+L | ⌘L |
| 17 | 右对齐 | Ctrl+R | ⌘R |
| 18 | 两端对齐 | Ctrl+J | ⌘J |
| 19 | 增大字号 | Ctrl+Shift+> | ⌘⇧> |
| 20 | 减小字号 | Ctrl+Shift+< | ⌘⇧< |
| 21 | 上标 | Ctrl+Shift+= | ⌘⇧= |
| 22 | 下标 | Ctrl+= | ⌘= |
| 23 | 清除字符格式 | Ctrl+Space | ⌃Space |
| 24 | 复制格式 | Ctrl+Shift+C | ⌘⇧C |
| 25 | 粘贴格式 | Ctrl+Shift+V | ⌘⇧V |
| 26 | 标题 1、2、3 | Ctrl+Alt+1 / 2 / 3 | ⌘⌥1 / 2 / 3 |
| 27 | 正文样式 | Ctrl+Shift+N | ⌘⇧N |
| 28 | 项目符号列表 | Ctrl+Shift+L | ⌘⇧L |
| 29 | 分页符 | Ctrl+Enter | ⌘Return |
| 30 | 换行符 | Shift+Enter | ⇧Return |
| 31 | 超链接 | Ctrl+K | ⌘K |
| 32 | 脚注 | Ctrl+Alt+F | ⌘⌥F |
| 33 | 尾注 | Ctrl+Alt+D | ⌘⌥E |
| 34 | 批注 | Ctrl+Alt+M | ⌘⌥A |
| 35 | 修订开关 | Ctrl+Shift+E | ⌘⇧E |
| 36 | 字数统计 | Ctrl+Shift+G | ⌘⇧G |
| 37 | 拼写和语法 | F7 | ⌥⌘L |
| 38 | 更新域 | F9 | F9 |
| 39 | 切换域代码 | Alt+F9 | ⌥F9 |
| 40 | 重复上一步操作 | F4 | ⌘Y |
| 41 | 扩展选择 | F8 | F8 |
| 42 | 按词移动 | Ctrl+← / → | ⌥← / → |
| 43 | 段落上移、下移 | Alt+Shift+↑ / ↓ | ⌃⇧↑ / ↓ |
| 44 | 字体对话框 | Ctrl+D | ⌘D |
| 45 | 更改大小写 | Shift+F3 | ⇧F3 |
| 46 | 删除前一个词 | Ctrl+Backspace | ⌥Delete |

## 附表 2：ED-18 里的错误

拼写（12 个）：recieve、seperate、definately、accomodate、occurence、untill、wich、Teh、adress、becuase、lenght、comittee。

语法（8 个）：a apple、a orange、The reports was、the tables is、Its raining、their going、the the、could of。

不应标出的专有名词：WordCraft、GitHub、macOS、PowerShell。
