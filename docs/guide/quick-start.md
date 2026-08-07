---
title: 快速开始
description: 启动 Firefly，并选择 Spring Boot Starter 或非 Spring Remote Adapter 快速接入业务服务。
---

# 快速开始

Firefly 当前以 Java 21 和 Gradle 多模块工程组织。推荐先启动 Firefly Server，再根据业务服务类型选择 Spring Boot Starter 或非 Spring Java Remote Adapter。

## 环境要求

- JDK 21
- Spring Boot 3.x/4.x 业务项目可选；传统 Java 服务不需要 Spring
- Node.js 18 或更高版本，用于运行 Admin UI 和本站点
- 本地 PostgreSQL 可选；快速验证可以切换到 H2 或 memory profile

## 统一管理依赖版本

Maven 项目推荐只在 `dependencyManagement` 中固定一次 Firefly BOM 版本。后续无论使用 Spring Starter 还是 Remote Adapter，都不再为每个 Firefly 依赖重复填写版本号：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.fishered</groupId>
            <artifactId>firefly-bom</artifactId>
            <version>1.0.5</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

BOM 不会自动选择“网络上的最新版”，而是把需要维护的 Firefly 版本集中到这一处。这样构建可重复，也可以让 Renovate 或 Dependabot 自动提交 BOM 升级 PR。不使用 BOM 的项目仍可直接在具体依赖上写版本。

## Spring Boot 快速集成

业务项目只需要引入 `firefly-spring-boot-starter`。正式版本发布在 Maven Central，不需要添加 Firefly 私有仓库，也不需要分别声明 Netty 客户端或自动配置模块。

::: tip Firefly 1.0.5
使用 `1.0.5` 前，请在 [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.5) 确认构件已经完成索引。源码 PR 合并不代表 Maven Central 已经发布完成。
:::

Maven 依赖：

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
</dependency>
```

Gradle 依赖：

```groovy
dependencies {
    implementation platform("io.github.fishered:firefly-bom:1.0.5")
    implementation "io.github.fishered:firefly-spring-boot-starter"
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

## 非 Spring Java 快速集成

Servlet 老项目、Guice 服务、命令行 Worker 等非 Spring Java 服务使用 `firefly-remote-adapter`。它提供与 Starter 相近的配置、连接、重连和生命周期体验，但不会在程序侧创建 Executor 或任务。

Maven 依赖：

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-remote-adapter</artifactId>
</dependency>
```

Gradle 依赖：

```groovy
dependencies {
    implementation platform("io.github.fishered:firefly-bom:1.0.5")
    implementation "io.github.fishered:firefly-remote-adapter"
}
```

先在 Admin UI 创建固定 Executor，例如 `billing-executor`，协议选择 `TCP`。然后通过环境变量配置业务服务：

```text
FIREFLY_EXECUTOR_NAME=billing-executor
FIREFLY_EXECUTOR_GATEWAY_ADDRESSES=127.0.0.1:9700
FIREFLY_EXECUTOR_INTEGRATION_KEY=replace-with-integration-key
```

在明确传入的业务对象上标记该服务固定提供的 Handler：

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

`run(...)` 会读取 `firefly.executor.*` / `FIREFLY_EXECUTOR_*` 配置，连接 Gateway，等待收到 `REGISTERED`，并跟随 JVM 优雅关闭。未知 Executor 会启动失败，不会被 Adapter 自动创建。

Adapter 根据业务类全限定名和方法名自动生成稳定入口：

```text
com.example.BillingHandlers#billing
com.example.BillingHandlers#reconcile
```

`@FireflyHandler` 不包含可修改的 `handlerName`、Cron、Job 或路由策略，也不会触发全局 classpath 扫描。同一类的注解重载方法会因为入口重复而在连接前失败。服务上线并上报 Handler 后，在 Admin UI 创建 Job，并由控制面维护 Cron、启停、路由和重试策略。

低层 `.bind(name, handler)` 只保留给外部动态名称和兼容场景；固定业务方法使用自动入口。

Python、Go 和其他语言后续将通过同一个语言无关 Agent 接入，不属于 v1.0.5 的快速集成范围。

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

