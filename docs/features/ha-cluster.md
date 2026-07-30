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
