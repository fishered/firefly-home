---
title: Plugin System
description: How optional Firefly capabilities plug into the runtime.
---

# Plugin System

Firefly plugins carry optional capabilities such as metrics, alerts, audit extensions, and future protocols. The lifecycle lives in `plugins/plugin-api`.

## Plugin API

```java
public interface FireflyPlugin extends AutoCloseable {
    String id();

    void start(FireflyPluginContext context);
}
```

Plugins read optional runtime capabilities from `FireflyPluginContext`:

```java
FireflyPluginContext context = FireflyPluginContext.builder()
        .jobRepository(jobRepository)
        .nodeRegistry(nodeRegistry)
        .executorRegistry(executorRegistry)
        .build();
```

## Enable Plugins

```properties
firefly.plugins=metrics-prometheus,acme-alerts
```

External plugins implement `FireflyPlugin` and expose a JDK SPI descriptor:

```text
META-INF/services/com.firefly.plugin.FireflyPlugin
```

Netty is the default Executor transport, not a regular feature plugin.
