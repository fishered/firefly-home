---
title: 快速开始
description: 在本地启动 Firefly Server、Admin UI，并通过 Spring Boot 注解快速创建任务。
---

# 快速开始

Firefly 当前以 Java 21 和 Gradle 多模块工程组织。推荐先启动 Firefly Server，再在业务 Spring Boot 服务中引入 starter，通过 `@FireflyJob` 注解自动注册 handler 并创建任务。

## 环境要求

- JDK 21
- Spring Boot 3.x 业务项目
- Node.js 18 或更高版本，用于运行 Admin UI 和本站点
- 本地 PostgreSQL 可选；快速验证可以切换到 H2 或 memory profile

## Spring Boot 快速集成

业务项目只需要引入 `firefly-spring-boot-starter`。正式版本发布在 Maven Central，不需要添加 Firefly 私有仓库，也不需要分别声明 Netty 客户端或自动配置模块。

::: tip Firefly 1.0.0 已发布
正式构件可在 [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.0) 查看。Central 索引可能在发布后延迟一段时间，但 Maven 坐标保持不变。
:::

Maven 依赖：

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

Gradle 依赖：

```groovy
dependencies {
    implementation "io.github.fishered:firefly-spring-boot-starter:1.0.0"
}
```

业务服务作为远程 Executor 主动连接 Firefly Gateway。先在 Admin UI 生成 Integration Key，然后写入业务服务配置：

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

这里保留最小可运行配置即可。`firefly.executor.name` 是当前业务执行器名称，`gateway-addresses` 指向 Firefly Gateway，`integration-key` 使用 Admin UI 生成的 Integration Key。Starter 会使用默认值自动启动 Executor，并在 Spring 应用启动完成后把 `@FireflyJob` 声明的任务同步到 Admin API。

## 使用注解自动创建任务

在任意 Spring Bean 的方法上添加 `@FireflyJob`。方法必须返回 `void`，参数可以为空，也可以接收一个 `ExecutionContext`。

```java
import com.firefly.domain.ExecutionContext;
import com.firefly.spring.annotation.FireflyJob;
import org.springframework.stereotype.Component;

@Component
public class BillingJobs {
    @FireflyJob(
            name = "每日账单处理",
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

默认情况下，Starter 使用方法全限定名作为自动入口和任务 ID：

```text
com.example.BillingJobs#billingHandler
```

因此不需要再手写全局 jobId 或 handlerName。业务方法启动后会被注册为本地 handler，任务定义会同步到 Firefly Admin API，调度中心到点后通过 Gateway 触发这个 handler。

同一个方法需要多个调度计划时，可以重复声明 `@FireflyJob`，并使用唯一 `key` 区分：

```java
@FireflyJob(key = "daily", name = "每日账单", cron = "0 0 2 * * *", zoneId = "Asia/Shanghai")
@FireflyJob(key = "hourly", name = "小时账单巡检", cron = "0 0 * * * *", zoneId = "Asia/Shanghai")
public void billingHandler(ExecutionContext context) {
    // run business code
}
```

## 启动 Firefly Server

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

## 嵌入式 Java 创建任务

如果不使用 Spring Boot，也可以直接在 Java 进程内创建调度器并注册任务：

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

Spring Boot 项目仍然可以使用 `FireflyJobRegistration` Bean 处理动态场景，但日常固定任务建议优先使用 `@FireflyJob` 注解。

