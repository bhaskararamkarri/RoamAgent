# Windows PowerShell startup script for TBS RoamAgent
Write-Host "=== Starting TBS RoamAgent Development Servers ===" -ForegroundColor Cyan

$RootDir = Split-Path -Parent $PSScriptRoot

Write-Host "Starting Backend on http://localhost:8000..." -ForegroundColor Green
$BackendProc = Start-Process python -ArgumentList "-m uvicorn app.main:app --host 0.0.0.0 --port 8000" -WorkingDirectory "$RootDir\backend" -PassThru

Write-Host "Starting Frontend on http://localhost:3000..." -ForegroundColor Green
$FrontendProc = Start-Process npm -ArgumentList "run dev" -WorkingDirectory "$RootDir\frontend" -PassThru

Write-Host ""
Write-Host "TBS RoamAgent is running!" -ForegroundColor Yellow
Write-Host "Backend API:  http://localhost:8000 (Docs: http://localhost:8000/docs)"
Write-Host "Frontend App: http://localhost:3000"
Write-Host "Press Enter to stop both servers..." -ForegroundColor Gray

Read-Host

Write-Host "Stopping servers..." -ForegroundColor Red
Stop-Process -Id $BackendProc.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $FrontendProc.Id -Force -ErrorAction SilentlyContinue
Write-Host "Done."
