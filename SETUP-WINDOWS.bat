@echo off
setlocal
cd /d "%~dp0"
echo ==============================================
echo       NYAYA SUMMARIZER - WINDOWS SETUP
echo ==============================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not in PATH.
  echo Install Node.js 20 LTS, restart VS Code, and run this file again.
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo Created .env from .env.example. You can edit AUTH_SECRET later.
)
echo Installing project dependencies...
call npm.cmd install
if errorlevel 1 goto failed
echo Generating Prisma client...
call npx.cmd prisma generate
if errorlevel 1 goto failed
echo Creating/updating local SQLite database...
call npx.cmd prisma db push
if errorlevel 1 goto failed
echo Seeding demo data...
call node prisma\seed.js
if errorlevel 1 goto failed
echo.
echo Setup complete. Starting the development server...
call npm.cmd run dev
goto end
:failed
echo.
echo Setup failed. Copy the full terminal error and share it for troubleshooting.
pause
exit /b 1
:end
endlocal
