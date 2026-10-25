# Samples a process's memory (MB) and CPU (%) once a second, as CSV.
#
#   .\tools\sample-memory-win.ps1 -Name wordcraft -Seconds 120 > runs\<run>\evidence\PF-MEM-02-wordcraft.csv
#
# private_mb is close to Task Manager's "Memory (active private working set)"; record that column too.

param(
    [Parameter(Mandatory)][string]$Name,
    [int]$Seconds = 60
)

$p = Get-Process -Name $Name -ErrorAction Stop | Select-Object -First 1
$cores = [Environment]::ProcessorCount
'second,private_mb,working_set_mb,cpu_percent'
$last = $p.TotalProcessorTime
for ($i = 0; $i -lt $Seconds -and -not $p.HasExited; $i++) {
    Start-Sleep -Seconds 1
    $p.Refresh()
    $cpu = ($p.TotalProcessorTime - $last).TotalSeconds / $cores * 100
    $last = $p.TotalProcessorTime
    '{0},{1:N1},{2:N1},{3:N1}' -f $i, ($p.PrivateMemorySize64 / 1MB), ($p.WorkingSet64 / 1MB), $cpu
}
