---
title: Netty 执行器
description: 远程业务执行器的注册、心跳、触发和结果回传。
---

# Netty 执行器

Netty 是 Firefly 当前默认的远程 Executor transport。它负责长连接、注册、心跳、触发命令、ACK 和结果上报，不进入 scheduler-core。

## 协议边界

```text
REGISTER_EXECUTOR
HEARTBEAT
TRIGGER_JOB
ACK_JOB
REPORT_RESULT
UNREGISTER_EXECUTOR
```

业务服务主动连接 gateway，调度中心按 executorName 查找在线实例并发送任务触发命令。

## 适用场景

- 业务服务不想嵌入调度核心
- 多个业务实例需要被统一调度中心管理
- 容器环境中不希望业务服务额外开放监听端口
- 需要 ACK、结果回传和断线状态快速感知

## Spring Boot 配置

```yaml
firefly:
  executor:
    name: billing-executor
    instance-id: ${HOSTNAME:billing-service-local}
    auto-start: true
    gateway-addresses:
      - firefly-1:9700
      - firefly-2:9700
    service-name: billing-service
    integration-key: ${FIREFLY_INTEGRATION_KEY}
    idempotency-directory: /data/firefly-executor-results
```

Executor 只有收到 Gateway 的 `REGISTERED` 响应后，才表示实例已经可以接收任务。
