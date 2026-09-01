---
title: Maven Central
description: Firefly 1.1.2 的 Maven Central 坐标、模块依赖链和版本策略。
---

# Maven Central

Firefly 使用 `io.github.fishered` 命名空间发布到 Maven Central。Spring Boot 业务项目只需要引入一个 Starter，无需添加私有仓库或单独声明 Firefly 的内部模块。

[在 Maven Central 查看 firefly-spring-boot-starter 1.1.2](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.1.2)

::: info 索引延迟
新版本从 Central Portal 发布后，搜索页和各地区镜像可能需要一段时间完成同步。同步期间 Maven 坐标不会变化。
:::

## Maven

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.1.2</version>
</dependency>
```

Maven Central 是 Maven 的默认仓库，因此不需要增加 `<repositories>` 配置。

## Gradle

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "io.github.fishered:firefly-spring-boot-starter:1.1.2"
}
```

## 发布模块

Starter 会沿 POM 依赖自动解析所需模块：

| 构件 | 职责 |
| --- | --- |
| `firefly-bom` | 统一管理全部 Firefly 公共构件版本 |
| `scheduler-core` | 调度领域模型、路由和存储契约 |
| `plugin-api` | 外部插件扩展 API |
| `netty-protocol` | Gateway 与 Executor 共用的 JSON wire model 和编解码 |
| `netty` | Gateway 与 Executor 共用的协议和传输实现 |
| `executor-netty` | 业务服务使用的 Netty Executor 客户端 |
| `firefly-remote-adapter` | 非 Spring Java 服务使用的独立 Executor 集成入口 |
| `firefly-spring-boot-autoconfigure` | Executor、任务注解和 Spring 生命周期自动配置 |
| `firefly-spring-boot-starter` | Spring Boot 项目的唯一集成入口 |

普通业务项目不要分别声明这些模块。只有开发自定义传输、客户端或插件时，才需要直接依赖对应的底层构件。

## 验证依赖

更新 Maven 索引并检查依赖树：

```powershell
mvn -U dependency:tree
```

正常情况下可以看到 `firefly-spring-boot-starter`、`firefly-spring-boot-autoconfigure`、`executor-netty`、`netty`、`netty-protocol` 和 `scheduler-core`。

## 版本策略

Maven Central 中的正式版本不可覆盖。项目升级时应显式修改版本号；后续修复将继续使用新的补丁版本。
