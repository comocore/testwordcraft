# AX：无障碍

依据：上游 `docs/gaps.md` #18 说文档区域已经通过 AccessKit 向读屏软件描述段落、标题、列表、表格、链接、图片和光标，但"no NVDA, VoiceOver or Orca run yet"；`docs/gaps.md` 还说"使用系统设置"的动画选项"hasn't been tried on a Mac"。本套件是第一次用真实读屏软件去试。

## 准备

- Mac：VoiceOver（⌘F5 开关）。第一次用先跑一遍"VoiceOver 使用教程"，熟悉 VO 键（⌃⌥）和转子（VO+U）。
- Windows：NVDA（免费，nvaccess.org），讲述人（Win+Ctrl+Enter）。
- 用 AX-DOC（结构良好的文档）和 AX-DOC-BAD（有问题的文档），都在 `corpus/docx/`。
- 每个读屏用例都录屏并录下声音（Mac ⌘⇧5 的选项里选麦克风或系统声音；Windows 用 OBS）。note 里写下读屏软件读出的原话。
- 对比基准：同一份文档在 Word 里用同一个读屏软件读一遍。

判定：读出的信息和 Word 里一样完整，记 `pass`；有缺漏但能用，记 `minor`；关键信息（标题级别、表格行列、替代文字、光标位置）读不出来，记 `major`；读屏软件什么都读不到，或者无法操作，记 `fail`。

## 用例

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| AX-VO-01 | P0 | Mac | T | G | VoiceOver 读正文 | 打开 AX-DOC，从头逐段读：标题和级别、列表项和序号、表格（行列位置、标题行）、图片的替代文字、链接 |
| AX-VO-02 | P0 | Mac | T | — | VoiceOver 操作功能区和对话框 | 只用键盘和 VoiceOver：找到"加粗"按钮并按下；打开"段落"对话框，改段后间距，确定 |
| AX-VO-03 | P1 | Mac | T | G | VoiceOver 打字和选择 | 输入一句话、删除几个字、Shift+方向键选中：每一步是否读出 |
| AX-VO-04 | P1 | Mac | T | G | VoiceOver 转子 | 转子里能否按标题、链接、表格跳转 |
| AX-NV-01 | P0 | Win | T | G | NVDA 读正文 | 同 AX-VO-01 |
| AX-NV-02 | P0 | Win | T | — | NVDA 操作功能区和对话框 | 同 AX-VO-02 |
| AX-NV-03 | P1 | Win | T | G | NVDA 打字和选择 | 同 AX-VO-03；另试 NVDA 的 H 键（下一个标题）、T 键（下一个表格） |
| AX-NR-01 | P1 | Win | T | G | 讲述人 | 用讲述人重复 AX-NV-01 |
| AX-KB-01 | P0 | Mac Win | T | — | 只用键盘 | 不碰鼠标：打开文件、进入功能区（Windows 按 Alt 看按键提示，F6 在区域间切换）、插入表格、换样式、保存。记下走不通的那一步 |
| AX-KB-02 | P1 | Mac Win | T | — | 焦点是否看得见 | 在三个对话框里按 Tab 移动，焦点框是否一直看得见 |
| AX-VIS-01 | P1 | Win | T | — | 高对比度 | Windows 设置 › 辅助功能 › 对比度主题：界面和文档是否看得清 |
| AX-VIS-02 | P1 | Mac Win | T | — | 系统缩放和大字 | 系统显示缩放 150%、200%，以及系统文字大小调大：界面是否清晰、有没有文字被截断 |
| AX-VIS-03 | P1 | Mac | T | — | 减弱动态效果 | macOS 系统设置 › 辅助功能 › 显示 › 打开"减弱动态效果"；WordCraft 的文件 › 选项 › 辅助功能 › 动画效果设为"使用系统设置"。光标滑动、平滑滚动、菜单淡入应停止 |
| AX-VIS-04 | P2 | Mac Win | T | G | 深色模式下的修订颜色 | DX-REV-02 在深色模式和灰度显示（Mac：辅助功能 › 显示 › 色彩滤镜）下，两位作者的修订能否分清 |
| AX-CHK-01 | P1 | Mac Win | T | G | 辅助功能检查器 | 用 AX-DOC-BAD：WordCraft 和 Word 的辅助功能检查器各列出哪些问题。文件里有 5 类问题，开头写了 |
