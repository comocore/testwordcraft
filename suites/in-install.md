# IN：下载、安装、首次启动、升级、卸载和网络

用来核实、补充 GetWordCraft 的分系统下载页和 /safety 页：那些页面现在按官方文档和打包文件写，测完后换成我们看到的实际步骤和截图。

依据：上游 `docs/file-format-parity.md` 说 Windows 的文件关联"Not yet tried on a real install"；`docs/gaps.md` #3 列了 Windows 11 上没有管理员权限就写不了文件（#218）、Intel 核显启动崩溃（#170）；README 说"Spelling, grammar and everything else work offline"。

## 准备

- 用一个干净的系统用户（README §3.3）。Windows 上另建一个**标准用户**（非管理员）账户，给 IN-INS-04 用。
- Mac 网络监控：装 [LuLu](https://objective-see.org/products/lulu.html)（免费、开源），首次运行时设为"提醒"模式，这样每个新的出站连接都会弹窗。Windows：资源监视器（`resmon`）的"网络"选项卡，或 Sysinternals 的 TCPView。
- 所有系统提示（Gatekeeper、SmartScreen、UAC）照原样截图，截图里的文字是页面上要引用的。

## 用例

| ID | 优先级 | 系统 | 阶段 | 来源 | 用例 | 怎么测、看什么 |
|---|---|---|---|---|---|---|
| IN-DL-01 | P0 | Mac Win | T | — | 从官方 Release 下载并核对 | 用系统默认浏览器从 GitHub Release 下载安装包和 `SHA256SUMS.txt`。Mac：`shasum -a 256 <文件>`；Windows：`Get-FileHash <文件>`。和 SHA256SUMS.txt 对照，记下下载用时和速度（国内网络另记一次） |
| IN-SIG-01 | P0 | Mac | T | — | Mac 签名和公证 | `codesign -dv --verbose=4 /Applications/WordCraft.app`（记 Authority 和 TeamIdentifier）；`spctl -a -vv /Applications/WordCraft.app`（应为 accepted、Notarized Developer ID）；`xcrun stapler validate <dmg>`。命令输出原样贴进 note |
| IN-SIG-02 | P0 | Win | T | — | Windows 签名 | 安装包和安装后的 `wordcraft.exe`：右键 › 属性 › 数字签名；PowerShell `Get-AuthenticodeSignature <文件> \| Format-List`，记 Status 和 SignerCertificate 的 Subject |
| IN-INS-01 | P0 | Mac | T | — | Mac 安装和第一次打开 | 打开 DMG、拖进"应用程序"、第一次打开。每个弹窗截图 |
| IN-INS-02 | P0 | Win | T | — | Windows MSI 安装 | 双击 MSI：SmartScreen 是否提示（截图）、UAC 是否提示、安装位置、开始菜单项、桌面图标、用时 |
| IN-INS-03 | P1 | Win | T | — | Windows 便携版 | 解压 zip 后直接运行；设置和日志写到了哪里（是 `%APPDATA%\WordCraft` 还是程序旁边） |
| IN-INS-04 | P1 | Win | T | — | 标准用户 | 用标准用户账户：MSI 能否安装（是否要管理员密码）；运行；在"文档"里新建、保存、再打开一个文件。上游 #218 说 Windows 11 上没有管理员权限时写入失败 |
| IN-1ST-01 | P0 | Mac Win | T | — | 第一次启动 | 出现什么（开始页、模板）；界面语言是否跟随系统；有没有要求登录、注册或联网 |
| IN-ASC-01 | P1 | Mac Win | T | — | 文件关联 | 安装后双击 .docx 由谁打开（上游说安装程序只注册、不抢默认程序）；右键"打开方式"里有没有 WordCraft；文件 › 选项 › 常规里的"设为 Word 文档的默认程序"按钮做了什么；设为默认后双击 .docx、.doc、.rtf、.odt 是否都能打开 |
| IN-UPD-01 | P1 | Mac Win | T | — | 升级 | 先装上一版（如 0.9.0），改几项设置、打开几个文件，再装当前版本：是否原地升级，设置和最近文件是否保留，开始菜单或"应用程序"里会不会出现两个 |
| IN-UNI-01 | P1 | Mac Win | T | — | 卸载 | Windows：设置 › 应用里卸载；Mac：把应用拖进废纸篓。之后检查残留：设置目录、日志、注册表 `HKCU\Software` 和 `HKLM\Software` 下的项、文件关联。和 GetWordCraft 下载页写的位置对照 |
| IN-NET-01 | P0 | Mac Win | T | — | 网络连接 | 开着网络监控，依次做：启动、新建、打开文件、打字、拼写检查、插入图片、导出 PDF、打印预览、打开帮助、退出。记下每一个出站连接（地址、端口、发生在哪一步）。期望：没有，或者只有点帮助链接时由浏览器发起的 |
| IN-NET-02 | P0 | Mac Win | T | — | 断网使用 | 关掉 Wi-Fi 和有线网络：启动、打开、编辑、拼写检查、导出 PDF、打印预览都应正常，没有报错或长时间等待 |
| IN-GPU-01 | P1 | Mac Win | T | — | 显卡和渲染后端 | 日志里 `graphics:` 开头的行原样记下（用了 Metal、DirectX 12 还是 OpenGL，哪块显卡）；高分屏上文字是否清晰；Windows 上如果启动失败，按 README 的 `WGPU_BACKEND` 方法试一次 |
| IN-LOG-01 | P1 | Mac Win | T | — | 日志的位置和内容 | 日志在 README 写的位置；打开一个有文字的文件、编辑后关闭，日志里不应出现文档的文字（README 说"Document text is never logged"）。用一个特殊的词（如 `Zebrafish4271`）写进文档，再在日志里搜 |
| IN-LAU-01 | P1 | Mac Win | T | — | ArtCraft Launcher | 官网把启动器列为推荐的安装方式。从 [craft-launcher 的 Release](https://github.com/storytold/craft-launcher/releases) 下载并核对 SHA-256，检查签名（同 IN-SIG）；用它安装或找到已装的 WordCraft，看装的是不是同一个官方安装包、装在哪里、版本对不对；有没有出站连接（开着网络监控），连的是哪里。启动器本身记在 `run.yaml` 的 `tools` 里 |
| IN-MON-01 | P2 | Mac Win | T | — | 多显示器和缩放 | 把窗口拖到另一块缩放比例不同的显示器上，文字和界面是否正确缩放；重启后窗口位置是否记住 |
