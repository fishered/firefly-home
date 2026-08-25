---
title: Release Note
description: Firefly 各版本的发布日期、处理范围和升级入口。
---

# Release Note

这里按版本汇总 Firefly 已发布变更。每个版本只记录该次发布实际处理的范围，安装和环境配置统一放在部署说明中。

| 版本 | 发布日期 | 处理范围 |
|---|---|---|
| [v1.0.8](./v1.0.8.md) | 2026-08-25 | 发布一致性与验证闭环：Docker/Compose 版本统一、兼容矩阵 CI、Trace 版本标识和 carrier 边界 |
| [v1.0.6](./v1.0.6.md) | 2026-08-09 | 运行时稳定性与资源边界：调度索引异常恢复、本地 Worker 背压、原子 `FORBID`、批量续租、revision 降频和有界 HTTP 线程池 |
| [v1.0.5](./v1.0.5.md) | 未单独发布 | 非 Spring Java 集成候选；相关能力已随 v1.0.6 正式交付 |
| [v1.0.4](./v1.0.4.md) | 2026-08-04 | 调度可靠性验证：PostgreSQL 同时到期任务压测、Scheduler/Outbox 并发竞争校验、资源观测和可重复执行的压力测试入口 |
| [v1.0.3](./v1.0.3.md) | 2026-08-02 | 生命周期与输入边界：Execution/Outbox 事务入口、关键 Admin 写请求类型化、后台限时等待关闭、typed Netty frame、版本化快照 envelope |
| [v1.0.2](./v1.0.2.md) | 2026-07-31 | 架构与恢复边界：声明式 Admin RBAC、Netty wire model 与背压、插件 API level、JDBC fencing、真实数据库故障验证和受控分片扩容 |
| [v1.0.1](./v1.0.1.md) | 2026-07-29 | 生产可用性加固：默认安全配置、数据库迁移、执行器资源边界、派发超时、Starter 健康检查与构建可靠性 |

部署新环境或获取数据库初始化脚本，请查看[部署说明](../guide/deployment.md)。
