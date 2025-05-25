# Project-50 Android应用构建指南

## 项目状态

✅ **已完成的配置**
- Capacitor 7.x 已安装并配置
- Android平台已添加
- 移动端插件已安装（SplashScreen, StatusBar, Keyboard, Preferences）
- 移动端适配代码已实现
- 应用已构建并同步到Android项目

## 环境要求

### 必需软件
1. **Android Studio** (最新版本)
   - 下载地址：https://developer.android.com/studio
   - 包含Android SDK和模拟器

2. **Java JDK 8+**
   - 推荐使用JDK 11或17
   - 可通过Android Studio安装

3. **Node.js** (已安装)
   - 版本：16.x 或更高

### Android SDK配置
1. 打开Android Studio
2. 进入 Settings > Appearance & Behavior > System Settings > Android SDK
3. 确保安装以下组件：
   - Android SDK Platform 33 (或最新版本)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

## 构建步骤

### 1. 打开Android项目
```bash
# 在项目根目录执行
npx cap open android
```

这将在Android Studio中打开项目。

### 2. 首次打开配置
1. **Gradle同步**：Android Studio会自动开始Gradle同步
2. **等待索引**：等待Android Studio完成项目索引
3. **检查SDK**：确保Android SDK路径正确配置

### 3. 运行应用（开发模式）

#### 使用模拟器
1. 在Android Studio中点击 "AVD Manager"
2. 创建新的虚拟设备（推荐Pixel 4 或更新）
3. 选择API Level 33或更高
4. 启动模拟器
5. 点击 "Run" 按钮或按 Shift+F10

#### 使用真机
1. 在手机上启用开发者选项和USB调试
2. 连接手机到电脑
3. 在Android Studio中选择设备
4. 点击 "Run" 按钮

### 4. 构建APK（发布版本）

#### Debug APK
```bash
# 在android目录下执行
cd android
./gradlew assembleDebug
```
APK位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK（需要签名）
```bash
# 在android目录下执行
cd android
./gradlew assembleRelease
```

## 应用配置

### 当前配置信息
- **应用ID**：com.project50.app
- **应用名称**：Project-50
- **版本**：1.0.0
- **最小SDK版本**：22 (Android 5.1)
- **目标SDK版本**：33 (Android 13)

### 权限配置
当前应用已配置以下权限：
- `INTERNET`：网络访问权限

### 插件功能
- **启动画面**：2秒显示，紫色背景
- **状态栏**：支持深浅色模式切换
- **键盘**：自动调整布局
- **存储**：跨平台数据持久化

## 移动端特性

### 已实现的移动端优化
1. **响应式设计**：完美适配各种屏幕尺寸
2. **安全区域适配**：支持刘海屏和圆角屏幕
3. **触摸优化**：44px最小触摸目标
4. **键盘适配**：输入时自动调整布局
5. **主题同步**：状态栏颜色跟随应用主题
6. **存储适配**：使用原生存储API

### 移动端功能
- ✅ 深浅色主题切换
- ✅ 数据持久化存储
- ✅ 启动画面
- ✅ 状态栏样式控制
- ✅ 键盘自适应
- ✅ 触摸优化
- ✅ 安全区域适配

## 开发工作流

### 日常开发
1. **修改React代码**
2. **构建应用**：`npm run build`
3. **同步到Android**：`npx cap sync android`
4. **在Android Studio中运行**

### 快速同步命令
```bash
# 一键构建并同步
npm run build && npx cap sync android
```

## 发布准备

### 1. 生成签名密钥
```bash
keytool -genkey -v -keystore project-50-release-key.keystore -alias project-50 -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置签名
在 `android/app/build.gradle` 中添加签名配置：
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/project-50-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'project-50'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. 构建发布版本
```bash
cd android
./gradlew assembleRelease
```

### 4. 应用图标
当前使用默认图标，可以替换以下文件：
- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

推荐使用Android Studio的Image Asset Studio生成图标。

## 故障排除

### 常见问题

#### 1. Gradle同步失败
- 检查网络连接
- 清理项目：`./gradlew clean`
- 重新同步：`npx cap sync android`

#### 2. 应用无法启动
- 检查Android SDK版本
- 确保模拟器API Level >= 22
- 查看Android Studio的Logcat输出

#### 3. 网络请求失败
- 确保后端服务器正在运行
- 检查网络权限配置
- 考虑使用HTTPS（生产环境）

#### 4. 插件错误
- 确保所有Capacitor插件版本兼容
- 重新安装插件：`npm install --force`
- 清理并重新同步

### 调试技巧
1. **使用Chrome DevTools**：在应用中打开 `chrome://inspect`
2. **查看Logcat**：Android Studio > View > Tool Windows > Logcat
3. **网络调试**：使用Charles或Fiddler代理工具

## 性能优化

### 已实现的优化
- 代码分割和懒加载
- 图片压缩和优化
- 移动端专用CSS
- 触摸事件优化

### 进一步优化建议
- 启用ProGuard代码混淆
- 使用WebP图片格式
- 实现离线缓存
- 优化包大小

## 下一步计划

### 功能扩展
- [ ] 推送通知
- [ ] 文件上传/下载
- [ ] 相机集成
- [ ] 地理位置服务
- [ ] 生物识别认证

### 发布渠道
- [ ] Google Play Store
- [ ] 华为应用市场
- [ ] 小米应用商店
- [ ] 其他第三方应用市场

---

**构建日期**：2024年12月  
**Capacitor版本**：7.2.0  
**Android目标版本**：API 33 (Android 13)  
**开发团队**：Project-50 AI Team 