# 测试文件

| 目录或文件 | 内容 | 进仓库 |
|---|---|---|
| `generated/` | `tools/make-corpus.mjs` 生成的源文件（G 类）、文本和数据文件，以及 `manifest.json`、`SHA256SUMS.txt` | 否，随时可以重新生成 |
| `docx/` | 正式测试文件：G 类经 Word 打开、核对、另存后的版本；W 类按 [recipes.md](recipes.md) 在 Word 里做的文件 | 是 |
| `producers/` | P 类：其他软件（Google 文档、LibreOffice、Pages、WPS……）写出的文件 | 是 |
| `reference/word-mac/` | Word for Mac 导出的参考 PDF，文件名同测试文件 | 是 |
| `reference/word-win/` | Windows 版 Word 导出的参考 PDF | 是 |
| `real/` | R 类第三方真实文档，按 [real-world.md](real-world.md) 下载 | 否，只记下载地址和 SHA-256 |
| `baseline.yaml` | Word 基准的记录：哪个文件、用哪个版本的 Word 核对，通过与否，有什么问题 | 是 |

## 生成

```sh
node tools/make-corpus.mjs              # 全部，约 1 分钟，约 60 MB
node tools/make-corpus.mjs --skip-large # 不含性能测试的大文件
```

同样的脚本每次生成的文件逐字节相同（SHA-256 见 `generated/SHA256SUMS.txt`）。填充用的文字由脚本按固定种子生成，不含任何第三方文本。

## Word 基准

步骤见 [../README.md](../README.md) §3.4。核对时发现源文件本身有问题（Word 报错，或者显示和文件开头写的"Expected / 预期"不符），在 `baseline.yaml` 里记下来，这个文件先不用，告诉编辑去修生成脚本。

`baseline.yaml` 的格式：

```yaml
word: Microsoft Word for Mac 16.xx (xxxxxxxx)
date: 2026-10-20
files:
  - file: DX-TBL-02.docx
    ok: true
  - file: DX-PAR-08.docx
    ok: false
    note: 首字下沉的字母比三行高，和"Expected"不符
```

## 公开和许可

`docx/`、`producers/`、`reference/` 里的文件，生成脚本的输出，`runs/` 里的记录，以及方案和用例文档，以 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans) 公开（[LICENSE-CC-BY-4.0](../LICENSE-CC-BY-4.0)），署名写"GetWordCraft test corpus, getwordcraft.org"。`tools/` 里的脚本以 MIT 或 Apache-2.0 双许可公开（[LICENSE-MIT](../LICENSE-MIT)、[LICENSE-APACHE](../LICENSE-APACHE)），和 WordCraft 本身一样，任选其一。

第三方真实文档不放进仓库、不提供下载，只公开它的来源地址、下载日期和 SHA-256，读者可以自己下载同一个文件来复现。许可明确允许再分发的（Apache-2.0 的 Apache POI 测试文件、英国政府的 OGL 文件），以后可以随测试数据一起提供，并附上原许可。

私有样本（DX-PRIV、中文合同等）永远不公开，截图只留在本地。
