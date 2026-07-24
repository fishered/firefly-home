---
title: 快速开始
description: 在本地启动 Firefly Server、Admin UI 和示例任务。
---

# 快速开始

Firefly 当前以 Java 21 和 Gradle 多模块工程组织。推荐先在本地启动 Server，再打开独立 Admin UI 检查任务、执行器、节点和插件状态。

## 环境要求

- JDK 21
- Node.js 18 或更高版本，用于运行 Admin UI 和本站点
- 本地 PostgreSQL 可选；快速验证可以切换到 H2 或 memory profile

## 运行测试

```powershell
.\gradlew.bat test
```

## 启动 Server

默认 profile 是 `pg`，会连接本地 PostgreSQL：

```powershell
.\gradlew.bat :server:launcher:run
```

如果只是本地预览，建议使用 H2：

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=h2"
```

使用内存存储：

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=memory"
```

启用 demo 任务：

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.demo.enabled=true"
```

## 打开 Admin UI

Admin UI 是独立 Node 服务，默认监听：

```text
http://127.0.0.1:9720
```

Java Admin HTTP API 默认监听：

```text
http://127.0.0.1:9710
```

Prometheus Metrics 默认地址：

```text
http://127.0.0.1:9711/metrics
```

## 创建第一个任务

嵌入式 Java 任务示例：

```java
JobDefinition job = JobDefinition.builder()
        .id("demo-print-every-5s")
        .name("Demo print every five seconds")
        .handlerName("demoPrinter")
        .schedule(new CronSchedule("*/5 * * * * *"))
        .zoneId(ZoneId.of("Asia/Shanghai"))
        .misfirePolicy(MisfirePolicy.FIRE_ONCE)
        .misfireGrace(Duration.ofSeconds(2))
        .concurrencyPolicy(ConcurrencyPolicy.FORBID)
        .maxCatchUpCount(3)
        .timeout(Duration.ofSeconds(10))
        .enabled(true)
        .build();
```

Spring Boot 项目可以通过 `FireflyJobRegistration` Bean 或 `@FireflyJob` 注解注册任务。远程业务服务可以使用 Netty Executor Client 主动连接调度中心 gateway。
