# KodNest Premium Build System - PowerShell Server Script

Write-Host "Starting KodNest Premium Build System Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will start on http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Check if Python is available
$python3 = Get-Command python -ErrorAction SilentlyContinue
$python2 = Get-Command python2 -ErrorAction SilentlyContinue

if ($python3) {
    Write-Host "Starting Python 3 HTTP server..." -ForegroundColor Cyan
    Start-Process "http://localhost:8000/examples/layout-example.html"
    Start-Sleep -Seconds 2
    python -m http.server 8000
} elseif ($python2) {
    Write-Host "Starting Python 2 HTTP server..." -ForegroundColor Cyan
    Start-Process "http://localhost:8000/examples/layout-example.html"
    Start-Sleep -Seconds 2
    python2 -m SimpleHTTPServer 8000
} else {
    Write-Host "Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please choose one of these options:" -ForegroundColor Yellow
    Write-Host "1. Install Python from https://www.python.org/" -ForegroundColor White
    Write-Host "2. Use VS Code Live Server extension" -ForegroundColor White
    Write-Host "3. Open examples/layout-example.html directly in your browser" -ForegroundColor White
    Write-Host ""
    Write-Host "Or open the HTML files directly:" -ForegroundColor Cyan
    Write-Host "  examples/layout-example.html" -ForegroundColor White
    Write-Host "  examples/components-example.html" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
}
