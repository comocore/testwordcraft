# MC-SEC-05 on Windows: checks that WordCraft's control port refuses requests without the window's key.
# Start the app first:  & "C:\Program Files\WordCraft\wordcraft.exe" --control 7981
#
#   .\tools\control-port-win.ps1 [-Port 7981]

param([int]$Port = 7981)

function Send-Line([string]$line, [int]$waitSeconds = 5) {
    $client = New-Object System.Net.Sockets.TcpClient('127.0.0.1', $Port)
    $stream = $client.GetStream()
    $stream.ReadTimeout = $waitSeconds * 1000
    $bytes = [Text.Encoding]::UTF8.GetBytes($line)
    $stream.Write($bytes, 0, $bytes.Length)
    $reader = New-Object IO.StreamReader($stream)
    try { $reply = $reader.ReadLine() } catch { $reply = '(no reply)' }
    try { $closed = ($reader.ReadLine() -eq $null) } catch { $closed = $false }
    $client.Close()
    [pscustomobject]@{ reply = $reply; closedByServer = $closed }
}

$keyFile = Join-Path $env:APPDATA "WordCraft\control-key.local-$Port"

'1. Without the key (expect "unauthorized", then the server closes the connection):'
Send-Line "{`"id`":1,`"method`":`"engine.commands`"}`n" | Format-List

'2. Not JSON, like a request from a web page (expect an error, then the connection closed):'
Send-Line "GET / HTTP/1.1`r`nHost: 127.0.0.1`r`n`r`n" | Format-List

'3. With the key (expect "ok":true):'
if (Test-Path $keyFile) {
    $key = (Get-Content $keyFile -Raw).Trim()
    $r = Send-Line "{`"id`":1,`"key`":`"$key`",`"method`":`"document.inspect`"}`n"
    $r.reply.Substring(0, [Math]::Min(300, $r.reply.Length))
} else {
    "key file not found: $keyFile"
}

'4. Connect and send nothing (expect the server to close the connection after about 30 seconds):'
$client = New-Object System.Net.Sockets.TcpClient('127.0.0.1', $Port)
$stream = $client.GetStream()
$stream.ReadTimeout = 70000
$start = Get-Date
try { $n = $stream.Read((New-Object byte[] 1), 0, 1) } catch { $n = -1 }
$client.Close()
'closed after {0:N1} s (read returned {1}; 0 means the server closed it, -1 means it timed out at 70 s)' -f ((Get-Date) - $start).TotalSeconds, $n
