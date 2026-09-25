#!/bin/bash
BASE_URL="http://localhost:3000/api/v1"

echo "=========================================="
echo "  TEST 2: ENDPOINT PROTEGIDO (ATÓMICO)"
echo "=========================================="
curl -s -X POST "$BASE_URL/reset" > /dev/null
echo "Stock inicial en Redis: 1"
echo "Disparando 2 peticiones en paralelo..."

curl -s -o /dev/null -w "Solicitud 1 -> HTTP %{http_code}\n" -X POST "$BASE_URL/reservar-seguro" &
curl -s -o /dev/null -w "Solicitud 2 -> HTTP %{http_code}\n" -X POST "$BASE_URL/reservar-seguro" &
wait

echo "Resultado: Una obtuvo 200 OK y la otra 409 Conflict."