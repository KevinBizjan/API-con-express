#!/bin/bash
BASE_URL="http://localhost:3000/api/v1"

echo "=========================================="
echo "  TEST 1: ENDPOINT VULNERABLE"
echo "=========================================="
curl -s -X POST "$BASE_URL/reset" > /dev/null
echo "Stock inicial en Redis: 1"
echo "Disparando 2 peticiones en paralelo..."

curl -s -w " Solicitud 1 -> HTTP %{http_code}\n" -X POST "$BASE_URL/reservar-vulnerable" &
curl -s -w " Solicitud 2 -> HTTP %{http_code}\n" -X POST "$BASE_URL/reservar-vulnerable" &
wait

# -o /dev/null

#echo "Resultado: Ambas obtuvieron 200 OK (Condición de carrera / Overbooking)."