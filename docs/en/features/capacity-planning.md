---
title: Quota and Capacity Planning
description: Side-effect-free quota previews, capacity baselines, deterministic recommendations, and risk reports in Firefly 1.2.1.
---

# Quota and Capacity Planning

Firefly 1.2.1 makes quota changes preview-first. A preview only reads authoritative tenant policy, usage, and bounded historical samples. It never calls `tryReserve` and does not modify reservations, Outbox, audit records, or the tenant version.

## Recommendation semantics

Concurrency, CPU, memory, backlog, and trigger rate are evaluated independently:

```text
recommendedLimit = ceil(max(currentUsage, historicalPeak) * (1 + headroomPercent / 100))
```

The default window is seven days with 20% headroom. Coverage below 80%, quota-censored observations, or mixed policy/runtime versions receive explicit quality labels and block unsupported downsizing recommendations. A value of `0` still means unlimited and is never recommended merely because observed demand is zero.

## Admin workflow

```http
POST /api/tenants/{tenantId}/quota-preview
GET /api/tenant-capacity?window=P7D&risk=HIGH&limit=100
GET /api/tenant-capacity/{tenantId}?window=P7D
GET /api/tenant-capacity/export?window=P7D&format=csv
```

Preview requires `ADMIN`; report list/detail requires `READER`, and export requires `OPERATOR`. The preview returns a `baseVersion`. Apply still uses `PUT /api/tenants/{tenantId}` with the same `expectedVersion`; a concurrent change returns `409 tenant_version_conflict` and requires another preview.

Reducing a limit below current usage returns `CRITICAL / CURRENT_USAGE_ABOVE_PROPOSED_LIMIT`. Saving never preempts running work and only affects new admission.

## Collection, HA, and backpressure

- Buckets default to five minutes and retention to seven days; supported ranges are one minute to one hour and one to 30 days.
- Admission threads update memory counters only. A full buffer or storage failure drops planning samples and records low-cardinality health metrics without backpressuring business paths.
- Every process uses a unique source ID. Flush deduplication and sample merge share one transaction: usage takes the maximum, while rejection counters increase only on the first flush.
- The shard-zero owner collects authoritative policy/usage snapshots and runs bounded retention cleanup.
- Additive v21 migrations create only `firefly_tenant_capacity_sample` and `firefly_tenant_capacity_flush`; core schema version remains 12.

Configuration:

```properties
firefly.tenant.capacity.bucket-width=PT5M
firefly.tenant.capacity.sample-interval=PT1M
firefly.tenant.capacity.retention=P7D
firefly.tenant.capacity.max-pending-buckets=10000
firefly.tenant.capacity.cleanup-batch=500
```

## Metrics

- `firefly_tenant_capacity_observations_dropped_total{reason}`
- `firefly_tenant_capacity_flush_failures_total{reason}`
- `firefly_tenant_capacity_flush_lag_seconds`
- `firefly_tenant_quota_preview_total{risk}`

These collection-health metrics intentionally omit tenant IDs so tenant growth does not multiply Prometheus cardinality.
