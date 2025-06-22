#!/bin/bash

ID=$1

URL="http://localhost:3000/fleet"
AUTH_HEADER="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGF3cy5jb20iLCJpYXQiOjE3NTA2MDM2NTcsImV4cCI6MTc1MDYwNzI1Nywic3ViIjoiMSJ9.RyBK2GppNaWWu0Uq0SN7avOb08kgsYRwLdG0LroBjwE"
CONCURRENT_USERS=1000

echo "🟢 Iniciando teste de concorrência com $CONCURRENT_USERS usuários..."
START_TIME=$(date +%s%3N)

mkdir -p results

for i in $(seq 1 $CONCURRENT_USERS); do
  (
    curl -s -o results/resp_$i.txt -w "%{http_code} %{time_total}" \
      -X POST "$URL" \
      -H "Content-Type: application/json" \
      -H "$AUTH_HEADER" \
      -d "{\"name\": \"($ID)_user$i\", \"nickname\": \"nick$i\", \"quantity\": 1}" \
      > results/result_$i.log
  ) &
done

wait

END_TIME=$(date +%s%3N)
TOTAL_TIME=$((END_TIME - START_TIME))

echo "✅ Teste concluído em $TOTAL_TIME ms"
echo ""
echo "📊 Relatório final:"
echo "------------------------"

SUCCESS=0
ERROR=0
TOTAL=0
SUM_TIME=0

for f in results/result_*.log; do
  ((TOTAL++))
  STATUS=$(cut -d' ' -f1 "$f")
  TIME=$(cut -d' ' -f2 "$f")
  MS=$(awk "BEGIN {print int($TIME * 1000)}")
  SUM_TIME=$((SUM_TIME + MS))
  if [ "$STATUS" = "201" ] || [ "$STATUS" = "200" ]; then
    echo "🟢 Sucesso [$STATUS] em ${MS}ms - $f"
    ((SUCCESS++))
  else
    echo "🔴 Erro [$STATUS] em ${MS}ms - $f"
    ((ERROR++))
  fi
done

AVG_TIME=$((SUM_TIME / TOTAL))

echo ""
echo "📌 Total: $TOTAL"
echo "🟢 Sucesso: $SUCCESS"
echo "🔴 Erro: $ERROR"
echo "⏱️ Tempo médio: ${AVG_TIME}ms"
echo "📁 Resultados salvos em ./results/"

