# 技术架构设计文档

**项目名称**: 论坛网站（话题圈）
**版本**: v1.0
**文档日期**: 2026-03-08
**作者**: fullstack-developer
**项目ID**: project-20260308-031120

---

## 一、技术选型

### 1.1 整体技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                        前端技术栈                             │
│  Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus │
├─────────────────────────────────────────────────────────────┤
│                        后端技术栈                             │
│  Node.js + NestJS + TypeScript + TypeORM + class-validator  │
├─────────────────────────────────────────────────────────────┤
│                        数据存储                               │
│  PostgreSQL (主数据库) + Redis (缓存/会话) + MinIO (文件存储) │
├─────────────────────────────────────────────────────────────┤
│                        基础设施                               │
│  Docker + Docker Compose + Nginx + GitHub Actions           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 前端技术选型

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| **Vue 3** | 3.4+ | Composition API 提供更好的代码组织，响应式性能优秀，生态成熟 |
| **TypeScript** | 5.0+ | 类型安全，IDE 支持完善，与后端共享类型定义 |
| **Vite** | 5.0+ | 极速开发体验，HMR 性能优异，原生 ESM 支持 |
| **Pinia** | 2.1+ | Vue 3 官方推荐状态管理，API 简洁，TypeScript 支持完善 |
| **Vue Router** | 4.2+ | 官方路由方案，支持路由懒加载和导航守卫 |
| **Element Plus** | 2.5+ | 成熟的 UI 组件库，中文文档完善，社区活跃 |
| **VueUse** | 10.0+ | 实用的 Composition API 工具集 |
| **Axios** | 1.6+ | HTTP 客户端，拦截器支持完善 |
| **Markdown-it** | 14.0+ | Markdown 解析渲染，插件生态丰富 |

### 1.3 后端技术选型

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| **Node.js** | 20 LTS | 高性能异步 I/O，JavaScript 全栈，适合 I/O 密集型应用 |
| **NestJS** | 10.0+ | 企业级框架，模块化架构，TypeScript 原生支持，依赖注入 |
| **TypeORM** | 0.3+ | 成熟的 ORM，支持迁移，实体关系映射完善 |
| **class-validator** | 0.14+ | 数据验证，装饰器风格，与 NestJS 集成良好 |
| **Passport** | 0.7+ | 认证中间件，支持多种策略（JWT、OAuth） |
| **JWT** | - | 无状态认证，适合前后端分离架构 |
| **Bull** | 4.12+ | Redis 队列，处理异步任务（邮件发送、内容审核） |
| **Winston** | 3.11+ | 日志管理，支持多种传输方式 |

### 1.4 数据存储选型

| 技术 | 用途 | 选型理由 |
|-----|------|---------|
| **PostgreSQL** | 主数据库 | 开源免费，ACID 支持完善，全文搜索支持，JSON 类型支持 |
| **Redis** | 缓存/会话 | 高性能内存数据库，支持会话存储、缓存、排行榜、消息队列 |
| **MinIO** | 文件存储 | S3 兼容的开源对象存储，可自建，支持分布式部署 |

### 1.5 基础设施选型

