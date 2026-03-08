# 论坛网站 (话题圈)

一个话题交流与网盘资源分享融合的综合社区平台。

## 项目概述

本项目旨在打造一个让用户既能深度讨论感兴趣的话题，又能便捷分享和获取优质资源的一站式社区。

### 核心功能

- **话题讨论** - 板块分类、发帖回复、点赞收藏、标签系统
- **资源分享** - 网盘资源发布、分类管理、下载评价
- **用户系统** - 注册登录、个人中心、等级积分、关注粉丝
- **搜索推荐** - 全站搜索、热门排行
- **后台管理** - 内容审核、用户管理、数据统计

## 技术栈

### 前端

- Vue 3 + TypeScript
- Vite
- Pinia (状态管理)
- Vue Router
- Element Plus

### 后端

- Node.js 20 LTS
- NestJS
- TypeORM
- Passport (JWT 认证)

### 数据存储

- PostgreSQL 16 (主数据库)
- Redis 7 (缓存/会话)
- MinIO (文件存储)

### 基础设施

- Docker + Docker Compose
- Nginx
- GitHub Actions (CI/CD)

## 项目结构

```
forum-website/
├── frontend/           # 前端项目
├── backend/            # 后端项目
├── docs/               # 项目文档
│   ├── PRD.md          # 产品需求文档
│   └── architecture.md # 技术架构文档
├── docker/             # Docker 配置
├── README.md
└── .gitignore
```

## 快速开始

### 环境要求

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### 开发环境启动

```bash
# 克隆项目
git clone https://github.com/YOUR_ORG/forum-website.git
cd forum-website

# 启动开发环境
docker-compose up -d

# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 启动前端
cd frontend && npm run dev

# 启动后端
cd backend && npm run start:dev
```

## 文档

- [产品需求文档 (PRD)](./docs/PRD.md)
- [技术架构文档](./docs/architecture.md)

## 开发进度

### Phase 1: 调研与规划 ✅

- [x] T1: 竞品分析与市场调研
- [x] T2: 产品需求文档(PRD)
- [x] T3: 技术架构设计
- [x] T4: GitHub仓库创建

### Phase 2: 开发 🚧

- [ ] T5: 后端API开发
- [ ] T6: 前端页面开发
- [ ] T7: 数据库设计

### Phase 3: 测试与部署

- [ ] T8: 功能测试
- [ ] T9: 部署上线

## 贡献指南

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

[MIT License](./LICENSE)

## 团队

- **项目管理**: manager
- **市场调研**: market-research
- **产品经理**: product-manager
- **全栈开发**: fullstack-developer
