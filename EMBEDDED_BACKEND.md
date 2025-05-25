# Project-50 嵌入式后端集成

## 概述

Project-50 现在支持完全嵌入式后端，这意味着整个Node.js后端功能已经被集成到Android应用中，无需外部服务器即可运行。

## 架构设计

### 1. 本地API系统 (`src/utils/localAPI.ts`)
- 完整的用户管理系统
- 任务（Todo）管理
- 打卡记录管理
- 习惯追踪系统
- 统计数据计算
- 本地数据持久化

### 2. API适配器 (`src/utils/apiAdapter.ts`)
- 统一的API接口
- 自动在本地API和远程API之间切换
- 网络故障时自动降级到本地模式
- 移动端默认使用本地API

### 3. 认证适配器 (`src/utils/authAdapter.ts`)
- 统一的认证接口
- 用户会话管理
- 兼容性函数支持
- 自动初始化

### 4. 移动端集成 (`src/utils/capacitor.ts`)
- 自动检测移动端环境
- 嵌入式后端初始化
- 状态栏和启动画面管理
- 键盘适配

## 功能特性

### ✅ 完全离线运行
- 无需网络连接
- 无需外部服务器
- 数据完全本地存储

### ✅ 用户系统
- 用户注册和登录
- 密码验证
- 会话管理
- 默认用户支持

### ✅ 任务管理
- 创建、编辑、删除任务
- 任务分类和优先级
- 完成状态跟踪
- 日期过滤

### ✅ 打卡系统
- 每日打卡记录
- 完成率计算
- 历史记录查看
- 笔记支持

### ✅ 习惯追踪
- 习惯创建和管理
- 连续天数统计
- 分类管理
- 完成状态跟踪

### ✅ 数据统计
- 总体完成情况
- 平均完成率
- 连续打卡天数
- 习惯统计

## 数据存储

### 存储方式
- **移动端**: Capacitor Preferences API
- **Web端**: localStorage
- **格式**: JSON序列化

### 数据结构
```typescript
// 用户数据
interface User {
  id: string;
  username: string;
  password: string;
  registrationDate: string;
  currentDay: number;
  totalDays: number;
}

// 任务数据
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// 打卡记录
interface PunchRecord {
  id: number;
  date: string;
  completedTodos: number;
  totalTodos: number;
  completionRate: number;
  notes?: string;
  createdAt: string;
}

// 习惯数据
interface Habit {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  createdAt: string;
}
```

## 使用方法

### 开发环境
```bash
# 启动Web开发服务器（使用远程API）
npm start

# 构建生产版本
npm run build

# 同步到Android
npx cap sync android

# 构建APK
cd android && gradlew assembleDebug
```

### 一键构建
```bash
# 使用构建脚本
./build-apk.bat
```

## API接口

### 认证相关
```typescript
// 登录
await authAdapter.login(username, password)

// 注册
await authAdapter.register(username, password)

// 获取当前用户
authAdapter.getCurrentUser()

// 退出登录
await authAdapter.logout()
```

### 任务管理
```typescript
// 获取今日任务
await authAdapter.getTodayTodos()

// 添加任务
await authAdapter.addTodo(text, category, priority)

// 更新任务
await authAdapter.updateTodo(todoId, updates)

// 删除任务
await authAdapter.deleteTodo(todoId)
```

### 打卡记录
```typescript
// 添加打卡记录
await authAdapter.addPunchRecord(completed, total, notes)

// 获取打卡记录
await authAdapter.getPunchRecords()
```

### 习惯管理
```typescript
// 获取习惯列表
await authAdapter.getHabits()

// 更新习惯
await authAdapter.updateHabit(habitId, updates)
```

### 统计数据
```typescript
// 获取统计信息
await authAdapter.getStatistics()
```

## 网络状态管理

应用会自动检测运行环境：
- **移动端**: 默认使用嵌入式后端
- **Web端**: 优先使用远程API，失败时降级到本地API
- **网络故障**: 自动切换到离线模式

状态指示器显示当前模式：
- 🔵 **嵌入式后端**: 完全离线运行
- 🟢 **在线**: 连接到远程服务器
- 🟡 **离线模式**: 使用本地数据

## 默认数据

### 默认用户
- 用户名: `user`
- 密码: `123456`

### 默认习惯
1. 早起 (健康)
2. 运动 (健康)
3. 阅读 (学习)
4. 冥想 (心理)

## 兼容性

### 支持的平台
- ✅ Android 6.0+ (API 23+)
- ✅ 现代Web浏览器
- ✅ 离线环境

### 技术要求
- React 18+
- Capacitor 7+
- TypeScript 4+
- Material-UI 5+

## 故障排除

### 常见问题

1. **APK安装后显示空白页面**
   - 检查网络状态指示器
   - 确认嵌入式后端已初始化
   - 查看控制台日志

2. **数据丢失**
   - 数据存储在设备本地
   - 卸载应用会清除数据
   - 建议定期备份重要数据

3. **登录失败**
   - 使用默认账户: user/123456
   - 或注册新账户
   - 检查用户名和密码格式

### 调试信息

在浏览器控制台中查看：
```javascript
// 检查API模式
authAdapter.getAPIMode()

// 检查当前用户
authAdapter.getCurrentUser()

// 检查API健康状态
await authAdapter.checkAPIHealth()
```

## 更新日志

### v2.0.0 - 嵌入式后端集成
- ✅ 完整的本地API系统
- ✅ 统一的API适配器
- ✅ 自动模式切换
- ✅ 移动端优化
- ✅ 网络状态管理
- ✅ 默认数据支持

### v1.0.0 - 基础版本
- ✅ 基本的前后端分离架构
- ✅ 网络API调用
- ✅ 用户界面

## 技术支持

如有问题，请检查：
1. 控制台错误信息
2. 网络状态指示器
3. API模式显示
4. 设备存储空间

---

**Project-50 嵌入式后端** - 让您的应用完全独立运行！ 