@echo off
chcp 65001 >nul
echo ========================================
echo Project-50 嵌入式后端 APK 离线构建
echo ========================================

echo.
echo [1/4] 清理之前的构建...
if exist build rmdir /s /q build 2>nul
if exist android\app\build rmdir /s /q android\app\build 2>nul

echo.
echo [2/4] 构建React应用（包含嵌入式后端）...
call npm run build
if %errorlevel% neq 0 (
    echo 错误：React应用构建失败
    pause
    exit /b 1
)

echo.
echo [3/4] 同步到Android项目...
call npx cap sync android
if %errorlevel% neq 0 (
    echo 错误：同步到Android失败
    pause
    exit /b 1
)

echo.
echo [4/4] 构建Android APK（离线模式）...
cd android

echo 尝试离线构建...
call .\gradlew assembleDebug --offline --no-daemon --stacktrace
if %errorlevel% equ 0 (
    echo ✅ 离线构建成功！
    goto :success
)

echo 离线构建失败，尝试使用缓存构建...
call .\gradlew assembleDebug --no-daemon --build-cache --stacktrace
if %errorlevel% equ 0 (
    echo ✅ 缓存构建成功！
    goto :success
)

echo 缓存构建失败，尝试清理后重新构建...
call .\gradlew clean --no-daemon
call .\gradlew assembleDebug --no-daemon --stacktrace
if %errorlevel% equ 0 (
    echo ✅ 清理后构建成功！
    goto :success
)

echo ❌ 所有构建方式都失败了
cd ..
echo.
echo 可能的解决方案：
echo 1. 检查网络连接
echo 2. 使用Android Studio打开项目并构建
echo 3. 手动下载Gradle依赖
pause
exit /b 1

:success
cd ..

echo.
echo ========================================
echo ✅ APK构建成功！
echo ========================================
echo.
echo APK文件位置：
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    for %%A in ("android\app\build\outputs\apk\debug\app-debug.apk") do (
        set size=%%~zA
        set /a sizeMB=!size!/1024/1024
        echo 文件大小：!sizeMB! MB
    )
) else (
    echo 警告：APK文件未找到
)

echo.
echo 嵌入式后端特性：
echo ✅ 完全离线运行（无需服务器）
echo ✅ 本地数据存储
echo ✅ 用户认证系统
echo ✅ 任务管理功能
echo ✅ 打卡记录系统
echo ✅ 习惯追踪功能
echo ✅ 数据统计分析
echo ✅ 智能API切换
echo.
echo 默认登录信息：
echo 用户名：user
echo 密码：123456
echo.
pause 