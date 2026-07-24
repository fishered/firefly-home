---
title: 集成方式
description: Firefly 支持嵌入式、Spring Boot、独立 Server 和远程 Executor。
---

# 集成方式

Firefly 的集成层分成三类入口：传统 Java 项目、Spring Boot 项目、独立 Server。远程执行器通过 `transports/netty` 接入调度中心。

## 传统 Java 项目

适合 Servlet 老项目、Guice 项目、命令行服务和内部 worker 服务。

```java
try (FireflyScheduler scheduler = FireflyScheduler.create()) {
    JobDefinition job = JobDefinition.builder()
            .id("daily-report")
            .name("Daily Report")
            .handlerName("reportHandler")
            .schedule(new CronSchedule("0 0 9 * * *"))
            .zoneId(ZoneId.of("Asia/Shanghai"))
            .build();

    scheduler.register(FireflyJobRegistration.of(job, context -> {
        // run your task here
    }));

    scheduler.start();
}
```

## Spring Boot Starter

Spring Boot 项目引入 starter 后，业务侧只需要提供任务注册 Bean：

```java
@Bean
FireflyJobRegistration reportJob() {
    JobDefinition job = JobDefinition.builder()
            .id("spring-report")
            .name("Spring Report")
            .handlerName("reportHandler")
            .schedule(new CronSchedule("0 0 9 * * *"))
            .zoneId(ZoneId.of("Asia/Shanghai"))
            .build();

    return FireflyJobRegistration.of(job, context -> {
        // run your task here
    });
}
```

基础配置：

```yaml
firefly:
  enabled: true
  auto-start: true
  worker-threads: 4
  worker-thread-name-prefix: firefly-worker
```

## 远程 Executor

业务服务不想嵌入调度核心时，可以使用 Netty 远程执行器。业务服务主动连接调度中心 gateway，注册 handler，等待调度中心推送任务。

```java
NettyExecutorClient client = NettyExecutorClient.builder()
        .gatewayAddresses(List.of("firefly-1:9700", "firefly-2:9700"))
        .executorName("billing-executor")
        .serviceName("billing-service")
        .build()
        .registerHandler("billingHandler", context -> {
            // run business code
        });

client.start();
```

## 独立 Server

独立 Server 适合作为统一调度中心运行。节点职责由 `firefly.node.roles` 指定：

```properties
firefly.node.mode=standalone
firefly.node.name=firefly-standalone
firefly.node.roles=api,gateway,scheduler
```

生产集群可以拆分角色，例如 API 节点只暴露 Admin API，Gateway 节点只维护 Executor 长连接，Scheduler 节点只负责 shard lease 和 due job 推进。
