---
title: Netty 执行器
description: 远程业务执行器的注册、心跳、触发和结果回传。
---

# Netty 执行器

Netty 是 Firefly 当前默认的远程 Executor transport。它负责长连接、注册、心跳、触发命令、ACK 和结果上报，不进入 scheduler-core。

## 模块与序列化边界

```text
transports/netty-protocol   wire record、消息类型、Jackson JSON codec
transports/netty            Gateway 连接与派发协调
clients/executor-netty      业务侧 Executor Client 与幂等适配
```

线上传输使用明确的 JSON wire model，不使用 JDK 默认序列化。领域 record 会先映射为协议 record，再由 Jackson 编解码；新增字段必须考虑旧端缺失字段、消息类型和协议版本协商，不能直接把任意领域对象写入网络。

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

## 结果持久化背压

Gateway 收到 ACK 或执行结果后，会把持久化工作交给独立的有界执行器，避免在 Netty EventLoop 上执行 JDBC。工作队列饱和时，任务进入同样有界的延迟重试区；等待次数、等待间隔和重试容量都有上限，关闭时会停止后续等待。

当工作队列恢复到低水位后，Gateway 恢复自动读取；重试容量或次数耗尽时返回明确拒绝并更新对应执行状态。这个机制只保护瞬时数据库抖动，不是无限缓存，也没有在 `1.0.2` 中增加语义未定义的失败注册表。
