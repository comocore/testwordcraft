# DX：DOCX 兼容性

回答读者最常问的问题：别人发来的 Word 文件，用 WordCraft 打开是不是一样；改完存回 .docx，对方用 Word 打开是不是还一样。

上游 `docs/gaps.md`（v0.7.0）把"从没在真实 .docx 上测过"列为第 1 号差距，原文是："No corpus of files from Word, Google Docs, LibreOffice and Pages has been opened, rendered and round-tripped and compared with Word page by page"。本套件做的就是这件事：特性探针（每个文件只测一类功能）、其他软件写出的文件、真实文档，三类一起测。

## 准备

- 完成 [README.md](../README.md) §3 的准备和 §3.4 的 Word 基准。测试用的是 `corpus/docx/` 里经 Word 另存的文件，不是 `corpus/generated/` 里的源文件。
- 每个文件开头两行是用例编号和"Expected / 预期"，写着正确显示时应该看到什么。和 Word 参考对比时，先读这两行。
- WordCraft 和 Word 都设成 100% 缩放、页面视图，两个窗口一样大，左右并排。
- WordCraft 保存的文件一律用"另存为"，存到本轮的 `outputs/<ID>.wordcraft.docx`，不要覆盖测试文件。

## 每个用例的流程

| 阶段 | 做什么 | 看什么 |
|---|---|---|
| O 打开 | 在 WordCraft 里打开 `corpus/docx/<ID>.docx` | 有没有提示（照抄原文）；超过 5 秒的记下秒数；有没有崩溃或卡住 |
| D 显示 | 和 Word 同一页对比，从第 1 页翻到最后一页 | 文字有没有丢或错；格式（字体、字号、颜色、样式）；换行位置；分页位置和总页数；图片、表格、形状的位置；页眉页脚 |
| E 编辑 | 做"怎么测"一栏写的编辑；没写的，在正文末尾输入一句话，再把一个词设成粗体 | 编辑的效果和 Word 里做同样操作是否一样；有没有影响别处 |
| S 交还 Word | 另存为 `outputs/<ID>.wordcraft.docx`，用 Word 打开，和原文件在 Word 里的样子对比 | Word 有没有提示"无法读取的内容"或要求修复（有就记 `repair`）；内容有没有丢（有就记 `dataLoss`）；E 阶段的编辑是否还在 |
| R 重开 | 关掉 WordCraft 里的文件，重新打开 `outputs/<ID>.wordcraft.docx` | 和保存前在 WordCraft 里的样子是否一致 |

等级的定义见 [README.md](../README.md) §5。几点提醒：

- 页数不同，D 至少记 `major`。只有某几行的换行位置不同、页数相同，记 `minor`，并在 note 里写清是哪几页。
- 因为本机缺字体而用了替代字体：照常给等级，note 里写"字体替换：原字体 → 实际字体"。
- S 阶段比较的是"WordCraft 存出的文件在 Word 里"和"原文件在 Word 里"，不是和 WordCraft 比。
- 遇到上游文档写明不支持的功能：照常测、照常给等级。重点看保存后东西还在不在，丢了而且没有提示就记 `dataLoss`。

## 用例

来源：G 由脚本生成，再经 Word 基准另存；W 按 [recipes.md](../corpus/recipes.md) 在 Word 里制作；R 是真实文档，见 [real-world.md](../corpus/real-world.md)；P 由其他软件导出，见本页"其他软件写出的文件"；N 在 WordCraft 里新建；"—"表示用别的用例的文件。

