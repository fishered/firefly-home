---
title: JDBC 与 HA
description: Firefly 的 JDBC 持久化、shard lease 和 fencing token。
---

# JDBC 与 HA

Firefly 使用 JDBC 存储承载任务定义、节点、shard lease、execution、outbox、审计和 Admin 用户数据。当前支持 H2、PostgreSQL 和 MySQL 方言脚本。

## Shard Lease

Scheduler 节点通过 `firefly_shard_lease` 获取分片所有权。租约续期或接管时递增 fencing token，防止旧 owner 在网络抖动或 GC 后继续推进任务。

关键原则：

- 所有节点共享相同 `firefly.scheduler.shard-count`
- 数据库时间作为节点在线、lease 和 outbox claim 的权威时间
- 数据库不可用时不继续产生无法 fencing 的新执行

## Outbox

任务游标 CAS、execution 创建和 outbox 写入在同一个事务中完成。远程派发通过 outbox 重试，ACK 前保持 `SENT`，超时后可重新派发。

## Schema

当前 schema 版本为 `12`。PostgreSQL 全新安装使用仓库中的权威最小脚本：

```text
scripts/postgresql/init.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/{h2,postgresql,mysql}/v12.sql
```

脚本下载、校验和执行方式见[部署说明](../guide/deployment.md#postgresql-数据库初始化)。

## 受控分片扩容

`firefly.scheduler.shard-count` 是集群不变量，不能通过滚动修改配置直接改变。`v1.0.2` 提供 `expand-online` 维护动作，只允许增加分片数，并允许纯 Gateway/Executor 数据面继续在线。

操作前必须满足：

1. 备份数据库并记录当前 shard count。
2. drain 并停止所有带 `SCHEDULER`、`STANDBY` 或 `API` 角色的节点。
3. 确认没有活动 execution，也没有状态非 `DONE`/`DEAD` 的 Outbox 记录。
4. 所有待重启控制面节点准备相同的目标 shard count。

以 PostgreSQL profile 扩容到 64 个 shard：

```powershell
.\gradlew.bat :server:launcher:migrateSchema --args="--firefly.config.profile=pg --firefly.schema.action=expand-online --firefly.schema.reshard.confirm=true --firefly.scheduler.shard-count=64"
```

工具会在数据库迁移锁和单个事务内重算全部 job 的 `shard_id`、更新 `scheduler.shard-count` 与 `jobs.revision`，并删除旧 lease。成功后使用目标 shard count 启动 Scheduler/API 节点并观察 lease 重新分配。

`expand-online` 不支持缩容，也不是所有角色无感的双路由切换。命令失败时事务回滚；控制面节点仍应保持下线，先读取数据库中的实际 shard count，再决定重试或按原配置恢复。缩容必须安排全停机窗口并使用 `firefly.schema.action=reshard`。