| 技术 | 用途 | 选型理由 |
|-----|------|---------|
| **Docker** | 容器化 | 标准化部署环境，便于开发、测试、生产环境一致性 |
| **Docker Compose** | 编排 | 单机部署简便，适合 MVP 阶段 |
| **Nginx** | 反向代理 | 高性能，静态资源服务，SSL 终止，负载均衡 |
| **GitHub Actions** | CI/CD | 与 GitHub 深度集成，配置简单，免费额度充足 |

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              用户层                                       │
│         Web Browser (PC)        │        Web Browser (Mobile)           │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             接入层                                        │
│                     Nginx (反向代理 + SSL + 静态资源)                      │
│                           ↓ HTTPS ↓                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   前端应用 (Vue 3)   │    │   后端 API (NestJS)  │    │    管理后台 (Vue 3)  │
│   - SPA 应用        │    │   - RESTful API     │    │    - 管理界面        │
│   - 移动端适配      │    │   - 认证授权        │    │    - 数据统计        │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             服务层                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ 用户模块     │  │ 话题模块    │  │ 资源模块    │  │ 搜索模块    │     │
│  │ - 认证授权  │  │ - 发帖回复  │  │ - 资源管理  │  │ - 全文搜索  │     │
│  │ - 用户管理  │  │ - 点赞收藏  │  │ - 下载统计  │  │ - 热门排行  │     │
│  │ - 积分系统  │  │ - 板块标签  │  │ - 评价系统  │  │ - 推荐算法  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │ 通知模块    │  │ 文件模块    │  │ 管理模块    │                      │
│  │ - 系统通知  │  │ - 文件上传  │  │ - 内容审核  │                      │
│  │ - 消息推送  │  │ - 图片处理  │  │ - 用户管理  │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             数据层                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  │
│  │ PostgreSQL (主库)   │  │ Redis (缓存/队列)   │  │ MinIO (文件)    │  │
│  │ - 用户数据         │  │ - Session          │  │ - 用户头像      │  │
│  │ - 话题数据         │  │ - 缓存数据         │  │ - 话题图片      │  │
│  │ - 资源数据         │  │ - 排行榜           │  │ - 资源封面      │  │
│  │ - 互动数据         │  │ - 消息队列         │  │ - 附件文件      │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 模块划分与职责

#### 2.2.1 前端模块

```
frontend/
├── src/
│   ├── modules/                    # 业务模块
│   │   ├── auth/                   # 认证模块
│   │   │   ├── views/              # 登录、注册页面
│   │   │   ├── stores/             # 认证状态管理
│   │   │   └── composables/        # 认证相关组合式函数
│   │   ├── user/                   # 用户模块
│   │   │   ├── views/              # 个人中心、用户主页
│   │   │   └── components/         # 用户卡片、关注按钮
│   │   ├── topic/                  # 话题模块
│   │   │   ├── views/              # 首页、话题详情、发帖页
│   │   │   └── components/         # 话题卡片、回复组件
│   │   ├── resource/               # 资源模块
│   │   │   ├── views/              # 资源列表、资源详情、发布页
│   │   │   └── components/         # 资源卡片、评价组件
│   │   ├── search/                 # 搜索模块
│   │   └── admin/                  # 管理后台
│   ├── shared/                     # 共享模块
│   │   ├── components/             # 公共组件
│   │   ├── composables/            # 公共组合式函数
│   │   ├── utils/                  # 工具函数
│   │   └── api/                    # API 请求封装
│   └── core/                       # 核心配置
│       ├── router/                 # 路由配置
│       ├── stores/                 # 全局状态
│       └── plugins/                # 插件配置
```

#### 2.2.2 后端模块

```
backend/
├── src/
│   ├── modules/                    # 业务模块
│   │   ├── auth/                   # 认证模块
│   │   │   ├── auth.controller.ts  # 认证接口
│   │   │   ├── auth.service.ts     # 认证逻辑
│   │   │   ├── auth.module.ts      # 模块定义
│   │   │   ├── strategies/         # Passport 策略
│   │   │   └── dto/                # 数据传输对象
│   │   ├── user/                   # 用户模块
│   │   ├── topic/                  # 话题模块
│   │   ├── resource/               # 资源模块
│   │   ├── search/                 # 搜索模块
│   │   ├── notification/           # 通知模块
│   │   ├── file/                   # 文件模块
│   │   └── admin/                  # 管理模块
│   ├── common/                     # 公共模块
│   │   ├── decorators/             # 自定义装饰器
│   │   ├── filters/                # 异常过滤器
│   │   ├── guards/                 # 守卫
│   │   ├── interceptors/           # 拦截器
│   │   ├── pipes/                  # 管道
│   │   └── utils/                  # 工具函数
│   ├── config/                     # 配置模块
│   ├── entities/                   # 数据库实体
│   └── migrations/                 # 数据库迁移
```

### 2.3 API 设计规范

#### 2.3.1 RESTful API 规范

**基础 URL**: `/api/v1`