### TXT 文字和字符格式

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-TXT-01 | P0 | Mac Win | O D E S R | G | 基本字符格式 | 粗体、斜体、下划线、删除线、上下标、8–28 磅、颜色、突出显示各一行。E：把第 2 行改成红色加粗 |
| DX-TXT-02 | P1 | Mac Win | O D S | G | 下划线样式 | 双线、粗线、点线、虚线、点划线、波浪线、彩色下划线、仅字词下划线 |
| DX-TXT-03 | P1 | Mac Win | O D S R | G | 大小写和隐藏文字 | 全部大写、小型大写、隐藏文字。D 时在显示和不显示隐藏文字两种状态下各比一次 |
| DX-TXT-04 | P1 | Mac Win | O D S | G | 字符间距、缩放和位置 | 加宽、紧缩、缩放 50%/150%/200%、提升降低 3 磅、字距调整。看每行结束的位置 |
| DX-TXT-05 | P2 | Mac Win | O D S | G | 字体效果 | 双删除线、空心、阴影、阳文、阴文 |
| DX-TXT-06 | P1 | Mac Win | O D S | G | 字符底纹和边框 | 灰色底纹、字符边框、浅黄底纹 |
| DX-TXT-07 | P0 | Mac Win | O D E S R | G | 特殊字符 | 不间断空格、不间断连字符、可选连字符、制表符、手动换行、破折号、省略号、© ® ™、emoji。最后一段让它们落在行尾附近。E：在 emoji 后面输入一个字，看光标位置 |
| DX-TXT-08 | P1 | Mac Win | O D S | G | 符号字体 | Symbol 和 Wingdings 字符，分"直接输入"和"插入符号"两种写法。0.7.0 起应显示成对应符号；S：在 Word 里应仍是原字体的字符 |
| DX-TXT-09 | P2 | Mac Win | O D S | G | 其他文字 | 希腊、西里尔、越南、天城文和泰文。上游说泰文只在空格处换行，天城文没测过 |
| DX-TXT-10 | P1 | Mac Win | O D E S R | G | 从右到左文字 | 阿拉伯文、希伯来文段落，中间夹英文和数字。E：在阿拉伯文段落中间输入几个字 |
| DX-TXT-11 | P2 | Mac Win | O D S | W | 艺术字文字效果 | 渐变填充、轮廓、阴影、发光、映像。上游说三维效果会丢 |

### PAR 段落

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-PAR-01 | P0 | Mac Win | O D E S R | G | 对齐方式 | 左、中、右、两端、分散对齐各一段。E：把居中的一段改成右对齐 |
| DX-PAR-02 | P0 | Mac Win | O D E S R | G | 缩进 | 左右缩进、首行缩进、悬挂缩进、负缩进。E：用标尺拖动第 2 段的首行缩进 |
| DX-PAR-03 | P0 | Mac Win | O D S R | G | 行距 | 单倍、1.5 倍、2 倍、最小值、固定值（字被切掉）、多倍 1.15。逐段数行数、比高度。上游说多倍行距和 Word 不同（#135） |
| DX-PAR-04 | P0 | Mac Win | O D S | G | 段前段后间距 | 段前段后、"相同样式段落间不加空格"、页顶的段前间距 |
| DX-PAR-05 | P1 | Mac Win | O D E S R | G | 制表位 | 左、中、右、小数点、竖线制表位和三种前导符。上游说竖线制表位没测过。E：在第一行末尾加一个制表符和文字 |
| DX-PAR-06 | P1 | Mac Win | O D S | G | 段落边框和底纹 | 方框、只有下框线、相邻同样边框合成一个框、底纹 |
| DX-PAR-07 | P1 | Mac Win | O D S | G | 分页控制 | 每行固定 12 磅，一页正好 58 行，所以分页位置是确定的：文件开头写明每页应以哪一段开头，逐页核对 |
| DX-PAR-08 | P1 | Mac Win | O D E S R | G | 首字下沉 | 下沉和悬挂各一段。E：把下沉的字母改成别的字母 |
| DX-PAR-09 | P2 | Mac Win | O D S | G | 自动断字 | 窄段落开启自动断字，另一段关闭。比较断字位置 |
| DX-PAR-10 | P2 | Mac Win | O D S R | G | 图文框 | 旧式图文框和四周环绕。0.7.0 之前保存时会丢 |

### STY 样式和主题

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-STY-01 | P0 | Mac Win | O D E S R | G | 内置标题和样式 | 标题、副标题、标题 1–3、引用、明显引用；导航窗格要列出三个标题。E：把最后一段改成标题 2 |
| DX-STY-02 | P0 | Mac Win | O D E S R | G | 自定义样式 | 段落样式、字符样式、链接样式。E：把"Report Body"改成 14 磅，三段应一起变 |
| DX-STY-03 | P1 | Mac Win | O D S | G | 默认格式、样式和直接格式 | 三层格式叠加后的结果，文件开头写了应有的样子 |
| DX-STY-04 | P1 | Mac Win | O D E S R | W | 主题 | 换成另一个主题后的主题字体和主题色。E：在 WordCraft 里换一个主题 |
| DX-STY-05 | P2 | Mac Win | O D S | W | 样式集和段落间距 | 设计选项卡里的样式集和段落间距预设 |
| DX-STY-06 | P1 | Mac Win | O D E S R | W | 内置表格样式 | 带标题行、镶边行、第一列格式的内置表格样式。E：关掉镶边行 |

