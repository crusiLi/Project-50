@echo off
echo ========================================
echo 构建包含嵌入式后端的Project-50 APK
echo ========================================

echo.
echo [1/4] 清理之前的构建...
if exist build rmdir /s /q build
if exist android\app\build rmdir /s /q android\app\build

echo.
echo [2/4] 构建React应用（包含嵌入式后端）...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [3/4] 同步到Android项目...
call npx cap sync android
if %errorlevel% neq 0 (
    echo 同步失败！
    pause
    exit /b 1
)

echo.
echo [4/4] 构建Android APK...
cd android
call gradlew assembleDebug --offline --no-daemon
if %errorlevel% neq 0 (
    echo APK构建失败！尝试在线构建...
    call gradlew assembleDebug --no-daemon
    if %errorlevel% neq 0 (
        echo APK构建失败！
        cd ..
        pause
        exit /b 1
    )
)
cd ..

echo.
echo ========================================
echo 构建完成！
echo ========================================
echo.
echo APK文件位置：
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 功能特性：
echo - 完全嵌入式后端（无需外部服务器）
echo - 本地数据存储
echo - 离线运行支持
echo - 用户认证系统
echo - 任务管理
echo - 打卡记录
echo - 习惯追踪
echo - 数据统计
echo.
pause 