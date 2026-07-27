---
title: Quick Start
description: Start Firefly Server, Admin UI, and create jobs with Spring Boot annotations.
---

# Quick Start

Firefly is organized as a Java 21 and Gradle multi-module project. Start Firefly Server first, then add the starter to a Spring Boot business service and use `@FireflyJob` to register handlers and create jobs automatically.

## Requirements

- JDK 21
- Spring Boot 3.x business project
- Node.js 18 or later for Admin UI and this documentation site
- PostgreSQL is optional for local development; H2 and memory profiles are available for quick checks

## Spring Boot Quick Integration

Business services only need `firefly-spring-boot-starter`. Releases are published to Maven Central, so no Firefly-specific repository or separate Netty and auto-configuration dependencies are required.

Maven dependency:

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

Gradle dependency:

```groovy
dependencies {
    implementation "io.github.fishered:firefly-spring-boot-starter:1.0.0"
}
```

Use `.\gradlew.bat publishToMavenLocal` and enable `mavenLocal()` only when testing an unreleased source build. Production integrations should use an immutable version from Maven Central.

The business service runs as a remote Executor and actively connects to Firefly Gateway. Generate an Integration Key from Admin UI, then configure the service:

```yaml
spring:
  application:
    name: firefly-example
firefly:
  executor:
    name: billing-executor
    gateway-addresses:
      - 127.0.0.1:9700
    integration-key: ${FIREFLY_INTEGRATION_KEY}
server:
  port: 80
```

Keep the quick-start configuration minimal. `firefly.executor.name` is the business executor name, `gateway-addresses` points to Firefly Gateway, and `integration-key` should be the Integration Key generated from Admin UI. The Starter uses defaults to start the Executor and synchronizes jobs declared by `@FireflyJob` to Admin API after the Spring application is ready.

## Create Jobs with Annotation

Add `@FireflyJob` to a method on any Spring Bean. The method must return `void` and accept either no arguments or one `ExecutionContext` argument.

```java
import com.firefly.domain.ExecutionContext;
import com.firefly.spring.annotation.FireflyJob;
import org.springframework.stereotype.Component;

@Component
public class BillingJobs {
    @FireflyJob(
            name = "Daily billing",
            cron = "0 0 2 * * *",
            zoneId = "Asia/Shanghai",
            groupId = "billing",
            parameters = {"tenant=primary"}
    )
    public void billingHandler(ExecutionContext context) {
        System.out.println("executionId=" + context.executionId());
        // run business code
    }
}
```

By default, the Starter uses the fully qualified method name as both automatic entrypoint and job ID:

```text
com.example.BillingJobs#billingHandler
```

No global jobId or handlerName is required. The method is registered as a local handler, the job definition is synchronized to Firefly Admin API, and the scheduler center triggers the handler through Gateway.

When one method needs multiple schedules, repeat `@FireflyJob` and provide a unique `key` for each declaration:

```java
@FireflyJob(key = "daily", name = "Daily billing", cron = "0 0 2 * * *", zoneId = "Asia/Shanghai")
@FireflyJob(key = "hourly", name = "Hourly billing check", cron = "0 0 * * * *", zoneId = "Asia/Shanghai")
public void billingHandler(ExecutionContext context) {
    // run business code
}
```

## Start Firefly Server

The default profile is `pg`, which connects to local PostgreSQL:

```powershell
.\gradlew.bat :server:launcher:run
```

For local preview, H2 is usually easier:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=h2"
```

Memory storage:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=memory"
```

Enable demo jobs:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.demo.enabled=true"
```

## Open Admin UI

Admin UI listens on:

```text
http://127.0.0.1:9720
```

Admin HTTP API listens on:

```text
http://127.0.0.1:9710
```

Prometheus Metrics:

```text
http://127.0.0.1:9711/metrics
```

## Embedded Java Job

If you are not using Spring Boot, create a scheduler inside the Java process and register jobs directly:

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

Spring Boot projects can still use `FireflyJobRegistration` beans for dynamic cases, but fixed application jobs should prefer `@FireflyJob`.

