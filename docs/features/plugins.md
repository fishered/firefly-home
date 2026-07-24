---
title: 插件体系
description: Firefly 的可选能力如何通过插件接入。
---

# 插件体系

Firefly 插件用于承载可选能力，例如指标、告警、审计扩展和未来协议。插件通过 `plugins/plugin-api` 定义生命周期，具体能力放在独立模块中。

## Plugin API

```java
public interface FireflyPlugin extends AutoCloseable {
    String id();

    void start(FireflyPluginContext context);
}
```

插件通过 `FireflyPluginContext` 获取可选运行时能力：

```java
FireflyPluginContext context = FireflyPluginContext.builder()
        .jobRepository(jobRepository)
        .nodeRegistry(nodeRegistry)
        .executorRegistry(executorRegistry)
        .build();
```

## 启用插件

```properties
firefly.plugins=metrics-prometheus,acme-alerts
```

外部插件实现 `FireflyPlugin` 后，通过 JDK SPI 描述文件暴露：

```text
META-INF/services/com.firefly.plugin.FireflyPlugin
```

## 已有能力

| 插件或能力 | 模块 | 说明 |
|---|---|---|
| Admin HTTP API | `apis/admin-http` | API 节点内置 JSON 管理 API |
| Prometheus Metrics | `plugins/metrics-prometheus` | `/metrics` 文本指标 |
| Plugin API | `plugins/plugin-api` | 插件生命周期、配置读取和状态描述 |

Netty 是默认 Executor transport，不作为普通功能插件启用。