### LST 列表和编号

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-LST-01 | P0 | Mac Win | O D E S R | G | 项目符号 | Word 默认的三级项目符号（Symbol、Courier New、Wingdings 字符）。E：在最后一项末尾回车再按 Tab，应降一级 |
| DX-LST-02 | P0 | Mac Win | O D E S R | G | 编号 | 1. 2. 3.；a) b)；i. ii.；从 5 开始；重新编号；中间隔一段后继续编号。E：在第一个列表中间插入一项，后面的号应顺延 |
| DX-LST-03 | P0 | Mac Win | O D E S R | G | 多级编号链接标题 | 1、1.1、1.1.1 链接到标题 1–3。E：在"Scope"前面插入一个标题 2，后面的号应顺延 |
| DX-LST-04 | P1 | Mac Win | O D S | G | 编号对齐和编号后的间隔 | 编号后用制表符、空格、不加；编号右对齐 |
| DX-LST-05 | P2 | Mac Win | O D S | G | 特殊编号格式 | 正规形式、序数词、"Article 1""Step 1:"、编号单独加粗变红 |
| DX-LST-06 | P1 | Mac Win | O D S | G | 跨表格和分节的编号 | 同一个列表被表格和连续分节符隔开，编号应连续 1–6 |

### TBL 表格

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-TBL-01 | P0 | Mac Win | O D E S R | G | 基本表格 | 4 列 5 行、固定列宽、首行加粗。E：在第 3 行后插入一行，再删除第 4 列 |
| DX-TBL-02 | P0 | Mac Win | O D E S R | G | 合并单元格 | 横向、纵向和两者组合的合并。E：把"Group B"拆分成两个单元格 |
| DX-TBL-03 | P0 | Mac Win | O D S R | G | 跨页表格 | 60 行：标题行每页重复、长单元格跨页断开、固定行高和最小行高、不允许跨页断行的一行 |
| DX-TBL-04 | P1 | Mac Win | O D S | G | 单元格格式 | 垂直对齐、两个方向的竖排文字、单元格边距、不换行 |
| DX-TBL-05 | P1 | Mac Win | O D E S R | G | 列宽和自动调整 | 固定列宽、根据内容、根据窗口、百分比宽度。E：对第 2 个表格执行"根据内容自动调整"。上游说首选宽度和合并单元格宽度还有差别 |
| DX-TBL-06 | P1 | Mac Win | O D S | G | 嵌套表格 | 三层嵌套 |
| DX-TBL-07 | P1 | Mac Win | O D S | G | 文字环绕的表格 | 浮动在右侧的小表格 |
| DX-TBL-08 | P2 | Mac Win | O D E S | G | 表格公式 | SUM(ABOVE) 和 AVERAGE(LEFT)。E：把 Q1 第 1 行的 10 改成 40，更新域，合计应变成 90 |
| DX-TBL-09 | P1 | Mac Win | O D S | G | 斜线表头和底纹 | 左上角斜线表头、粗外框细内线、标题行和首列底纹 |
| DX-TBL-10 | P2 | Mac Win | O D S | G | 从右到左表格 | 阿拉伯文表格，第一列在右边 |
| DX-TBL-11 | P1 | Mac Win | O D S | G | 横向页面里的宽表格 | 纵、横、纵三节，横向页里 12 列表格 |
| DX-TBL-12 | P1 | Mac Win | O D S R | G | 单元格里的复杂内容 | 编号列表、图片、脚注、超链接 |

### SEC 页面和分节

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-SEC-01 | P0 | Mac Win | O D S | G | 纸张和方向 | A4 纵向、Letter 纵向、A4 横向三节。在页面设置里核对尺寸 |
| DX-SEC-02 | P0 | Mac Win | O D S | G | 页边距和装订线 | 对称页边距（奇偶页内外侧互换）、第 2 节加 1 cm 装订线 |
| DX-SEC-03 | P0 | Mac Win | O D E S R | G | 分节符 | 下一页、连续、奇数页、偶数页；第 2 页应是空白页。E：删除第 2 节和第 3 节之间的分节符 |
| DX-SEC-04 | P1 | Mac Win | O D E S R | G | 分栏 | 两栏加分隔线、三栏不等宽、分栏符、连续分节后的栏平衡。E：把两栏改成三栏 |
| DX-SEC-05 | P1 | Mac Win | O D S | G | 页面边框和页面颜色 | 距页边和距正文两种页面边框、浅黄页面颜色 |
| DX-SEC-06 | P2 | Mac Win | O D S | G | 行号 | 每 5 行一个号、每页重新编号、加框的一段不编号 |
| DX-SEC-07 | P2 | Mac Win | O D S | G | 页面垂直对齐 | 封面垂直居中、第 2 页两端对齐 |
| DX-SEC-08 | P2 | Mac Win | O D S | G | 书籍折页 | 上游说没有实现。看显示成什么、保存后设置还在不在 |
| DX-SEC-09 | P1 | Mac Win | O D E S R | W | 水印 | 文字水印（斜式、半透明）和图片水印。E：在 WordCraft 里删掉水印 |

