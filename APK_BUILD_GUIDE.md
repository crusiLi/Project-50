# Project-50 嵌入式后端 APK 构建指南

## 🎯 目标
构建包含完整嵌入式后端的Project-50 Android APK文件。

## ✅ 已完成的工作

### 1. 嵌入式后端集成
- ✅ 完整的本地API系统 (`src/utils/localAPI.ts`)
- ✅ 统一的API适配器 (`src/utils/apiAdapter.ts`)
- ✅ 认证适配器 (`src/utils/authAdapter.ts`)
- ✅ 移动端初始化 (`src/utils/capacitor.ts`)
- ✅ 网络状态管理 (`src/components/NetworkStatus.tsx`)

### 2. 功能特性
- ✅ 用户注册和登录
- ✅ 任务管理（增删改查）
- ✅ 打卡记录系统
- ✅ 习惯追踪功能
- ✅ 数据统计分析
- ✅ 本地数据持久化
- ✅ 完全离线运行

### 3. 构建准备
- ✅ React应用构建完成
- ✅ Capacitor同步完成
- ✅ Android项目配置完成

## 🚧 当前问题
由于网络连接问题，Gradle无法下载依赖，导致APK构建失败。

## 🔧 解决方案

### 方案一：Web版本测试（推荐）
```bash
# 启动开发服务器
npm start

# 在浏览器中打开
http://localhost:3000
```

**优势：**
- 立即可用，无需等待APK构建
- 完整的嵌入式后端功能
- 实时调试和测试
- 自动使用本地API模式

**测试步骤：**
1. 打开浏览器访问 http://localhost:3000
2. 使用默认账户登录：用户名 `user`，密码 `123456`
3. 测试所有功能：任务管理、打卡、习惯追踪等
4. 查看左上角状态指示器确认使用"嵌入式后端"

### 方案二：Android Studio构建
```bash
# 打开Android Studio
npx cap open android

# 在Android Studio中：
# 1. 等待项目同步完成
# 2. 点击 Build > Build Bundle(s) / APK(s) > Build APK(s)
# 3. 等待构建完成
```

### 方案三：修复网络后构建
```bash
# 当网络连接稳定后
./build-apk-offline.bat

# 或手动执行
cd android
.\gradlew assembleDebug --no-daemon
```

### 方案四：使用CI/CD服务
1. 将代码推送到GitHub
2. 使用GitHub Actions构建APK
3. 从Actions页面下载构建的APK

## 📱 APK特性预览

### 核心功能
- **完全离线运行**: 无需任何网络连接
- **嵌入式后端**: 所有服务器功能都在本地运行
- **数据持久化**: 使用Capacitor Preferences API
- **智能切换**: 自动在本地/远程API间切换

### 用户体验
- **即开即用**: 安装后立即可用，无需配置
- **状态指示**: 实时显示API模式（嵌入式/在线/离线）
- **默认数据**: 预置用户和习惯数据
- **优雅界面**: 保持原有的美观设计

### 技术架构
```
Project-50 APK
├── React前端 (打包在assets中)
├── 嵌入式后端 (JavaScript本地API)
├── 数据存储 (Capacitor Preferences)
├── 用户认证 (本地验证)
├── 任务管理 (本地CRUD)
├── 打卡系统 (本地记录)
└── 习惯追踪 (本地统计)
```

## 🧪 测试计划

### Web版本测试清单
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 任务创建和管理
- [ ] 打卡记录功能
- [ ] 习惯追踪功能
- [ ] 数据统计显示
- [ ] 页面导航功能
- [ ] 主题切换功能
- [ ] 设置页面功能
- [ ] 数据持久化测试

### 功能验证步骤
1. **登录测试**
   - 使用默认账户：user/123456
   - 验证登录成功并跳转到主页

2. **任务管理测试**
   - 创建新任务
   - 标记任务完成
   - 删除任务
   - 验证数据保存

3. **打卡功能测试**
   - 完成一些任务
   - 执行打卡操作
   - 查看打卡记录

4. **习惯追踪测试**
   - 查看默认习惯
   - 标记习惯完成
   - 查看连续天数

5. **数据持久化测试**
   - 刷新页面
   - 重新打开浏览器
   - 验证数据是否保存

## 📊 性能指标

### 预期APK大小
- **估计大小**: 6-8 MB
- **包含内容**: 
  - React应用 (~4MB)
  - Capacitor框架 (~2MB)
  - Android原生代码 (~1MB)
  - 嵌入式后端逻辑 (~1MB)

### 运行要求
- **Android版本**: 6.0+ (API 23+)
- **存储空间**: 20MB (包含数据)
- **内存要求**: 100MB RAM
- **网络要求**: 无（完全离线）

## 🔍 故障排除

### 常见问题
1. **Gradle构建失败**
   - 检查网络连接
   - 清理Gradle缓存
   - 使用Android Studio构建

2. **Web版本无法启动**
   - 检查Node.js版本
   - 重新安装依赖：`npm install`
   - 清理缓存：`npm start -- --reset-cache`

3. **功能异常**
   - 检查浏览器控制台错误
   - 验证localStorage权限
   - 确认JavaScript已启用

### 调试命令
```bash
# 检查构建状态
npm run build

# 检查Capacitor配置
npx cap doctor

# 清理并重新构建
npm run build && npx cap sync android

# 查看详细错误
cd android && .\gradlew assembleDebug --stacktrace
```

## 📞 技术支持

### 联系方式
- 查看控制台错误信息
- 检查网络状态指示器
- 验证API模式显示
- 确认设备存储空间

### 备用方案
如果所有构建方案都失败，可以：
1. 使用Web版本进行完整功能测试
2. 将项目部署到云端服务器
3. 使用在线APK构建服务
4. 寻求Android开发者协助

---

**Project-50 嵌入式后端** - 即使无法构建APK，Web版本也能提供完整的嵌入式后端体验！ 