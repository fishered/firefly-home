---
title: 部署说明
description: 本地、容器和集群部署的推荐路径。
---

<script setup>
import { withBase } from 'vitepress';
</script>

# 部署说明

Firefly 推荐按环境逐步推进：本地 memory/H2 验证，单机 PostgreSQL 运行，最后再拆分 api、gateway、scheduler 角色。

## 本地开发

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=h2"
```

常用地址：

| 服务 | 默认地址 |
|---|---|
| Admin UI | `http://127.0.0.1:9720` |
| Admin HTTP API | `http://127.0.0.1:9710` |
| Prometheus Metrics | `http://127.0.0.1:9711/metrics` |
| Netty Gateway | `127.0.0.1:9700` |

## Docker Compose

仓库根目录提供 `docker-compose.yml`，可启动 PostgreSQL、Firefly Server 和 Admin UI：

```powershell
docker compose up -d --build
```

## 节点角色

`standalone` 可以在一个进程中启用全部角色：

```properties
firefly.node.roles=api,gateway,scheduler
```

集群部署时可以拆分：

```properties
firefly.node.roles=api
firefly.node.roles=gateway
firefly.node.roles=scheduler
```

## 存储选择

| Profile | 用途 |
|---|---|
| `memory` | 快速实验和单元验证 |
| `h2` | 本地文件持久化 |
| `pg` | 默认本地 PostgreSQL |

生产环境建议使用 PostgreSQL 或 MySQL，并将 `firefly.jdbc.schema.mode` 设置为符合团队迁移策略的模式。

## PostgreSQL 数据库初始化

使用 `initialize-if-empty` 时，Firefly 会在首次启动时自动初始化空数据库，不需要手工下载或执行 SQL：

```properties
firefly.jdbc.schema.mode=initialize-if-empty
```

生产环境由 DBA 或外部迁移系统管理 schema 时，可下载与当前版本对应的最小初始化脚本：

<a :href="withBase('/downloads/firefly-postgresql-init-v1.0.1.sql')" download="firefly-postgresql-init-v1.0.1.sql">下载 PostgreSQL 最小初始化脚本（v1.0.1）</a>

SHA-256：

```text
d6cc52ad804245b202b1da127730448211c22513c524be4d46f2744667bd7d24
```

该脚本只创建 Firefly 管理的表、索引、schema 元数据和初始管理员，不负责创建数据库、角色或授权。请先由部署人员准备数据库和账号，再执行：

```powershell
psql -h 127.0.0.1 -U firefly -d firefly -f .\firefly-postgresql-init-v1.0.1.sql
```

执行后将 `firefly.jdbc.schema.mode` 设置为 `validate`。默认管理员为 `admin/admin`，首次登录必须修改密码。
