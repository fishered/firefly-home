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

Spring Boot applications only need one Starter. It auto-configures the Netty client, handler discovery, job synchronization, heartbeats, reconnection, and Spring lifecycle integration.

Version `1.0.2` is distributed through [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.2), with no additional repository required. Remain on `1.0.1` until Central indexing completes.

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.2</version>
</dependency>
```

The business service runs as a remote Executor and connects to Gateway. Generate an Integration Key in Admin UI for Executor registration and declarative job synchronization.

```yaml
spring:
  application:
    name: billing-service
firefly:
  executor:
    name: billing-executor
    gateway-addresses:
      - 127.0.0.1:9700
    integration-key: ${FIREFLY_INTEGRATION_KEY}
```

Declare jobs on methods of regular Spring beans. Methods must return `void` and may accept no arguments or one `ExecutionContext`:

```java
@Component
public class BillingJobs {
    @FireflyJob(
            name = "Daily billing",
            cron = "0 0 2 * * *",
            zoneId = "Asia/Shanghai"
    )
    public void billingHandler(ExecutionContext context) {
        // run business code
    }
}
```

The fully qualified method name, for example `com.example.BillingJobs#billingHandler`, becomes the default job ID and handler entrypoint. Programmatic `FireflyJobRegistration` remains available for dynamic jobs but is not the recommended entrypoint for fixed schedules.

## Remote Executor

Non-Spring services can use the Netty client directly, connect to Gateway, register handlers, and wait for trigger commands.

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
