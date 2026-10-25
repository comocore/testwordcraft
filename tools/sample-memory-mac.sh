#!/bin/sh
# Samples a process's memory (RSS, MB) and CPU (%) once a second, as CSV.
#
#   tools/sample-memory-mac.sh WordCraft 120 > runs/<run>/evidence/PF-MEM-02-wordcraft.csv
#
# RSS differs from the "Memory" column in Activity Monitor; record both (pf-performance.md).

name=${1:?process name, as shown in Activity Monitor}
seconds=${2:-60}
pid=$(pgrep -x "$name" | head -n 1)
if [ -z "$pid" ]; then
  echo "no process named $name" >&2
  exit 1
fi
echo "second,rss_mb,cpu_percent"
i=0
while [ "$i" -lt "$seconds" ] && kill -0 "$pid" 2>/dev/null; do
  ps -o rss=,%cpu= -p "$pid" | awk -v t="$i" '{ printf "%d,%.1f,%s\n", t, $1 / 1024, $2 }'
  i=$((i + 1))
  sleep 1
done
