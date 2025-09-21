@echo off
echo Starting Tourism App Server...
cd /d "%~dp0"
npx serve build -p 8080
pause
