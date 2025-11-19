@echo off
chcp 65001 >nul
echo ========================================
echo    IGDM Universal - 启动应用
echo ========================================
echo.
echo 正在启动应用，请稍候...
echo.
echo 首次启动可能需要 10-20 秒
echo.

cd /d %~dp0
call npm run electron:dev

pause

