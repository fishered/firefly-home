---
title: 配额与容量规划
description: Firefly 1.2.1 的无副作用配额预演、容量基线、确定性推荐和风险报告。
---

# 配额与容量规划

Firefly 1.2.1 让配额变更先预演、后应用。预演只读取权威租户 policy、usage 和有界历史样本，不调用 `tryReserve`，不会修改 reservation、Outbox、审计记录或租户版本。

## 推荐语义

并发、CPU、内存、backlog 和触发速率分别计算：

```text
recommendedLimit = ceil(max(currentUsage, historicalPeak) * (1 + headroomPercent / 100))
```

默认窗口为 7 天、余量为 20%。覆盖率低于 80%、样本被配额截断、窗口混合 policy 或运行时版本时，结果会带明确质量标记，并阻止没有依据的下调建议。`0` 仍表示无限，不会因为零负载自动建议为零。

## Admin 操作闭环

```http
POST /api/tenants/{tenantId}/quota-preview
GET /api/tenant-capacity?window=P7D&risk=HIGH&limit=100
GET /api/tenant-capacity/{tenantId}?window=P7D
GET /api/tenant-capacity/export?window=P7D&format=csv
```

预演权限为 `ADMIN`；报告列表和详情需要 `READER`，导出需要 `OPERATOR`。预览返回 `baseVersion`，真正应用仍使用 `PUT /api/tenants/{tenantId}` 和相同 `expectedVersion`。版本已变化时返回 `409 tenant_version_conflict`，要求重新预览。

降低配额到当前用量以下会返回 `CRITICAL / CURRENT_USAGE_ABOVE_PROPOSED_LIMIT`。保存不会抢占运行中任务，只影响新的准入。

## 采集、HA 与背压

- 默认桶宽 5 分钟、保留 7 天；桶宽允许 1 分钟至 1 小时，保留期允许 1 至 30 天。
- 准入线程只增加内存计数。缓冲满或存储失败时丢弃规划样本并记录低基数指标，不反压业务路径。
- 每个进程使用唯一 source ID，flush 去重与样本合并在同一事务中；用量取 max，拒绝计数只在首次 flush 时累加。
- shard 0 owner 采集权威 policy/usage 快照并执行有界保留期清理。
- v21 只新增 `firefly_tenant_capacity_sample` 和 `firefly_tenant_capacity_flush`，核心 schema 版本仍为 12。

相关配置：

```properties
firefly.tenant.capacity.bucket-width=PT5M
firefly.tenant.capacity.sample-interval=PT1M
firefly.tenant.capacity.retention=P7D
firefly.tenant.capacity.max-pending-buckets=10000
firefly.tenant.capacity.cleanup-batch=500
```

## 指标

- `firefly_tenant_capacity_observations_dropped_total{reason}`
- `firefly_tenant_capacity_flush_failures_total{reason}`
- `firefly_tenant_capacity_flush_lag_seconds`
- `firefly_tenant_quota_preview_total{risk}`

这些采集健康指标不包含 tenant ID，避免租户规模放大 Prometheus 基数。
