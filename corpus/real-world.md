# 真实文档（R 类）

第三方文档只记来源，不进仓库。下载到 `corpus/real/`，文件名用用例 ID 加原扩展名（如 `DX-REAL-01.docx`），然后在下表填上实际下载地址、日期和 SHA-256（Mac：`shasum -a 256 <文件>`；Windows：`Get-FileHash <文件>`）。

挑选规则：

- 优先选读者真会收到的文件：政府表格、会议和期刊模板、Microsoft 官方模板、学校模板。
- 一律从发布者自己的网站下载，不用第三方转存的副本。
- 发布者更新了文件，就当作一个新文件：换新的 SHA-256，旧结果保留并注明版本。
- 文件里如果有真实的个人信息，换一个文件。

## 待选定的文件

| ID | 文件 | 从哪里下载 | 许可 | 实际下载地址 | 下载日期 | SHA-256 |
|---|---|---|---|---|---|---|
| DX-REAL-01 | NIH 履历表格式页（Biosketch Format Page，非 Fellowship 版） | grants.nih.gov/grants/forms/biosketch.htm | 美国联邦政府作品，公有领域 | | | |
| DX-REAL-02 | IEEE 会议论文 Word 模板（US Letter 或 A4） | ieee.org/conferences/publishing/templates.html | © IEEE，只链接 | | | |
| DX-REAL-03 | APA 第 7 版学生论文范文（.docx，不带批注的版本） | apastyle.apa.org 的 Sample Papers 页面 | © APA，只链接 | | | |
| DX-REAL-04 | Microsoft 简历模板（任选一个有文本框和形状的） | create.microsoft.com 的 Word 模板 | © Microsoft，只链接 | | | |
| DX-REAL-05 | Microsoft 报告模板（有封面和目录的） | 同上 | 同上 | | | |
| DX-REAL-06 | Microsoft 新闻稿或传单模板 | 同上 | 同上 | | | |
| DX-REAL-07 | Microsoft 发票或信函模板 | 同上 | 同上 | | | |
| DX-REAL-08 | 英国政府的合同模板（如 Model Services Contract） | gov.uk | 开放政府许可 OGL v3.0，可以再分发 | | | |
| DX-REAL-09 | 美国政府的报告或计划模板（如 NIH Data Management and Sharing Plan 格式页） | grants.nih.gov 等联邦机构网站 | 公有领域 | | | |
| DX-REAL-10 | 英文学位论文 Word 模板 | 一所大学研究生院的网站 | 按学校规定，只链接 | | | |
| ZH-DOC-03 | 2026 年度浙江省自然科学基金项目申请书正文撰写提纲 | 浙江省科技厅网站 zjnsf.kjt.zj.gov.cn（检索时见到的地址：`https://zjnsf.kjt.zj.gov.cn/isp/staticfiles/ueditor/202507/4. 2026年度浙江省自然科学基金项目申请书正文撰写提纲.docx`，下载时核对） | 政府发布，只链接 | | | |
| ZH-DOC-04 | 高校学位论文 Word 模板 | 一所高校研究生院的网站 | 只链接 | | | |
| ZH-DOC-06 | 中文合同 | 私有样本，或政府部门发布的合同示范文本 | 私有样本不公开 | | | |
| ZH-DOC-08 | 政府网站的办事表格（.docx） | 任一政府网站 | 只链接 | | | |

## 已固定的文件

这些文件按某一次提交固定下来，地址和 SHA-256 不会变。下载命令（Mac）：

```sh
mkdir -p corpus/real && cd corpus/real
POI=https://raw.githubusercontent.com/apache/poi/7a9f1acdea52ab7ef503ab0c5d6d7a8bce15a093/test-data/document
LO=https://raw.githubusercontent.com/LibreOffice/core/022c34f162f94d59499ec48e48edbfd075f583b0/sw/qa/extras/ooxmlimport/data
curl -fLO "$POI/chartex.docx"   # 依此类推，文件名见下表
shasum -a 256 *.docx            # 和下表对照
```

### Apache POI 测试文件（DX-REAL-11，Apache-2.0）

提交 `7a9f1acdea52ab7ef503ab0c5d6d7a8bce15a093`（2026-10-16），目录 `test-data/document/`。

