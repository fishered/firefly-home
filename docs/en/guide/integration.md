---
title: Integration
description: Firefly supports embedded Java, Spring Boot, standalone Server, and remote Executor integration.
---

# Integration

Firefly exposes three primary integration paths: traditional Java projects, Spring Boot projects, and standalone Server. Remote executors connect through `transports/netty`.

## Traditional Java

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

```yaml
firefly:
  enabled: true
  auto-start: true
  worker-threads: 4
  worker-thread-name-prefix: firefly-worker
```

## Remote Executor

Business services can actively connect to the scheduler gateway, register handlers, and wait for trigger commands.

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

## Standalone Server

Node roles are configured with `firefly.node.roles`:

```properties
firefly.node.mode=standalone
firefly.node.name=firefly-standalone
firefly.node.roles=api,gateway,scheduler
```

In production, API, Gateway, and Scheduler roles can be split across different nodes.
