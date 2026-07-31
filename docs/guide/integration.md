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

Spring Boot 项目只需要引入一个 Starter。Netty 客户端、处理器发现、任务同步、心跳、重连和 Spring 生命周期均由自动配置完成。

`1.0.2` 使用 [Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.2) 发布，无需配置额外 Maven 仓库。Central 完成索引前请继续使用 `1.0.1`。

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.2</version>
</dependency>
```

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

## 远程 Executor

非 Spring 服务可以直接使用 Netty 远程执行器。业务服务主动连接调度中心 Gateway，注册 handler，等待调度中心推送任务。

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