### HF 页眉页脚

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-HF-01 | P0 | Mac Win | O D E S R | G | 页眉页脚和页码 | 页眉文字、页脚"Page X of 3"。E：改页眉文字 |
| DX-HF-02 | P0 | Mac Win | O D S R | G | 首页不同、奇偶页不同 | 首页没有页眉页码；奇数页页码在右、偶数页在左 |
| DX-HF-03 | P1 | Mac Win | O D E S R | G | 各节不同的页眉和页码 | 第 1 节罗马数字页码，第 2 节从 1 重新编号，第 3 节有自己的页眉。E：把第 3 节页眉改为"链接到前一节" |
| DX-HF-04 | P1 | Mac Win | O D S | G | 页眉里的图片和表格 | Logo 图片和两列表格 |
| DX-HF-05 | P2 | Mac Win | O D S | G | 页眉里的 STYLEREF | 页眉显示当前页的标题 1，翻页时应跟着变 |

### IMG 图片

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-IMG-01 | P0 | Mac Win | O D E S R | G | 嵌入型图片 | PNG 和 JPEG。E：拖动角点把第一张缩小一半 |
| DX-IMG-02 | P0 | Mac Win | O D E S R | G | 文字环绕 | 四周型、紧密型、穿越型、上下型、衬于文字下方、浮于文字上方。E：把第一张图拖到下一段（上游 #82 说图片不能移动） |
| DX-IMG-03 | P1 | Mac Win | O D S | G | 图片定位 | 相对页面、页边距、栏和段落定位，以及锁定标记 |
| DX-IMG-04 | P1 | Mac Win | O D E S R | G | 裁剪、旋转和翻转 | 每边裁 10%、旋转 30°、水平和垂直翻转。看 F 字和黄点的方向。E：把第 2 张再转 15° |
| DX-IMG-05 | P1 | Mac Win | O D S | G | 图片格式 | GIF、BMP、TIFF 和带 PNG 备用图的 SVG。上游说插入时不支持 SVG 和 TIFF；这里看已有文件能否显示、保存后是否保留 |
| DX-IMG-06 | P2 | Mac Win | O D S | W | 图片调整和样式 | 亮度对比度、重新着色、透明度、删除背景、图片样式、艺术效果 |
| DX-IMG-07 | P1 | Mac Win | O D S | G | 替代文字 | 替代文字、标题和"标记为装饰性"。S：在 Word 里核对替代文字窗格 |
| DX-IMG-08 | P2 | Mac Win | O D S | G | 链接的图片 | 只链接不嵌入（文件不存在）和链接并嵌入两种 |
| DX-IMG-09 | P1 | Mac Win | O D S | G | 大尺寸照片 | 4 张 4000×3000 的照片（文件约 8 MB）。记录打开秒数和保存后的文件大小 |

### SHP 形状和文本框

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-SHP-01 | P0 | Mac Win | O D E S R | W | 基本形状 | 矩形、圆角矩形、椭圆、箭头、星形，带填充和轮廓。E：改一个形状的填充色（上游 #142 说形状工具有问题） |
| DX-SHP-02 | P0 | Mac Win | O D E S R | W | 文本框 | 有框和无框文本框、内部边距、根据文字调整大小、竖排文字。E：在第一个文本框里加一行 |
| DX-SHP-03 | P1 | Mac Win | O D S | W | 链接的文本框 | 文字从第一个框流到第二个框 |
| DX-SHP-04 | P1 | Mac Win | O D E S R | W | 组合和绘图画布 | 三个形状组合；绘图画布。E：取消组合 |
| DX-SHP-05 | P1 | Mac Win | O D S | W | 流程图和连接线 | S：在 Word 里拖动一个形状，连接线应还连着 |
| DX-SHP-06 | P2 | Mac Win | O D S | W | 形状效果 | 阴影、发光、柔化边缘、三维旋转。上游说三维会丢 |
| DX-SHP-07 | P1 | Mac Win | O D S | W | 艺术字 | 带"转换"弯曲效果的艺术字 |
| DX-SHP-08 | P1 | Mac Win | O D E S R | W | Word 内置封面 | 上游修过 Word 365 封面的问题（#743）。E：改封面标题 |
| DX-SHP-09 | P2 | Mac Win | O D S | W | 文本框里的表格和图片 | |

