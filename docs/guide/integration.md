---
title: 集成方式
description: Firefly 支持嵌入式 Java、Spring Boot Starter、非 Spring Remote Adapter 和独立 Server。
---

# 集成方式

Firefly 提供四类入口：进程内嵌入式调度、Spring Boot Starter、非 Spring Java Remote Adapter 和独立 Server。业务侧远程执行器主动连接 Gateway，控制面统一管理 Executor 和任务定义。

## 嵌入式 Java 项目

适合调度器与业务代码需要运行在同一个 JVM、且任务定义由该进程维护的场景。

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

Spring Boot 项目只需要引入一个 Starter。Netty 客户端、处理器发现、任务同步、心跳、重连和 Spring 生命周期均由自动配置完成。

`1.1.3` 已发布到 [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.1.3)，无需配置额外 Maven 仓库。

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.fishered</groupId>
            <artifactId>firefly-bom</artifactId>
            <version>1.1.3</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
</dependency>
```

版本只固定在 BOM 一处；同一项目中的其他 Firefly 依赖也可以省略版本。

业务服务作为远程 Executor 主动连接 Gateway。Integration Key 在 Admin UI 中生成，用于 Executor 注册和声明式任务同步。

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

在 Spring Bean 的方法上声明任务。方法必须返回 `void`，参数可以为空，也可以接收一个 `ExecutionContext`：

```java
@Component
public class BillingJobs {
    @FireflyJob(
            name = "每日账单处理",
            cron = "0 0 2 * * *",
            zoneId = "Asia/Shanghai"
    )
    public void billingHandler(ExecutionContext context) {
        // run business code
    }
}
```

默认任务 ID 和处理器入口均基于方法全限定名生成，例如 `com.example.BillingJobs#billingHandler`，无需手写全局 ID。程序化 `FireflyJobRegistration` 仍可用于运行时动态创建任务，但不是固定任务的推荐入口。

## 非 Spring Java Remote Adapter

传统 Java、Servlet、Guice 和命令行 Worker 使用 `firefly-remote-adapter`。普通业务服务不需要直接操作 Netty 传输细节。

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-remote-adapter</artifactId>
</dependency>
```

先在 Admin 创建 `TCP` Executor，然后配置同一个名称，并只扫描明确传入的业务对象：

```java
final class BillingHandlers {
    @FireflyHandler
    void billing(ExecutionContext context) {
        // run business code
    }
}

RemoteExecutorAdapter.run(RemoteHandlerProvider.annotated(new BillingHandlers()));
```

Handler 入口自动生成为 `包名.类名#方法名`，注解不允许手写名称。Remote Adapter 强制要求 Executor 定义已经存在，只注册当前运行实例和 Handler 能力。Job、Cron、路由、重试和启停状态仍由 Admin UI/API 管理。Python、Go 和第三方 HTTP 服务的语言无关 Agent 延后到后续版本。

## 独立 Server

独立 Server 适合作为统一调度中心运行。节点职责由 `firefly.node.roles` 指定：

```properties
firefly.node.mode=standalone
firefly.node.name=firefly-standalone
firefly.node.roles=api,gateway,scheduler
```

生产集群可以拆分角色，例如 API 节点只暴露 Admin API，Gateway 节点只维护 Executor 长连接，Scheduler 节点只负责 shard lease 和 due job 推进。
