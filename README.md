# Project-50 打卡挑战应用

<div align="center">
  <img src="public/favicon.svg" alt="Project-50 Logo" width="120" height="120">
  
  **🎯 50天习惯养成挑战平台**
  
  *让每一天的坚持都成为改变的力量*

  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
  [![Material-UI](https://img.shields.io/badge/Material--UI-5.15.10-blue.svg)](https://mui.com/)
  [![Express](https://img.shields.io/badge/Express-4.18.2-green.svg)](https://expressjs.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 📖 项目简介

Project-50 是一个基于科学习惯养成理论的50天打卡挑战应用。通过设定7个个人目标，每天坚持打卡，配合AI数据分析和可视化功能，帮助用户建立持久的好习惯。

### ✨ 核心特色

- 🎯 **50天挑战机制** - 基于习惯形成科学理论设计
- 📊 **AI智能分析** - 集成DeepSeek AI提供个性化洞察
- 📈 **数据可视化** - 年度热力图、关联性分析、习惯形成曲线
- 🎨 **优雅设计** - Material Design风格，深蓝灰主色调
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🔄 **实时同步** - 数据实时更新，支持多设备使用

## 🚀 快速开始

### 环境要求

- Node.js 16.0+
- npm 8.0+

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/project-50.git
cd project-50
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 创建 .env 文件
cp .env.example .env

# 编辑 .env 文件，添加AI服务配置（可选）
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

4. **启动应用**
```bash
# 同时启动前端和后端
npm run dev

# 或分别启动
npm run server  # 启动后端服务器 (端口3001)
npm start       # 启动前端应用 (端口3000)
```

5. **访问应用**
   - 前端：http://localhost:3000
   - 后端API：http://localhost:3001

## 📱 功能介绍

### 🔐 用户系统

**注册登录**
- 创建个人账户
- 设定7个挑战目标
- 安全的用户认证

**目标管理**
- 自定义7个个人目标
- 支持目标修改和重新开始
- 灵活的挑战周期管理

### ✅ 打卡系统

**每日打卡**
- 简洁的打卡界面
- 一键完成目标标记
- 实时进度反馈

**进度跟踪**
- 当前挑战天数显示
- 完成率统计
- 连续打卡记录

### 📊 AI数据分析

**智能洞察**
- AI分析个人打卡模式
- 个性化建议和鼓励
- 预测成功率评估

**数据统计**
- 总体完成率分析
- 一周模式识别
- 目标表现排名

### 📈 数据可视化

**年度热力图**
- GitHub风格的365天活跃度展示
- 直观显示打卡密度和规律
- 活跃天数和平均完成率统计

**目标关联性分析**
- 相关性矩阵显示目标间关联
- 散点图展示目标表现分布
- 智能识别协同效应

**习惯形成曲线**
- 基于66天习惯形成理论
- 三阶段跟踪：形成期→发展期→稳定期
- 自动化程度和习惯强度评估

### 📅 待办管理

**日程规划**
- 每日待办事项管理
- 日历视图展示
- 任务完成状态跟踪

**智能提醒**
- 自动生成每日任务
- 优先级管理
- 完成情况统计

## 🎯 使用指南

### 新用户入门

1. **注册账户**
   - 点击"注册"按钮
   - 输入用户名和密码
   - 设定7个挑战目标

2. **开始挑战**
   - 每天访问应用
   - 完成目标后点击打卡
   - 查看当日完成情况

3. **查看分析**
   - 点击底部"AI分析"标签
   - 浏览个人数据洞察
   - 查看可视化图表

### 高级功能

**数据可视化**
- 切换不同分析视图
- 交互式图表操作
- 详细数据提示

**目标优化**
- 根据AI建议调整目标
- 关注相关性分析结果
- 优化目标组合策略

**习惯跟踪**
- 监控习惯形成进度
- 识别当前发展阶段
- 预测习惯建立时间

## 🛠️ 技术架构

### 前端技术栈

- **React 18.3.1** - 现代化UI框架
- **TypeScript** - 类型安全开发
- **Material-UI** - Google Material Design组件库
- **Recharts** - 数据可视化图表库
- **Framer Motion** - 流畅动画效果
- **React Router** - 单页应用路由

### 后端技术栈

- **Express.js** - Node.js Web框架
- **TypeScript** - 服务端类型安全
- **JSON文件存储** - 轻量级数据持久化
- **CORS** - 跨域资源共享
- **DeepSeek AI** - 智能数据分析

### 项目结构

```
project-50/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   │   ├── charts/        # 数据可视化组件
│   │   └── ...
│   ├── pages/             # 页面组件
│   ├── utils/             # 工具函数
│   └── App.tsx            # 主应用组件
├── server/                # 后端源码
│   ├── index.ts           # 服务器入口
│   ├── types.ts           # 类型定义
│   └── aiService.ts       # AI服务
├── public/                # 静态资源
├── data/                  # 数据存储
└── docs/                  # 文档
```

## 📊 API接口

### 用户管理
- `POST /api/users` - 创建用户
- `POST /api/auth` - 用户认证
- `GET /api/users/:username` - 获取用户信息
- `PUT /api/users/:username` - 更新用户数据

### 数据分析
- `GET /api/users/:username/analysis` - AI数据分析
- `GET /api/users/:username/stats` - 基础统计
- `GET /api/users/:username/punch-history` - 打卡历史
- `GET /api/users/:username/goal-performance` - 目标表现

### 挑战管理
- `POST /api/users/:username/continue-cycle` - 继续挑战
- `POST /api/users/:username/new-cycle` - 新挑战周期

## 🎨 设计理念

### 视觉设计

**色彩方案**
- 主色调：深蓝灰 (#2c3e50)
- 强调色：优雅紫 (#8e44ad)
- 渐变色：蓝紫渐变 (#667eea → #764ba2)

**设计原则**
- 简洁优雅的界面设计
- 一致的视觉语言
- 直观的交互体验
- 响应式布局适配

### 用户体验

**交互设计**
- 流畅的页面切换动画
- 即时的操作反馈
- 清晰的信息层级
- 便捷的导航结构

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 运行测试
npm test

# 代码检查
npm run lint
```

### 构建部署

```bash
# 构建前端
npm run build

# 构建后端
npm run build:server

# 构建全部
npm run build:all
```

### 环境配置

**开发环境**
```bash
NODE_ENV=development
PORT=3000
API_PORT=3001
```

**生产环境**
```bash
NODE_ENV=production
DEEPSEEK_API_KEY=your_production_key
```

## 📈 数据分析功能

### AI智能分析

**分析维度**
- 完成率趋势分析
- 一周行为模式识别
- 目标难易度评估
- 个性化建议生成

**洞察类型**
- 成功洞察：表现优秀的方面
- 警告提醒：需要关注的问题
- 改进建议：具体可行的建议
- 鼓励信息：正向激励内容

### 可视化图表

**热力图分析**
- 365天打卡活跃度
- 颜色深度表示完成率
- 统计概览和趋势分析

**关联性分析**
- 目标间相关性矩阵
- 正相关/负相关识别
- 协同效应发现

**习惯形成**
- 66天科学理论应用
- 三阶段进度跟踪
- 自动化程度量化

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 代码规范

- 使用TypeScript进行开发
- 遵循ESLint配置规则
- 编写单元测试
- 更新相关文档

### 问题反馈

- 使用GitHub Issues报告bug
- 提供详细的复现步骤
- 包含环境信息和错误日志

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- [React](https://reactjs.org/) - 强大的前端框架
- [Material-UI](https://mui.com/) - 优秀的组件库
- [DeepSeek](https://www.deepseek.com/) - AI分析服务
- [Recharts](https://recharts.org/) - 数据可视化库

## 📞 联系我们

- 项目主页：[GitHub Repository](https://github.com/your-username/project-50)
- 问题反馈：[Issues](https://github.com/your-username/project-50/issues)
- 邮箱：lihaolin1232020@163.com

---

<div align="center">
  <p><strong>🎯 Project-50 - 让习惯成就更好的自己</strong></p>
  <p><em>每一天的坚持，都是通向成功的阶梯</em></p>
</div> 