### OBJ 图表、SmartArt、公式和嵌入对象

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-OBJ-01 | P0 | Mac Win | O D E S R | W | 图表 | 柱形图、折线图、饼图。E：把图表往下移一段。S：在 Word 里双击编辑数据，嵌入的工作簿应还在。上游说 Word 的图表在 WordCraft 里只读 |
| DX-OBJ-02 | P1 | Mac Win | O D S | W | WordCraft 不画的图表类型 | 雷达图、股价图、三维柱形图、瀑布图。上游说显示占位框；重点看保存后在 Word 里是否完好 |
| DX-OBJ-03 | P0 | Mac Win | O D E S R | W | SmartArt | 流程、组织结构图、循环。E：移动一个 SmartArt。S：在 Word 里改一处 SmartArt 文字 |
| DX-OBJ-04 | P0 | Mac Win | O D E S R | W | 公式 | 二次公式、分数、根式、积分、求和、矩阵、编号公式、行内公式。E：把一个公式里的 x 改成 y |
| DX-OBJ-05 | P1 | Mac Win | O D S | W | 嵌入的 Excel 工作表 | 上游说只显示图片、保存时保留。S：在 Word 里双击能否编辑 |
| DX-OBJ-06 | P2 | Mac Win | O D S | W | 墨迹 | 绘图选项卡画的几笔。上游说 Word 的墨迹只显示预览图或空框，保存时保留 |
| DX-OBJ-07 | P2 | Mac Win | O D S | W | 三维模型 | 上游说会丢失。重点看丢的时候有没有提示 |
| DX-OBJ-08 | P1 | Mac Win | O D S | W | 图标 | 两个改了颜色的 SVG 图标 |

### REF 引用

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-REF-01 | P0 | Mac Win | O D E S R | G | 目录 | 三级目录，标题在第 2–5 页。点目录项能跳转。E：在"Results"下加一个标题 2，更新目录 |
| DX-REF-02 | P0 | Mac Win | O D E S R | G | 脚注和尾注 | 10 个脚注（第 3 个很长，要跨页）、5 个罗马数字编号的尾注。E：在第 1 段末尾插入一个脚注，后面的编号应顺延 |
| DX-REF-03 | P1 | Mac Win | O D E S R | G | 题注和图表目录 | 图 1–3、表 1–2 和两个图表目录。E：在图 1 前插入一张图和题注，更新两个目录 |
| DX-REF-04 | P1 | Mac Win | O D E S R | G | 交叉引用 | 引用标题编号、标题文字、页码、"上方/下方"、题注。E：全选更新域，结果应不变 |
| DX-REF-05 | P0 | Mac Win | O D E S R | G | 超链接 | 网址、邮件地址、文档内书签、带屏幕提示的链接。E：⌘/Ctrl + 点击跳转，再新建一个链接 |
| DX-REF-06 | P1 | Mac Win | O D S | G | 书签 | 五种位置的书签。用"定位"逐个跳转 |
| DX-REF-07 | P1 | Mac Win | O D E S | G | 索引 | 第 4 页两栏索引。E：更新索引 |
| DX-REF-08 | P1 | Mac Win | O D E S R | W | 引文和书目 | Word"管理源"里的 4 个来源、APA 第 7 版引文和书目。E：把引文样式改成 MLA。0.6.1 起来源会存进 .docx |
| DX-REF-09 | P2 | Mac Win | O D S | W | Zotero 引文 | 需要装 Zotero 和它的 Word 插件。上游有说明 `docs/zotero.md` |
| DX-REF-10 | P2 | Mac Win | O D S | W | 引文目录 | 法律文书用的引文目录 |

### FLD 域

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-FLD-01 | P1 | Mac Win | O D S | G | 日期和文档信息域 | DATE、CREATEDATE、TITLE、AUTHOR、FILENAME、NUMWORDS |
| DX-FLD-02 | P1 | Mac Win | O D E S | G | 公式、条件和序列域 | E：切换域代码（Windows Alt+F9，Mac ⌥F9）再切回 |
| DX-FLD-03 | P2 | Mac Win | T | — | 更新域 | 用 DX-FLD-01 和 DX-REF-01：全选后更新域，和 Word 更新后的结果逐个对比 |
| DX-FLD-04 | P2 | Mac Win | O D S | G | 邮件合并主文档 | 带合并域、没有数据源。S：在 Word 里能否接着连数据源合并 |