**资源命名**:
- 使用复数名词: `/users`, `/topics`, `/resources`
- 使用连字符: `/user-profiles`
- 嵌套资源: `/topics/:id/replies`

**HTTP 方法语义**:

| 方法 | 用途 | 示例 |
|-----|------|------|
| GET | 获取资源 | `GET /topics` 获取话题列表 |
| POST | 创建资源 | `POST /topics` 创建话题 |
| PUT | 完整更新 | `PUT /topics/:id` 更新话题 |
| PATCH | 部分更新 | `PATCH /topics/:id` 部分更新 |
| DELETE | 删除资源 | `DELETE /topics/:id` 删除话题 |

**响应格式**:

```json
// 成功响应
{
  "code": 0,
  "message": "success",
  "data": { ... }
}

// 分页响应
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}

// 错误响应
{
  "code": 10001,
  "message": "用户名已存在",
  "errors": [
    { "field": "username", "message": "用户名已存在" }
  ]
}
```

**状态码规范**:

| 状态码 | 含义 | 使用场景 |
|-------|------|---------|
| 200 | 成功 | GET/PUT/PATCH/DELETE 成功 |
| 201 | 创建成功 | POST 创建成功 |
| 204 | 无内容 | DELETE 成功 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未认证 | 未登录或 Token 过期 |
| 403 | 禁止访问 | 无权限 |
| 404 | 未找到 | 资源不存在 |
| 409 | 冲突 | 资源冲突（如重复） |
| 422 | 无法处理 | 业务逻辑错误 |
| 500 | 服务器错误 | 内部错误 |

#### 2.3.2 核心 API 列表

**认证模块**:

| 方法 | 路径 | 描述 | 认证 |
|-----|------|------|------|
| POST | /auth/register | 用户注册 | 否 |
| POST | /auth/login | 用户登录 | 否 |
| POST | /auth/logout | 用户登出 | 是 |
| POST | /auth/refresh | 刷新 Token | 是 |
| POST | /auth/forgot-password | 忘记密码 | 否 |
| POST | /auth/reset-password | 重置密码 | 否 |

**用户模块**:

| 方法 | 路径 | 描述 | 认证 |
|-----|------|------|------|
| GET | /users/me | 获取当前用户 | 是 |
| PATCH | /users/me | 更新当前用户 | 是 |
| GET | /users/:id | 获取用户信息 | 否 |
| GET | /users/:id/topics | 获取用户话题 | 否 |
| GET | /users/:id/resources | 获取用户资源 | 否 |
| POST | /users/:id/follow | 关注用户 | 是 |
| DELETE | /users/:id/follow | 取消关注 | 是 |

**话题模块**:

| 方法 | 路径 | 描述 | 认证 |
|-----|------|------|------|
| GET | /topics | 获取话题列表 | 否 |
| GET | /topics/:id | 获取话题详情 | 否 |
| POST | /topics | 创建话题 | 是 |
| PUT | /topics/:id | 更新话题 | 是 |
| DELETE | /topics/:id | 删除话题 | 是 |
| POST | /topics/:id/like | 点赞 | 是 |
| DELETE | /topics/:id/like | 取消点赞 | 是 |
| POST | /topics/:id/favorite | 收藏 | 是 |
| DELETE | /topics/:id/favorite | 取消收藏 | 是 |
| GET | /topics/:id/replies | 获取回复列表 | 否 |
| POST | /topics/:id/replies | 创建回复 | 是 |

**资源模块**:

| 方法 | 路径 | 描述 | 认证 |
|-----|------|------|------|
| GET | /resources | 获取资源列表 | 否 |
| GET | /resources/:id | 获取资源详情 | 否 |
| POST | /resources | 创建资源 | 是 |
| PUT | /resources/:id | 更新资源 | 是 |
| DELETE | /resources/:id | 删除资源 | 是 |
| POST | /resources/:id/download | 获取下载链接 | 是 |
| GET | /resources/:id/reviews | 获取评价列表 | 否 |
| POST | /resources/:id/reviews | 创建评价 | 是 |

### 2.4 认证授权方案

