# MC：MCP 和命令行

把 GetWordCraft 的 [/mcp](https://getwordcraft.org/mcp) 页上的每一步实际走一遍：哪些和官方文档说的一样，哪些不一样。那一页现在写着"We haven't tried these setups ourselves"，测完后按结果改写。

这一套里 AI agent 本身就是被测对象的一部分，所以记录里要写清楚客户端、模型和版本，并保存对话记录（Claude Code 用 `/export` 导出）。同一个提示词，换模型可能得到不同的结果，我们评的是 WordCraft 的工具有没有按文档工作：调用是否报错，存出的文件 Word 能否正常打开。

## 准备

- Mac：从官方 Release 下载 `wordcraft-cli-<版本>-macos-universal.zip`，核对 SHA-256，解压到 `~/wordcraft-cli/`。Windows：MSI 安装后在 `C:\Program Files\WordCraft\wordcraft-cli.exe`。
- 建两个文件夹：`~/wc-mcp/in`（放 DX-LAY-01、DX-LAY-02 的副本，改名为 `DX-LAY-01-copy.docx`、`DX-LAY-02-copy.docx`）和 `~/wc-mcp/out`。Windows 用 `%USERPROFILE%\wc-mcp\in` 和 `out`。
- 安全测试（SEC）用 MCP Inspector 直接调用工具，不经过 AI，结果是确定的：`npx @modelcontextprotocol/inspector <wordcraft-cli 的完整路径> mcp <参数>`，需要先装 Node.js。
- 下文的 `<CLI>` 指 wordcraft-cli 的完整路径。

## 固定提示词

照原样粘贴，`<OUT>` 换成输出文件夹的完整路径。

- **A（新建）**：Using the wordcraft MCP tools, create a new blank document. Add the title "Team memo" as Heading 1, three bullet points about next week's tasks, and a table with 3 columns and 4 rows whose header row reads Task, Owner, Due. Save it as memo.docx in `<OUT>`. Then read it back with inspect_document and tell me whether the title, the bullets and the table are there.
- **B（修订）**：Open `<OUT>/../in/DX-LAY-01-copy.docx`. Turn on track changes with review.trackChanges {"value": true}. In the first paragraph replace one word with a synonym, delete one sentence in the second paragraph, and insert the word "carefully" in the third. Save it as `<OUT>/DX-LAY-01-tracked.docx`.
- **C（读取和渲染）**：Open `<OUT>/../in/DX-LAY-02-copy.docx`. Use inspect_document to list its headings, then render page 1 as a PNG and save it as `<OUT>/page1.png`.
- **D（操作正在运行的 App）**：Take a screenshot of the WordCraft window, click the Insert tab, type "Hello from the agent" at the caret, and take another screenshot.

## 用例

### CLI 命令行

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| MC-CLI-01 | P0 | Mac Win | T | — | 找到 wordcraft-cli | Mac：解压后第一次运行时 Gatekeeper 是否拦截（官方说已签名公证）；`codesign -dv <CLI>`。Windows：安装目录里是否有，是否在 PATH 里。和 /mcp 页的表格逐行对照 |
| MC-CLI-02 | P0 | Mac Win | T | — | 版本和帮助 | `<CLI> --version`、`<CLI> --help`：版本号和 App 一致；帮助里列出的子命令（0.10.0 的帮助有 convert、info、text、inspect、render、run、commands、parity、mcp、zotero）；`<CLI> convert --help` 应只显示这个命令的说明 |
| MC-CLI-03 | P0 | Mac Win | X | G | 转换成 PDF | `<CLI> convert DX-LAY-02.docx out.pdf`、ZH-DOC-01 同样。和 App 导出的 PDF 比页数和外观 |
| MC-CLI-04 | P1 | Mac Win | X | G | 转换成其他格式 | DX-LAY-02 转 odt、rtf、html、md、tex、txt、png 各一次，用对应软件打开 |
| MC-CLI-05 | P1 | Mac Win | X | G | text 和 inspect | `text` 输出的中文是否完整、不乱码（ZH-DOC-01）；`inspect` 的输出能被 `python3 -m json.tool`（Windows：`ConvertFrom-Json`）解析 |
| MC-CLI-06 | P0 | Mac Win | X | — | README 里的 run 示例 | 原样运行 README 的 `run --template sample --cmd 'select.text={"text":"Membership"}' --cmd format.bold --save out.docx`；Windows 用 /mcp 页给的 PowerShell 写法。用 Word 打开 out.docx，"Membership"应是粗体。PowerShell 的引号是重点 |
| MC-CLI-08 | P1 | Mac Win | X | G | 脚本文件和密码 | 0.9.0 起：照 docs/mcp.md 的例子写 `job.json`（模板 sample，加粗 Membership，存成 docx 和 pdf），运行 `<CLI> run --script job.json`，两个文件都应生成；故意写错一个命令 id，应以退出码 1 结束且什么都不存。再用 `--password-file` 把 DX-PRT-01 转成 PDF |
| MC-CLI-07 | P2 | Mac Win | X | G | 批量转换和出错时 | 用循环把 `corpus/docx/` 全部转成 PDF，记下失败的文件；ST-BAD 的文件应报错并以非 0 退出码结束，不能崩溃或卡住（`echo $?`，PowerShell 用 `$LASTEXITCODE`） |

### MCP

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| MC-MCP-01 | P0 | Mac Win | T | — | 在 Claude Code 里添加 | `claude mcp add wordcraft -- <CLI> mcp`；`claude mcp list` 显示已连接；在 Claude Code 里让它列出 wordcraft 的工具，和 /mcp 页的表格对照 |
| MC-MCP-02 | P0 | Mac Win | T S | — | 新建文档 | 提示词 A。记下调用了哪些工具、有没有报错。S：Word 打开 memo.docx 是否正常、内容是否齐全 |
| MC-MCP-03 | P0 | Mac Win | T S | — | 修改现有文档并留修订 | 先 `claude mcp remove wordcraft`，再用 `-- <CLI> mcp --author "Claude (copyedit)"` 重新添加。提示词 B。S：Word 里三处修订的作者应是 "Claude (copyedit)" |
| MC-MCP-04 | P1 | Mac Win | T | — | 读取结构和渲染页面 | 提示词 C。PNG 和 App 里第一页是否一样 |
| MC-MCP-05 | P1 | Mac Win | T | — | 其他 MCP 客户端 | Claude Desktop：按 /mcp 页的 JSON 写进它的配置文件，重启后能否连上，提示词 A 能否完成。可选：VS Code、Cursor。记下配置文件的位置 |
| MC-MCP-06 | P1 | Mac Win | T | — | 操作正在运行的 App | Mac：`open -a WordCraft --args --control 7981`；Windows：在安装目录用 PowerShell 运行 `& .\wordcraft.exe --control 7981`。再 `claude mcp add wordcraft-app -- <CLI> mcp --connect 127.0.0.1:7981`。提示词 D：窗口里是否真的切到了插入选项卡、出现了文字 |
| MC-MCP-07 | P2 | Mac Win | T | — | 拼错的属性名 | 让 agent 调用 `format.set {"fontSzie": 20}`（故意拼错）。文档说会被忽略而不是报错：确认这一点，看字号有没有变 |
| MC-MCP-08 | P2 | Mac Win | T | — | 宏录制 | 让 agent 用 `tools.recordMacro` 录下"加粗、居中"两步，再对另一段回放 |

### SEC 安全选项

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| MC-SEC-01 | P0 | Mac Win | T | — | 读写目录限制 | MCP Inspector 启动：`<CLI> mcp --automation-read-root ~/wc-mcp/in --automation-write-root ~/wc-mcp/out`。用 open_document 打开 in 里的文件应成功；打开桌面上的文件应返回错误；save_document 存到 out 应成功，存到桌面应返回错误。截图每一次的返回 |
| MC-SEC-02 | P0 | Mac Win | T | — | 链接和相似前缀 | 在 in 里建一个指向桌面文件的符号链接（Mac：`ln -s ~/Desktop/x.docx ~/wc-mcp/in/link.docx`；Windows：管理员 PowerShell `New-Item -ItemType SymbolicLink`），打开它应被拒绝。再建 `~/wc-mcp/in2/x.docx`，打开它也应被拒绝（in2 不算 in 的里面） |
| MC-SEC-03 | P1 | Mac Win | T | — | 只给读目录 | 只加 `--automation-read-root`：任何保存都应失败 |
| MC-SEC-04 | P1 | Mac Win | T | — | 目录不存在 | 给一个不存在的目录：服务应报错并退出 |
| MC-SEC-05 | P0 | Mac Win | T | — | 控制端口要密钥 | App 用 `--control 7981` 启动。Mac 用 `nc`，Windows 用 `tools/control-port-win.ps1`，按下方"控制端口检查"逐条做 |
| MC-SEC-06 | P1 | Mac Win | T | — | 密钥文件 | 窗口开着时设置目录里有 `control-key.local-7981`（Mac 上 `ls -l` 应为 `-rw-------`）；关掉窗口后文件被删除；再启动后密钥和上次不同 |
| MC-SEC-07 | P1 | Mac Win | T | — | 只监听本机 | Mac：`lsof -nP -iTCP:7981 -sTCP:LISTEN` 应显示 `127.0.0.1:7981`；Windows：`netstat -ano \| findstr 7981`。可选：从局域网里另一台电脑连这台机器的 7981，应连不上 |
| MC-SEC-08 | P2 | Mac Win | T | — | 不带 --control 时端口不开 | 正常启动 App，7981 不应在监听 |

## 控制端口检查（MC-SEC-05）

Mac，在终端里依次运行。设置目录是 `~/Library/Application Support/WordCraft`。

```sh
# 1. 不带密钥：应回 {"id":1,"ok":false,"error":"unauthorized"}，然后连接被关闭
printf '{"id":1,"method":"engine.commands"}\n' | nc -w 5 127.0.0.1 7981

# 2. 不是 JSON（模拟网页发来的 HTTP 请求）：应回一条错误，然后连接被关闭
printf 'GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n' | nc -w 5 127.0.0.1 7981

# 3. 带正确的密钥：应回 "ok":true
KEY=$(cat ~/Library/Application\ Support/WordCraft/control-key.local-7981)
printf '{"id":1,"key":"%s","method":"document.inspect"}\n' "$KEY" | nc -w 5 127.0.0.1 7981 | head -c 300; echo

# 4. 连上以后什么都不发：两个时间应相差约 30 秒（服务端断开）；超过 60 秒还没返回就是没断开
date +%T; nc 127.0.0.1 7981 < <(sleep 60); date +%T
```

Windows 用 `tools/control-port-win.ps1`，它依次做 1–4 并打印每一步的结果。