### REV 审阅

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-REV-01 | P0 | Mac Win | O D E S R | W | 批注 | 两个人的 6 条批注，有回复和已解决的。E：回复一条、解决一条、删除一条。S：Word 里回复关系和"已解决"状态应保留 |
| DX-REV-02 | P0 | Mac Win | O D E S R | G | 修订 | 两位作者的插入、删除、格式修改、段落修订。E：在修订状态下再改一处，作者应是 WordCraft 里设置的用户名 |
| DX-REV-03 | P1 | Mac Win | O D S R | W | 移动修订 | 修订状态下剪切粘贴一整段 |
| DX-REV-04 | P1 | Mac Win | O D S | W | 表格里的修订 | 修订状态下插入行、删除行、改单元格 |
| DX-REV-05 | P0 | Mac Win | T S | — | 接受和拒绝 | 用 DX-REV-02：接受第 1 处、拒绝第 2 处，再全部接受。S：Word 里应没有修订，内容正确 |
| DX-REV-06 | P2 | Mac Win | T S | — | 删除个人信息 | 用 DX-REV-01：开启"保存时从文件属性中删除个人信息"后保存。S：Word 里批注作者应变成"作者" |
| DX-REV-07 | P1 | Mac Win | O D S R | W | Word 里改出来的真实修订 | 一页文字的改字、删句、改格式、改样式和批注 |

### CC 内容控件和窗体

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-CC-01 | P1 | Mac Win | O D E S R | W | 内容控件 | 纯文本、格式文本、下拉列表、组合框、日期、复选框、图片。E：选一个下拉项、勾选复选框 |
| DX-CC-02 | P1 | Mac Win | O D E S | W | 旧式窗体域 | 加了"仅填写窗体"保护。上游说旧式窗体域不支持：重点看保存后还在不在 |
| DX-CC-03 | P2 | Mac Win | O D E S | W | 绑定文档属性的控件 | E：改标题控件的文字，看文件属性是否跟着变（上游说不计算绑定） |
| DX-CC-04 | P2 | Win | O D S | W | 重复分区内容控件 | |

### PRT 保护、宏和属性

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-PRT-01 | P0 | Mac Win | O D E S | W | 打开密码 | 密码是 `wordcraft`。O：能否用密码打开。S：WordCraft 保存后 Word 是否仍要同一个密码。GetWordCraft 的页面和上游 gaps.md（0.10.0）都写 0.5.0 起支持 |
| DX-PRT-02 | P1 | Mac Win | O E S | W | 限制编辑 | 只读、仅批注、仅填写窗体、只读加例外区域四个文件。E：在受保护的地方输入应被拒绝；用密码取消保护 |
| DX-PRT-03 | P1 | Mac Win | O E S | W | 宏文档 .docm | E：改一个字后保存。S：Word 里宏应还在并能运行。上游说保留宏、不运行宏 |
| DX-PRT-04 | P2 | Mac Win | T | W | 模板 .dotx | 双击 .dotx 应新建一份基于它的文档，而不是打开模板本身。另试 0.10.0 加的个人模板：把 .dotx 放进用户模板文件夹（文件 › 选项 › 高级 › 文件位置），文件 › 新建里应能看到并用它新建 |
| DX-PRT-05 | P2 | Mac Win | O S | G | 文档属性 | 标题、主题、作者、关键词、备注和两个自定义属性 |
| DX-PRT-06 | P2 | Win | O S | W | 数字签名 | 看签名状态，以及保存后签名怎么处理 |
| DX-PRT-07 | P1 | Mac Win | O D S | W | 带打开密码的 .doc | 密码是 `wordcraft`。上游 0.8.0 起支持 RC4、XOR 加密的 .doc，但写明"untested on Word-written files"：O 能否用密码打开、密码错时提示什么；S 时看给出什么保存选项 |

### FNT 字体

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-FNT-01 | P0 | Mac Win | O D S | W | Aptos（Word 当前的默认字体） | 逐页记下最后一个词和总页数。上游说 Aptos 没有字宽相同的替代字体，换行会和 Word 不同 |
| DX-FNT-02 | P0 | Mac Win | O D S | G | Calibri | 和 DX-FNT-01 同样的文字。WordCraft 用字宽相同的 Carlito 代替，逐页对比 |
| DX-FNT-03 | P1 | Mac Win | O D S | G | 常见字体 | 12 种字体各一段。记下每段实际用的字体 |
| DX-FNT-04 | P1 | Mac Win | O D S R | G | 缺失的字体 | 看替代效果；保存后字体框里应仍是原名 |
| DX-FNT-05 | P1 | Mac Win | O D S | W | 嵌入字体 | 上游说嵌入的字体不用来显示，但保存时保留 |
| DX-FNT-06 | P2 | Mac Win | O D S | G | 粗体斜体和字重 | 没有粗体字形的字体（Impact）加粗、各种字重 |

