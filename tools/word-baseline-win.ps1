# Reference PDFs from Word for Windows (README.md §3.4).
#
#   .\tools\word-baseline-win.ps1                    PDFs of corpus\docx into corpus\reference\word-win
#   .\tools\word-baseline-win.ps1 -Mode baseline     generated\*.docx saved by Word into corpus\docx, plus PDFs
#
# Also writes word-win-pages.csv with the page count Word reports for each file.
# Not tested by us. If it fails, open and export the files by hand.

param(
    [string]$Corpus = (Join-Path $PSScriptRoot '..\corpus'),
    [ValidateSet('pdf', 'baseline')][string]$Mode = 'pdf'
)

$Corpus = (Resolve-Path $Corpus).Path
$pdfDir = Join-Path $Corpus 'reference\word-win'
New-Item -ItemType Directory -Force $pdfDir | Out-Null
if ($Mode -eq 'baseline') {
    $src = Join-Path $Corpus 'generated'
    New-Item -ItemType Directory -Force (Join-Path $Corpus 'docx') | Out-Null
} else {
    $src = Join-Path $Corpus 'docx'
}

$wdFormatDocumentDefault = 16
$wdExportFormatPDF = 17
$wdStatisticPages = 2

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$rows = @()
try {
    Get-ChildItem $src -Filter '*.docx' | Where-Object { $_.Name -notmatch '^(ST-BAD|DX-PKG-01)' } | ForEach-Object {
        $file = $_
        try {
            $doc = $word.Documents.Open($file.FullName, $false, ($Mode -eq 'pdf'))
            if ($Mode -eq 'baseline') { $doc.SaveAs2((Join-Path $Corpus "docx\$($file.Name)"), $wdFormatDocumentDefault) }
            $doc.ExportAsFixedFormat((Join-Path $pdfDir "$($file.BaseName).pdf"), $wdExportFormatPDF)
            $rows += [pscustomobject]@{ file = $file.Name; pages = $doc.ComputeStatistics($wdStatisticPages); status = 'ok' }
            $doc.Close(0)
        } catch {
            $rows += [pscustomobject]@{ file = $file.Name; pages = ''; status = $_.Exception.Message }
        }
        Write-Host $file.Name
    }
} finally {
    $word.Quit()
}
$rows | Export-Csv -NoTypeInformation -Encoding UTF8 (Join-Path $Corpus 'word-win-pages.csv')