#### 2.4.1 JWT 认证流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                    │                    │
       │  POST /auth/login  │                    │
       │  {username, pwd}   │                    │
       │ ──────────────────>│                    │
       │                    │  验证用户          │
       │                    │ ──────────────────>│
       │                    │<────────────────── │
       │                    │  生成 JWT          │
       │<────────────────── │  {access, refresh} │
       │                    │                    │
       │  GET /api/v1/users │                    │
       │  Authorization:    │                    │
       │  Bearer <token>    │                    │
       │ ──────────────────>│                    │
       │                    │  验证 JWT          │
       │<────────────────── │  返回数据          │
       │                    │                    │
```

#### 2.4.2 Token 设计

**Access Token**:
- 有效期: 2 小时
- 存储: 内存（不存 localStorage，防 XSS）
- 用途: API 请求认证

**Refresh Token**:
- 有效期: 7 天
- 存储: HttpOnly Cookie
- 用途: 刷新 Access Token

**Token 载荷**:

```json
{
  "sub": "user-uuid",
  "username": "johndoe",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234574890
}
```

#### 2.4.3 权限设计

**角色定义**:

| 角色 | 权限 |
|-----|------|
| guest | 浏览公开内容 |
| user | 发布话题、回复、资源（等级2+） |
| moderator | 板块管理、内容审核 |
| admin | 全站管理、用户管理、系统配置 |

**权限检查**:
- 使用 NestJS Guard 进行权限检查
- 基于角色的访问控制 (RBAC)
- 资源归属检查（用户只能修改自己的内容）

---

## 三、数据库设计

### 3.1 ER 图

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │    boards       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ username        │       │ name            │
│ email           │       │ description     │
│ password_hash   │       │ icon            │
│ nickname        │       │ sort_order      │
│ avatar         │       │ is_active       │
│ bio            │       │ created_at      │
│ level          │       └────────┬────────┘
│ points         │                │
│ status         │                │ 1:N
│ created_at     │                │
│ updated_at     │                ▼
└────────┬────────┘       ┌─────────────────┐
         │                │     topics      │
         │ 1:N            ├─────────────────┤
         │                │ id (PK)         │
         ▼                │ board_id (FK)   │
┌─────────────────┐       │ author_id (FK)  │◄──────┐
│    topics       │──────>│ title           │       │
├─────────────────┤       │ content         │       │
│ (详见下文)       │       │ view_count      │       │
└─────────────────┘       │ like_count      │       │
                          │ reply_count      │       │
         ┌────────────────│ is_pinned       │       │
         │                │ is_essence      │       │
         │ 1:N            │ status          │       │
         │                │ created_at      │       │
         ▼                │ updated_at      │       │
┌─────────────────┐       └────────┬────────┘       │
│    replies      │                │                │
├─────────────────┤                │ 1:N            │
│ id (PK)         │                │                │
│ topic_id (FK)   │◄───────────────┘                │
│ author_id (FK)  │─────────────────────────────────┘
│ parent_id (FK)  │  (自关联: 楼中楼)
│ content         │
│ floor           │
│ like_count      │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   resources     │       │   categories    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ author_id (FK)  │──┐    │ name            │
│ category_id(FK) │◄─┼────│ parent_id (FK)  │
│ title           │  │    │ sort_order      │
│ description     │  │    │ created_at      │
│ cover          │  │    └─────────────────┘
│ link           │  │
│ extract_code   │  │    ┌─────────────────┐
│ points_required│  │    │   favorites     │
│ download_count │  │    ├─────────────────┤
│ rating_avg     │  │    │ id (PK)         │
│ status         │  │    │ user_id (FK)    │
│ created_at     │  │    │ topic_id (FK)   │
│ updated_at     │  │    │ resource_id(FK) │
└─────────────────┘  │    │ created_at      │
                     │    └─────────────────┘
         ┌───────────┘
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐
│ resource_reviews│       │     tags        │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ resource_id(FK) │       │ name            │
│ user_id (FK)    │       │ usage_count     │
│ rating         │       │ created_at      │
│ content        │       └────────┬────────┘
│ is_valid       │                │
│ created_at     │                │ M:N
└─────────────────┘                │
                                   ▼
┌─────────────────┐       ┌─────────────────┐
│   follows       │       │  topic_tags     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ topic_id (FK)   │
│ follower_id(FK) │       │ tag_id (FK)     │
│ following_id(FK)│       └─────────────────┘
│ created_at     │
└─────────────────┘       ┌─────────────────┐
                          │ resource_tags   │
┌─────────────────┐       ├─────────────────┤
│   likes         │       │ resource_id(FK) │
├─────────────────┤       │ tag_id (FK)     │
│ id (PK)         │       └─────────────────┘
│ user_id (FK)    │
│ target_type     │
│ target_id      │
│ created_at     │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ notifications   │       │ point_logs      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ type           │       │ type            │
│ title          │       │ points          │
│ content        │       │ description     │
│ is_read        │       │ related_type    │
│ related_type   │       │ related_id      │
│ related_id     │       │ created_at      │
│ created_at     │       └─────────────────┘
└─────────────────┘
```

