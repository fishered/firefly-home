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

    default FireflyPluginCompatibility compatibility() {
        return FireflyPluginCompatibility.current();
    }

    void start(FireflyPluginContext context);
}
```

`compatibility()` declares the supported host Plugin API-level range. The current API level is `1`. Older 1.x plugins inherit a default level-1 declaration and do not need recompilation merely because Firefly moves to `1.0.2`.

```java
@Override
public FireflyPluginCompatibility compatibility() {
    return new FireflyPluginCompatibility(1, 2);
}
```

The host validates every enabled plugin before starting any plugin. An unsupported current level, invalid range, or duplicate ID prevents node startup rather than leaving a partially active plugin set. Product versions and Plugin API levels are independent; the API level advances only for a breaking SPI contract change.

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
