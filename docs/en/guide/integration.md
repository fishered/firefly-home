---
title: Integration
description: Firefly supports embedded Java, Spring Boot Starter, the non-Spring Remote Adapter, and standalone Server.
---

# Integration

Firefly exposes four integration paths: in-process embedded scheduling, Spring Boot Starter, the non-Spring Java Remote Adapter, and standalone Server. Business-side remote executors connect to Gateway while the control plane owns Executor and job definitions.

## Embedded Java

Use embedded Java when the scheduler and business code should run in the same JVM and that process owns the job definitions.

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

Version `1.0.5` is distributed through [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.5), with no additional repository required. Confirm that Central indexing has completed before using it.

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.5</version>
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

## Non-Spring Java Remote Adapter

Traditional Java, Servlet, Guice, and command-line workers use `firefly-remote-adapter`. Regular business services do not need to operate the Netty transport directly.

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-remote-adapter</artifactId>
    <version>1.0.5</version>
</dependency>
```

Create a `TCP` Executor in Admin first, configure the same name, and register the fixed Handler capabilities:

```java
RemoteExecutorAdapter.run(handlers -> handlers
        .bind("billing", billingService::execute)
        .bind("reconcile", billingService::reconcile));
```

Optional annotation mapping scans explicitly supplied objects only:

```java
final class BillingHandlers {
    @FireflyHandler(handlerName = "billing")
    void billing(ExecutionContext context) {
        // run business code
    }
}

RemoteExecutorAdapter.run(RemoteHandlerProvider.annotated(new BillingHandlers()));
```

The Remote Adapter requires an existing Executor definition and registers only the running instance and Handler capabilities. Jobs, Cron, routing, retries, and enablement remain managed through Admin UI/API. The language-neutral Agent for Python, Go, and third-party HTTP services is deferred to a later release.

## Standalone Server

Node roles are configured with `firefly.node.roles`:

```properties
firefly.node.mode=standalone
firefly.node.name=firefly-standalone
firefly.node.roles=api,gateway,scheduler
```

In production, API, Gateway, and Scheduler roles can be split across different nodes.
