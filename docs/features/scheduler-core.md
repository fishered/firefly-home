---
title: 调度核心
description: Firefly scheduler-core 的时间、策略和执行边界。
---

# 调度核心

`libs/scheduler-core` 保持纯 Java，不依赖 Spring、Guice、HTTP、数据库或特定运行时。它只处理调度定义、时间计算、任务注册和本地执行。

## 核心能力

- 6 位 cron：秒、分、时、日、月、周
- fixed-rate 调度
- 任务级 IANA `ZoneId`
- misfire 策略：`SKIP`、`FIRE_ONCE`、`CATCH_UP`
- 并发策略：`ALLOW`、`FORBID`
- 本地 handler 注册表
- 可替换 Clock，便于测试时间语义

## 可执行调度类型

任务定义只接受运行时可以持久化并执行的调度类型。`CronSchedule` 映射为 `CRON`，`FixedRateSchedule` 映射为 `FIXED_RATE`；其他 `Schedule` 实现默认标记为 `UNSUPPORTED`，并在 `JobDefinition` 构建阶段被拒绝。

这个校验让 API、持久化和调度引擎使用同一份能力认知。扩展新的调度类型时，必须同时完成领域类型、时间计算、存储编码、Admin API/UI 和兼容测试，不能只实现一个 Java 接口就让任务进入数据库。

## 时间规则

Firefly 要求任务显式声明 `ZoneId`。cron 表达式按任务本地时间计算，运行态游标统一保存为 UTC `Instant`。

```java
JobDefinition job = JobDefinition.builder()
        .id("new-york-daily-report")
        .name("New York Daily Report")
        .handlerName("reportHandler")
        .schedule(new CronSchedule("0 0 9 * * *"))
        .zoneId(ZoneId.of("America/New_York"))
        .build();
```

这表示任务会在纽约本地时间 09:00 执行，不依赖调度服务部署机器的默认时区。

## Misfire

| 策略 | 语义 |
|---|---|
| `SKIP` | 跳过错过的触发点，推进到下一个未来时间 |
| `FIRE_ONCE` | 合并错过的触发点，只补偿执行一次 |
| `CATCH_UP` | 在限制内追赶错过的触发点 |

## 并发策略

`ALLOW` 允许同一个任务多个执行重叠。`FORBID` 会避免同一任务在前一次执行未结束时再次进入执行。