### 3.2 表结构设计

#### 3.2.1 用户表 (users)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    bio TEXT,
    level INTEGER DEFAULT 1,
    points INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, banned, deleted
    role VARCHAR(20) DEFAULT 'user', -- user, moderator, admin
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 3.2.2 板块表 (boards)

```sql
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_boards_slug ON boards(slug);
CREATE INDEX idx_boards_is_active ON boards(is_active);
```

#### 3.2.3 话题表 (topics)

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_essence BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published', -- draft, published, hidden, deleted
    last_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 全文搜索索引
CREATE INDEX idx_topics_content ON topics USING gin(to_tsvector('simple', title || ' ' || content));
CREATE INDEX idx_topics_board_id ON topics(board_id);
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX idx_topics_last_reply_at ON topics(last_reply_at DESC);
CREATE INDEX idx_topics_hot ON topics(like_count + reply_count * 2 + view_count / 10 DESC);
```

#### 3.2.4 回复表 (replies)

```sql
CREATE TABLE replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES replies(id) ON DELETE CASCADE, -- 楼中楼
    content TEXT NOT NULL,
    floor INTEGER NOT NULL, -- 楼层号
    like_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_replies_parent_id ON replies(parent_id);
```

#### 3.2.5 资源表 (resources)

```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover VARCHAR(500),
    link TEXT NOT NULL,
    extract_code VARCHAR(50),
    points_required INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published', -- draft, published, hidden, deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 全文搜索
