# ST：稳定性和数据安全

回答"会不会丢我的文件"。依据：上游 `docs/gaps.md` #3 说已知有约 15 个崩溃、卡死或数据路径的问题；`docs/file-format-parity.md` 的"Native save-path guarantees"一节写明保存时先写临时文件再替换，原文件在替换前出错时不受影响，但"real disk-full conditions, power loss and network filesystems are not verified"，也"not document locking or conflict detection"。

所有用例都用文件的副本做。

## 用例

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| ST-BAD-01 | P0 | Mac Win | O | G | 截断的文件 | `ST-BAD-01-truncated.docx`（只有前 60%）。应给出看得懂的错误提示，不崩溃、不卡住。直接用 `corpus/generated/` 里的 |
| ST-BAD-02 | P1 | Mac Win | O | G | 缺少正文部件 | `ST-BAD-02-no-document.docx` |
| ST-BAD-03 | P1 | Mac Win | O | G | XML 损坏 | `ST-BAD-03-bad-xml.docx`，段落标签没闭合。Word 会提示修复；看 WordCraft 怎么处理 |
| ST-BAD-04 | P1 | Mac Win | O | G | 空文件和假文件 | `ST-BAD-04-empty.docx`（0 字节）和 `ST-BAD-04-png-named.docx`（改名的图片），各记一次，写在 note |
| ST-BAD-05 | P2 | Mac Win | O | R | 模糊测试样本 | real-world.md 里 Apache POI 的 4 个文件（3 个模糊测试样本、1 个截断文件）。上游有"不崩溃"的标准 |
| ST-SAV-01 | P0 | Mac | T | — | 磁盘满时保存 | 磁盘工具 › 文件 › 新建映像 › 空白映像，大小 20 MB，格式 APFS。把 DX-LAY-02 复制进去，再复制大文件把映像塞到只剩约 1 MB。在 WordCraft 里打开映像里的 DX-LAY-02，插入几张大图后保存：应提示磁盘空间不足，原文件仍能用 Word 正常打开，映像里不应留下临时文件 |
| ST-SAV-02 | P1 | Win | T | — | Windows 上磁盘满时保存 | 磁盘管理 › 创建 VHD，20 MB，格式化后做同样的测试；或者用一个几乎写满的 U 盘 |
| ST-SAV-03 | P0 | Mac Win | T | G | 保存时强制退出 | 打开 PF-DOC-IMG 的副本，改一个字，按保存后立刻强制退出（Mac：⌥⌘Esc；Windows：任务管理器）。原文件应完好（用 Word 打开），旁边不应留下临时文件；如果留下了，记下文件名。做 3 次 |
| ST-SAV-04 | P1 | Mac Win | T | G | 云盘和网络位置 | 在 iCloud 云盘、OneDrive、局域网共享文件夹里各打开、编辑、保存、再打开 DX-LAY-02 的副本 |
| ST-SAV-05 | P1 | Mac Win | T | G | 文件同时被 Word 打开 | 在 Word 里打开一份副本，再用 WordCraft 打开同一个文件，改后保存。两边各有什么提示，最后文件里是谁的内容。上游说没有文档锁 |
| ST-SAV-06 | P1 | Mac Win | T | G | 只读文件和没有写权限的文件夹 | 把副本设成只读（Mac：显示简介 › 已锁定；Windows：属性 › 只读）后保存；保存到没有写权限的文件夹。应有清楚的提示，不能悄悄失败 |
| ST-REC-01 | P0 | Mac Win | T | G | 崩溃后恢复 | 0.8.0 起有"文件 › 恢复"（见上游 docs/recovery.md）。分三次做，每次强制退出（Mac：活动监视器 › 强制退出；Windows：任务管理器 › 结束任务）后重新打开 WordCraft：a 新建文档，输入一段话，等 15 秒不保存；b 打开 DX-LAY-02 的副本，改两处，等 15 秒不保存；c 打开 DX-PRT-01（有密码），改一处，等 15 秒。看：a、b 是否出现在恢复页，Restore 后内容是否完整、原文件有没有被改；c 应该没有恢复副本；保存之后副本是否消失。记下 `recovery` 文件夹里的文件名和大小 |
| ST-LNG-01 | P1 | Mac Win | T | G | 连续使用 45 分钟 | 按 pf-performance.md 的"固定编辑循环"做 45 分钟（9 个循环），记崩溃、卡顿，每 15 分钟记一次内存。为了让一批不超过 1 小时，从 2 小时缩短到 45 分钟（方案 1.1） |
| ST-LOG-01 | P0 | Mac Win | T | — | 整轮测试的崩溃记录 | 不是单独做的用例。整轮测试中每一次崩溃、卡死（30 秒没反应）都在这一条的 `events` 里记一行：时间、在做哪个用例、操作、日志文件名。崩溃后马上复制日志（`wordcraft.log` 和 `wordcraft.1.log`） |
