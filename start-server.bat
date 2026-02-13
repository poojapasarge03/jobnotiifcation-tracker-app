@echo off
echo Starting KodNest Premium Build System Server...
echo.
echo Opening browser in 3 seconds...
echo Press Ctrl+C to stop the server
echo.

timeout /t 3 /nobreak >nul

REM Try Python 3 first
python -m http.server 8000 2>nul
if %errorlevel% equ 0 goto :end

REM Try Python 2
python -m SimpleHTTPServer 8000 2>nul
if %errorlevel% equ 0 goto :end

echo.
echo Python not found. Please use one of these methods:
echo.
echo 1. Install Python from https://www.python.org/
echo 2. Use VS Code Live Server extension
echo 3. Open examples/layout-example.html directly in your browser
echo.
pause

:end