CREATE INDEX idx_resources_content ON resources USING gin(to_tsvector('simple', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_resources_author_id ON resources(author_id);
CREATE INDEX idx_resources_category_id ON resources(category_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
```

#### 3.2.6 资源分类表 (resource_categories)

```sql
CREATE TABLE resource_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
    icon VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_resource_categories_parent_id ON resource_categories(parent_id);
CREATE INDEX idx_resource_categories_slug ON resource_categories(slug);
```

#### 3.2.7 标签表 (tags)

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);
```

#### 3.2.8 话题标签关联表 (topic_tags)

```sql
CREATE TABLE topic_tags (
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);
```

#### 3.2.9 点赞表 (likes)

```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- topic, reply, resource
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
```

#### 3.2.10 收藏表 (favorites)

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL, -- topic, resource
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_type, target_id);
```

#### 3.2.11 关注表 (follows)

```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

#### 3.2.12 资源评价表 (resource_reviews)

```sql
CREATE TABLE resource_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    is_valid BOOLEAN, -- 资源有效性反馈: true=有效, false=失效, null=未标记
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_id, user_id) -- 每个用户只能评价一次
);

CREATE INDEX idx_resource_reviews_resource_id ON resource_reviews(resource_id);
CREATE INDEX idx_resource_reviews_user_id ON resource_reviews(user_id);
```

#### 3.2.13 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- reply, like, follow, system, etc.
    title VARCHAR(200),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    related_type VARCHAR(50), -- topic, reply, user, etc.
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 3.2.14 积分日志表 (point_logs)

```sql
CREATE TABLE point_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- register, login, post_topic, post_reply, etc.
    points INTEGER NOT NULL, -- 正数为获得，负数为扣除
    description VARCHAR(255),
    related_type VARCHAR(50),
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_point_logs_user_id ON point_logs(user_id);
CREATE INDEX idx_point_logs_created_at ON point_logs(created_at DESC);
```

### 3.3 索引策略

| 表 | 索引类型 | 字段 | 用途 |
|---|---------|------|------|
| users | B-Tree | username, email | 登录查询 |
| topics | GIN | to_tsvector(title, content) | 全文搜索 |
| topics | B-Tree | created_at DESC | 时间排序 |
| topics | B-Tree | last_reply_at DESC | 最新回复排序 |
| topics | B-Tree | like_count + reply_count * 2 | 热门排序 |
| replies | B-Tree | topic_id, floor | 话题回复查询 |
| resources | GIN | to_tsvector(title, description) | 全文搜索 |
| likes | B-Tree | (target_type, target_id) | 点赞查询 |

---

## 四、开发规范

### 4.1 项目目录结构

```
forum-project/
├── frontend/                    # 前端项目
│   ├── public/                  # 静态资源
│   ├── src/
│   │   ├── assets/              # 资源文件
│   │   ├── components/          # 公共组件
│   │   ├── composables/         # 组合式函数
│   │   ├── layouts/             # 布局组件
│   │   ├── modules/             # 业务模块
│   │   ├── router/              # 路由配置
│   │   ├── stores/              # 状态管理
│   │   ├── styles/              # 样式文件
│   │   ├── types/               # 类型定义
│   │   ├── utils/               # 工具函数
│   │   ├── api/                 # API 封装
│   │   ├── App.vue
│   │   └── main.ts
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── common/              # 公共模块
│   │   ├── config/              # 配置模块
│   │   ├── entities/            # 数据库实体
│   │   ├── migrations/          # 数据库迁移
│   │   ├── modules/             # 业务模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                    # 测试文件
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── docker/                      # Docker 配置
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx/
│       └── nginx.conf
│
├── docker-compose.yml           # 开发环境编排
├── docker-compose.prod.yml      # 生产环境编排
├── .gitignore
├── LICENSE
└── README.md
```

### 4.2 代码规范

#### 4.2.1 TypeScript 规范

```typescript
// 文件命名：kebab-case
// user.service.ts

// 类命名：PascalCase
export class UserService {}

// 接口命名：PascalCase，以 I 开头（可选）
export interface IUserProfile {}

// 函数/变量命名：camelCase
export function getUserById(id: string) {}
const userCount = 10;

// 常量命名：UPPER_SNAKE_CASE
export const MAX_PAGE_SIZE = 100;

// 枚举命名：PascalCase
export enum UserStatus {
  Active = 'active',
  Banned = 'banned',
}

// 类型别名：PascalCase
export type UserRole = 'user' | 'moderator' | 'admin';
```

#### 4.2.2 Vue 组件规范

```vue
<!-- 组件命名：PascalCase -->
<!-- UserProfileCard.vue -->

<template>
  <div class="user-profile-card">
    <!-- 使用 kebab-case 在模板中 -->
    <user-avatar :src="user.avatar" />
  </div>
</template>

<script setup lang="ts">
// 使用 <script setup> 语法
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types';

// Props 定义
const props = defineProps<{
  user: User;
}>();

// Emits 定义
const emit = defineEmits<{
  (e: 'follow', userId: string): void;
}>();

// 响应式状态
const isFollowing = ref(false);

// 计算属性
const displayName = computed(() => props.user.nickname || props.user.username);

// 方法
function handleFollow() {
  emit('follow', props.user.id);
  isFollowing.value = !isFollowing.value;
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
});
</script>

<style scoped>
.user-profile-card {
  /* 使用 scoped 样式 */
}
</style>
```

#### 4.2.3 NestJS 模块规范

```typescript
// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

// user.controller.ts
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, type: UserDto })
  async getCurrentUser(@CurrentUser() user: User): Promise<UserDto> {
    return this.userService.findById(user.id);
  }
}

// user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}

// DTO
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
```

### 4.3 Git 工作流

#### 4.3.1 分支策略

```
main            # 生产分支，只接受合并请求
  └── develop   # 开发分支，日常开发基于此分支
       ├── feature/T3-architecture    # 功能分支
       ├── feature/T5-backend-api     # 功能分支
       ├── feature/T6-frontend-pages  # 功能分支
       └── bugfix/xxx                 # Bug 修复分支
```

#### 4.3.2 提交信息规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具相关

**示例**:
```
feat(user): 添加用户注册功能

- 实现邮箱验证注册
- 添加密码强度校验
- 集成 JWT 认证

Closes #12
```

#### 4.3.3 工作流程

```bash
# 1. 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/T5-backend-api

# 2. 开发并提交
git add .
git commit -m "feat(api): 添加用户模块 API"

# 3. 推送并创建 PR
git push origin feature/T5-backend-api
# 在 GitHub 上创建 Pull Request

# 4. 代码审查通过后合并
# 由管理员合并到 develop

# 5. 发布时合并到 main
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

---

## 五、部署方案

### 5.1 开发环境

使用 Docker Compose 一键启动：

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: forum
      POSTGRES_USER: forum
      POSTGRES_PASSWORD: forum_dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend.Dockerfile
    environment:
      DATABASE_URL: postgresql://forum:forum_dev_password@postgres:5432/forum
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio:9000
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
      - minio

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend.Dockerfile
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### 5.2 生产环境

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
      - frontend_dist:/usr/share/nginx/html:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: always

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    restart: always

  backend:
    image: ${REGISTRY}/forum-backend:${VERSION}
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      MINIO_ENDPOINT: minio:9000
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ${REGISTRY}/forum-frontend:${VERSION}
    volumes:
      - frontend_dist:/app/dist
    command: ["sh", "-c", "cp -r /app/dist/* /dist/"]
    volumes:
      - frontend_dist:/dist

volumes:
  postgres_data:
  redis_data:
  minio_data:
  frontend_dist:
```

### 5.3 CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            frontend/package-lock.json
            backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
      
      - name: Build
        run: |
          cd frontend && npm run build
          cd ../backend && npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and push Docker images
        run: |
          docker build -t ${{ secrets.REGISTRY }}/forum-backend:${{ github.sha }} -f docker/backend.Dockerfile ./backend
          docker build -t ${{ secrets.REGISTRY }}/forum-frontend:${{ github.sha }} -f docker/frontend.Dockerfile ./frontend
          docker push ${{ secrets.REGISTRY }}/forum-backend:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/forum-frontend:${{ github.sha }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/forum
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
```

---

## 六、技术风险与缓解措施

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| 大文件上传占用带宽 | 中 | 限制文件大小（5MB），使用 CDN，压缩图片 |
| 搜索性能瓶颈 | 中 | 使用 PostgreSQL 全文搜索，考虑引入 Elasticsearch |
| Redis 单点故障 | 高 | 生产环境使用 Redis Sentinel 或 Cluster |
| 数据库连接池耗尽 | 中 | 合理配置连接池，使用 Prisma 连接池 |
| XSS/CSRF 攻击 | 高 | 输入过滤、CSP 策略、CSRF Token |

---

## 七、附录

### 7.1 环境变量

**后端环境变量**:

```bash
# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/forum

# Redis
REDIS_URL=redis://localhost:6379

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=forum

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=2h
JWT_REFRESH_EXPIRES_IN=7d

# 应用
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# 邮件
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=your-smtp-password
```

### 7.2 技术栈版本汇总

| 组件 | 版本 |
|-----|------|
| Node.js | 20 LTS |
| Vue | 3.4+ |
| NestJS | 10.0+ |
| PostgreSQL | 16 |
| Redis | 7 |
| MinIO | Latest |
| Docker | 24+ |
| Docker Compose | 2.20+ |

---

**文档状态**: 完成
**下一步**: 创建 GitHub 仓库（T4）
