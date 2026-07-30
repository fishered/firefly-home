---
title: 数据库结构
description: Firefly JDBC schema 表职责。
---

# 数据库结构

当前 schema 版本为 `12`。PostgreSQL 全新安装的权威最小脚本位于：

```text
scripts/postgresql/init.sql
```

脚本下载、校验和执行方式见[部署说明](../guide/deployment.md#postgresql-数据库初始化)。

已有数据库通过方言对应的增量脚本从当前版本依次迁移。`v12.sql` 位于：

```text
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/h2/v12.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/postgresql/v12.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/mysql/v12.sql
```

## 表职责

| 表 | 职责 |
|---|---|
| `firefly_schema_version` | 记录已安装的 schema 版本 |
| `firefly_cluster_metadata` | 保存 scheduler shard 数等集群不变量 |
| `firefly_node` | Server 节点、角色、注册时间、心跳和在线状态 |
| `firefly_shard_lease` | Scheduler 分片所有权、租约和 fencing token |
| `firefly_executor` | 可持久化的逻辑执行器定义 |
| `firefly_job_group` | 任务组、默认执行器绑定、元数据和启停状态 |
| `firefly_job` | 任务定义、调度游标、分发策略和持久化 shard id |
| `firefly_execution` | 一次执行 attempt 的父记录和聚合状态 |
| `firefly_execution_target` | 单播、广播或分片产生的目标子执行 |
| `firefly_dispatch_outbox` | 可靠派发队列、角色路由、ACK 超时和重试状态 |
| `firefly_executor_instance_location` | Executor 实例所在 Gateway 和 session fencing |
| `firefly_audit_log` | Admin 变更审计 |
| `firefly_job_history` | 任务创建、启停和删除历史 |
| `firefly_user` | Admin 账号、PBKDF2 密码摘要、角色、首次改密状态和版本 |
| `firefly_integration_key` | Integration Key 的 PBKDF2 摘要和轮换版本 |

## 初始化模式

开发和本地部署可以使用：

```properties
firefly.jdbc.schema.mode=initialize-if-empty
```

生产环境由外部迁移系统管理时可以使用：

```properties
firefly.jdbc.schema.mode=validate
```

`initialize-if-empty` 会检查当前版本并按顺序执行缺失的增量 SQL。`validate` 只检查，不修改数据库。完成外部迁移后，`firefly_schema_version` 必须包含版本 `12`。