### LAY 分页对比

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-LAY-01 | P0 | Mac Win | O D S | G | 10 页报告的分页 | 在记录的 note 里逐页写"第一个词 / 最后一个词"，两边都写；统计不同的页数 |
| DX-LAY-02 | P0 | Mac Win | O D E S R | G | 图文混排的 20 页报告 | 页数、每张图在第几页、表格在哪里断开。E：在第 3 页插入一段，看后面是否正确重排 |
| DX-LAY-03 | P1 | Mac Win | O D S | G | 兼容模式 | `-11`、`-14`、`-15` 三个文件。上游说旧的兼容选项大多被忽略 |

### PKG 文件结构

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-PKG-01 | P1 | Mac Win | O | G | 扩展名和内容不符 | 三个文件：改名为 .doc 的 .docx、存成 .doc 和 .docx 的 RTF。上游说按内容识别，应都能打开。这三个文件不经 Word 基准，直接用 `corpus/generated/` 里的 |
| DX-PKG-02 | P2 | Mac Win | O D S | W | Strict Open XML | 上游说能读不能写：看保存时怎么处理 |
| DX-PKG-03 | P2 | Mac Win | O D S | W | Word XML 文档（.xml） | |

### FMT 其他格式

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-FMT-01 | P0 | Mac Win | O D E | W | Word 97-2003 .doc | 上游说能读不能写，0.9.0 起按"保存"会改走另存为 .docx：E 之后按 ⌘S / Ctrl+S，看给出什么选择，原 .doc 有没有被改 |
| DX-FMT-02 | P1 | Mac Win | O D S R | W | RTF | S：存回 RTF 后在 Word 打开 |
| DX-FMT-03 | P1 | Mac Win | O D S R | W | ODT | S：存回 ODT 后在 Word 打开 |
| DX-FMT-04 | P0 | Mac Win | X | — | 导出 PDF | 用 DX-LAY-02：页数是否和 Word 导出的一样；文字能否选中和搜索；链接能否点；书签（大纲）；字体是否嵌入（Mac 用"预览 › 工具 › 显示检查器"，Windows 用 Acrobat Reader 的"文档属性 › 字体"） |
| DX-FMT-05 | P2 | Mac Win | X | — | 导出 HTML、Markdown、LaTeX、纯文本 | 用 DX-LAY-02 和 DX-OBJ-04：标题、列表、表格、图片、公式是否保留 |
| DX-FMT-06 | P1 | Mac Win | X | — | 保存为 Word 2003 XML | 用 DX-LAY-02：文件 › 导出 › Word 2003 XML 文档，再用 Word 打开。上游原话是还没在 Word 里打开过、需要测试者 |
| DX-FMT-07 | P2 | Mac Win | X | — | 导出页面图片 | 分辨率和清晰度 |
| DX-FMT-08 | P2 | Mac Win | O D | G | 纯文本的编码 | UTF-8（有无 BOM）、UTF-16、GBK、Windows-1252。不能有乱码。直接用 `corpus/generated/` 里的 |
| DX-FMT-09 | P2 | Mac Win | O D S | G | 打开 Markdown 和 HTML | 标题、列表、表格、链接和图片。直接用 `corpus/generated/` 里的 |

### PRD 其他软件写出的文件

源文件是 `DX-PRD-SRC.docx`（经 Word 基准），一份三页的报告，有标题、列表、合并表头的表格、图片、脚注、批注、链接和页码。在下表的软件里打开它，用该软件另存或导出 .docx，文件名用表里的 ID。记下软件和版本。

D 和 S 阶段都以"Word 打开这个文件的样子"为准，并在 note 里写一句"该软件自己显示的样子"有何不同（比如 Google 文档本来就丢了批注，就不算 WordCraft 的问题）。

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-PRD-01 | P1 | Win | O D E S R | P | Windows 版 Word 保存的文件 | 用 Windows 版 Word 打开源文件、另存 |
| DX-PRD-02 | P0 | Mac Win | O D E S R | P | Google 文档导出的文件 | 上传到 Google 云端硬盘，用 Google 文档打开，文件 › 下载 › Microsoft Word |
| DX-PRD-03 | P1 | Mac Win | O D E S R | P | LibreOffice 保存的文件 | LibreOffice Writer 打开，另存为 Word 2007-365 |
| DX-PRD-04 | P1 | Mac | O D E S R | P | Pages 导出的文件 | Pages 打开，文件 › 导出为 › Word |
| DX-PRD-05 | P0 | Mac Win | O D E S R | P | WPS 文字保存的文件 | WPS 文字打开，另存为 .docx |
| DX-PRD-06 | P2 | Mac Win | O D E S R | P | 网页版 Word 保存的文件 | 上传到 OneDrive，在网页版 Word 里改一个字，下载副本 |
| DX-PRD-07 | P2 | Mac Win | O D E S R | P | ONLYOFFICE 保存的文件 | ONLYOFFICE 桌面版另存 |
| DX-PRD-08 | P2 | Mac Win | O D S | P | pandoc 生成的文件 | `pandoc DX-PRD-SRC.md -o DX-PRD-08.docx`（程序生成的报表常见这种文件） |

