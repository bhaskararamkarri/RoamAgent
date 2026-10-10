#!/usr/bin/env bash
set -e

echo "=== Starting TBS RoamAgent Development Servers ==="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Cleanup background processes on exit
cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting Backend on http://localhost:8000 ..."
cd "$ROOT_DIR/backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting Frontend on http://localhost:3000 ..."
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "TBS RoamAgent is running!"
echo "Backend:  http://localhost:8000 (API Docs: http://localhost:8000/docs)"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

wait
