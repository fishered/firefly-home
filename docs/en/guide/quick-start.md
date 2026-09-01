---
title: Quick Start
description: Start Firefly and integrate a service with either Spring Boot Starter or the non-Spring Remote Adapter.
---

# Quick Start

Firefly is organized as a Java 21 and Gradle multi-module project. Start Firefly Server first, then choose Spring Boot Starter or the non-Spring Java Remote Adapter for the business service.

## Requirements

- JDK 21
- Spring Boot 3.x/4.x is optional; traditional Java services do not need Spring
- Node.js 18 or later for Admin UI and this documentation site
- PostgreSQL is optional for local development; H2 and memory profiles are available for quick checks

## Manage Dependency Versions Once

Maven projects should pin the Firefly BOM once in `dependencyManagement`. Dependencies for both Spring Starter and Remote Adapter can then omit individual versions:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.fishered</groupId>
            <artifactId>firefly-bom</artifactId>
            <version>1.1.2</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

The BOM does not dynamically select the latest network release. It keeps builds reproducible while concentrating the Firefly version in one place, where Renovate or Dependabot can update it through a pull request. Projects that do not import the BOM may continue declaring a version on each dependency.

## Spring Boot Quick Integration

Business services only need `firefly-spring-boot-starter`. Releases are published to Maven Central, so no Firefly-specific repository or separate Netty and auto-configuration dependencies are required.

::: tip Firefly 1.1.2
`1.1.2` has been uploaded to [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.1.2) through the tag-driven release workflow.
:::

Maven dependency:

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
</dependency>
```

Gradle dependency:

```groovy
dependencies {
    implementation platform("io.github.fishered:firefly-bom:1.1.2")
    implementation "io.github.fishered:firefly-spring-boot-starter"
}
```

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

## Non-Spring Java Quick Integration

Traditional Servlet applications, Guice services, command-line workers, and other non-Spring Java services use `firefly-remote-adapter`. It provides Starter-like configuration, connection, reconnection, and lifecycle handling without creating Executors or jobs from application code.

Maven dependency:

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-remote-adapter</artifactId>
</dependency>
```

Gradle dependency:

```groovy
dependencies {
    implementation platform("io.github.fishered:firefly-bom:1.0.8")
    implementation "io.github.fishered:firefly-remote-adapter"
}
```

Create a fixed Executor such as `billing-executor` in Admin UI first and select the `TCP` protocol. Then configure the business service:

```text
FIREFLY_EXECUTOR_NAME=billing-executor
FIREFLY_EXECUTOR_GATEWAY_ADDRESSES=127.0.0.1:9700
FIREFLY_EXECUTOR_INTEGRATION_KEY=replace-with-integration-key
```

Mark the fixed Handler capabilities on an explicitly supplied business object:

```java
import com.firefly.domain.ExecutionContext;
import com.firefly.integration.remote.FireflyHandler;
import com.firefly.integration.remote.RemoteExecutorAdapter;
import com.firefly.integration.remote.RemoteHandlerProvider;

final class BillingHandlers {
    @FireflyHandler
    void billing(ExecutionContext context) {
        // run business code
    }

    @FireflyHandler
    void reconcile() {
        // run business code
    }
}

public final class BillingApplication {
    public static void main(String[] args) throws InterruptedException {
        RemoteExecutorAdapter.run(
                RemoteHandlerProvider.annotated(new BillingHandlers())
        );
    }
}
```

`run(...)` reads `firefly.executor.*` / `FIREFLY_EXECUTOR_*` configuration, connects to Gateway, waits for `REGISTERED`, and shuts down gracefully with the JVM. An unknown Executor fails startup and is never auto-created by the Adapter.

The Adapter derives stable entrypoints from the fully qualified business class and method names:

```text
com.example.BillingHandlers#billing
com.example.BillingHandlers#reconcile
```

`@FireflyHandler` has no mutable `handlerName`, Cron, Job, or routing fields and does not trigger global classpath scanning. Annotated overloads in the same class fail before connecting because they produce a duplicate entrypoint. After the service is online and reports its Handler capabilities, create the Job in Admin UI and keep Cron, enablement, routing, and retry policies in the control plane.

The low-level `.bind(name, handler)` API remains only for external dynamic names and compatibility cases; fixed business methods use automatic entrypoints.

Python, Go, and other languages will use the same language-neutral Agent in a later release and are outside the v1.0.6 quick-start scope.

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

