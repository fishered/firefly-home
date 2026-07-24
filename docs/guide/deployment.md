---
title: 部署说明
description: 本地、容器和集群部署的推荐路径。
---

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
