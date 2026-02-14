@echo off
REM Start KodNest dev server from project root
cd /d "%~dp0"
echo Starting KodNest dev server in %cd%
npm run dev