| ID | 文件 | 测什么 | SHA-256 |
|---|---|---|---|
| DX-REAL-11-01 | chartex.docx | Office 2016 起的新图表类型 | `5d7f0ca9aa26d0244eedbc8ff862f08910689ec3848a036c622b17d56a290b57` |
| DX-REAL-11-02 | ComplexNumberedLists.docx | 复杂的多级编号 | `297a085a7d433af2eeee7661e8db21539452cb585096484774a1e9f5f258b0b6` |
| DX-REAL-11-03 | drawing.docx | 绘图对象 | `5e83462dd7ac3cf0a333fe09cf0837602dbd41775cdcec813a6e288b5d55dff8` |
| DX-REAL-11-04 | shapes-with-text.docx | 带文字的形状 | `1ef4d8cbfd5e2333897ab3193b58ce445cee7e45476d39e5626a4c7097f72d95` |
| DX-REAL-11-05 | VariousPictures.docx | 多种格式的图片 | `c1eecbca7de9f99e21c677e1d5b045eaa1d5a442eff4c82f0cbe9af93726a070` |
| DX-REAL-11-06 | WordWithAttachments.docx | 嵌入的附件 | `90352263823e6d3d39a4ec88212134b74bcb0f86b603bc3b51d712a3ec3df9f2` |
| DX-REAL-11-07 | checkboxes.docx | 复选框 | `06f1dc1370c772a020c6d5183c8b7c4fe30ad7a9fff108cb2f027128ddf5e209` |
| DX-REAL-11-08 | deep-table-cell.docx | 很深的表格嵌套 | `31c5bfe1f68c98699cb356891de2e02fe223f633706d666c430ca79fd2cdf6bb` |
| DX-REAL-11-09 | rtl.docx | 从右到左文字 | `d159b6ac6734f14a9ecf8e97ca5029bdcddbfae2d33ba0128aa774924e0b190d` |
| DX-REAL-11-10 | bug53475-password-is-pass.docx | 加密文件，密码 `pass` | `c182f7825ae588fe1c28497588d1bded635a5bef7eb7370fd1c589233a6471d5` |
| DX-REAL-11-11 | FieldCodes.docx | 各种域 | `9247f85ab90b15f11d0cf14d0070fdcb5cdf47c65d6bc77cc32cb7ee682aad24` |
| DX-REAL-11-12 | testComment.docx | 批注 | `06b63b13f0b78a7179151af52c2282557c1ed204899feee9fcef4ca575344f97` |

### LibreOffice 导入测试文件（DX-REAL-12，MPL-2.0，只链接）

提交 `022c34f162f94d59499ec48e48edbfd075f583b0`（2026-10-18），目录 `sw/qa/extras/ooxmlimport/data/`。这个目录里有 164 个 .docx，按文件名排序后，用 mulberry32 随机数（种子 20261017）不放回地抽 10 个，没有挑选。这些文件大多来自 LibreOffice 的缺陷报告，多数只有一两页。

| ID | 文件 | SHA-256 |
|---|---|---|
| DX-REAL-12-01 | n751077.docx | `0622682cda1b279eeef48b2ee712c0ae3715aa30a55f595ef68fd074b058a046` |
| DX-REAL-12-02 | tdf108806.docx | `c29e2d98a3529b1bfdc72d7395e876dba2ee1f1c1b0559641219538e97440a0b` |
| DX-REAL-12-03 | bnc821804.docx | `6a66ac553967af5bf5c2986290fe97ab193a9f0396145aeb293ec7004f083a12` |
| DX-REAL-12-04 | tdf126426.docx | `6a9976757ed67b69bfde0ed4e51963f4d8c1171aac637ea2a011df5fa4f0bc1b` |
| DX-REAL-12-05 | tdf108350.docx | `b552cc3388f0cb0a58e42df11e7d3de79dab6025ba346daf83b8cc61fb4a46af` |
| DX-REAL-12-06 | tdf120547.docx | `d21b5f62aa451b2dac75529d1837dc93224955d831cc51618883e445096723a8` |
| DX-REAL-12-07 | \_\_RefNumPara\_\_.docx | `c315ac2926a0beaa74c3785a9cecd827ff109c344cb065a2c87f55c74b606edf` |
| DX-REAL-12-08 | tdf113182.docx | `e27644fb12f7199cddede41467b05e49e3f4dd66231fc2c734cbc990662ecf03` |
| DX-REAL-12-09 | fdo76583.docx | `13f6ca33ab26b539a9f8f1073275c60182d7e4492b29326d2a8e2ff34ef7638f` |
| DX-REAL-12-10 | btlr-frame-vml.docx | `520b5689a4f7e8958ec338f486ff74e61c88d8bc5ec71d9a60b9a54ce2c3d82b` |

### 有意损坏的文件（ST-BAD-05，Apache-2.0）

来自同一个 Apache POI 提交。它们是让 POI 出错的模糊测试样本，用来看 WordCraft 会不会崩溃。在 note 里分别记四个文件的结果。

| 文件 | SHA-256 |
|---|---|
| clusterfuzz-testcase-minimized-POIXWPFFuzzer-4791943399604224.docx | `096a1119c0fd110d7fb7b93db16bd1a302513732d8dd0bd7641ecedafbe36f43` |
| clusterfuzz-testcase-minimized-POIXWPFFuzzer-5166796835258368.docx | `9a78086d1bfd6aab90fa1c1e12569c166267a1d7e1e6c5d36e4bfb64c5ee10b9` |
| crash-517626e815e0afa9decd0ebb6d1dee63fb9907dd.docx | `4fa1dc1cd5bddeaa5a14169d9a4f5abdc687d732c3beb06901cf9a701533d466` |
| truncated62886.docx | `39619851dab09369e91f926a94499caba0749ca2fa57d30b2fc2bc4a937292d0` |