### REAL 真实文档

文件、下载地址、许可和 SHA-256 见 [real-world.md](../corpus/real-world.md)。真实文档不经 Word 基准（它们本来就是别人做的文件），参考 PDF 用 Word 直接导出。

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-REAL-01 | P0 | Mac Win | O D E S R | R | NIH 履历表格式页 | 美国政府表格：表格、说明文字、域 |
| DX-REAL-02 | P0 | Mac Win | O D E S R | R | IEEE 会议论文 Word 模板 | 双栏、公式、题注、参考文献 |
| DX-REAL-03 | P0 | Mac Win | O D E S R | R | APA 第 7 版学生论文范文 | 标题页、页眉页码、悬挂缩进的参考文献、表格 |
| DX-REAL-04 | P0 | Mac Win | O D E S R | R | Microsoft 简历模板 | 文本框、形状、主题字体颜色、表格排版 |
| DX-REAL-05 | P1 | Mac Win | O D E S R | R | Microsoft 报告模板 | 封面、目录、标题样式 |
| DX-REAL-06 | P1 | Mac Win | O D E S R | R | Microsoft 新闻稿或传单模板 | 分栏、图片、形状 |
| DX-REAL-07 | P1 | Mac Win | O D E S R | R | Microsoft 发票或信函模板 | 表格、内容控件 |
| DX-REAL-08 | P1 | Mac Win | O D E S R | R | 英国政府合同模板 | 多级编号条款、定义、页眉页脚 |
| DX-REAL-09 | P1 | Mac Win | O D E S R | R | 美国政府报告模板 | 公有领域的报告或计划模板 |
| DX-REAL-10 | P1 | Mac Win | O D E S R | R | 英文学位论文模板 | 一所大学研究生院发布的模板 |
| DX-REAL-11-01~12 | P2 | Mac Win | O D S | R | Apache POI 测试文件 | 12 个文件，编号和文件名的对应见 real-world.md |
| DX-REAL-12-01~10 | P2 | Mac Win | O D S | R | LibreOffice 回归测试文件 | 按固定种子抽的 10 个文件，对应关系见 real-world.md |
| DX-PRIV-01~20 | P1 | Mac Win | O D E S R | R | 私有样本 | 测试者自己的 20 份真实文档（合同、报告、简历、论文、表格……）。只公开汇总和一句话描述（如"12 页的租房合同，多级编号"），不公开文件和截图，截图只留在本地 |

### NEW 在 WordCraft 里新建，交给 Word

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| DX-NEW-01 | P0 | Mac Win | T S | N | 从空白文档做一份报告 | 按 recipes.md 的步骤：标题样式、项目符号、3×4 表格、一张图片、页眉页码、一个脚注。S：Word 打开有没有修复提示，外观是否一致 |
| DX-NEW-02 | P0 | Mac Win | T S | N | 用内置模板新建 | 信函、简历、报告模板各一份，填几处文字 |
| DX-NEW-03 | P1 | Mac Win | T S | N | 修订和批注交给 Word | 5 处修订、3 条批注（一条是回复）。S：作者、时间、回复关系，能否接受拒绝 |
| DX-NEW-04 | P1 | Mac Win | T S | N | 目录、题注和交叉引用交给 Word | S：Word 里全选更新域后是否仍正确 |
| DX-NEW-05 | P1 | Mac Win | T S | N | 图表和 SmartArt 交给 Word | S：显示是否一致；编辑数据时 Word 怎么处理（上游说 Word 会提示新建工作簿） |
| DX-NEW-06 | P2 | Mac Win | T S | N | 限制编辑密码交给 Word | "仅批注"加密码 `wordcraft`。S：Word 用同一密码能否取消保护 |
| DX-NEW-07 | P1 | Mac Win | T S | N | 打开密码交给 Word | 打开密码 `wordcraft`。S：Word 能否用这个密码打开 |
