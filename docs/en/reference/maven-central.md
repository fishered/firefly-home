---
title: Maven Central
description: Maven Central coordinates, module dependency chain, and version policy for Firefly 1.0.0.
---

# Maven Central

Firefly `1.0.0` is published to Maven Central under the `io.github.fishered` namespace. Spring Boot applications only need the Starter and do not need a private repository or separate Firefly module declarations.

[Browse firefly-spring-boot-starter 1.0.0 on Maven Central](https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.0)

::: info Indexing delay
Search results and regional mirrors can take some time to synchronize after a Central Portal release. The Maven coordinates remain unchanged during this period.
:::

## Maven

```xml
<dependency>
    <groupId>io.github.fishered</groupId>
    <artifactId>firefly-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

Maven Central is Maven's default repository, so no additional `<repositories>` entry is required.

## Gradle

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "io.github.fishered:firefly-spring-boot-starter:1.0.0"
}
```

## Published modules

The Starter resolves its required modules through the published POM dependency chain:

| Artifact | Responsibility |
| --- | --- |
| `scheduler-core` | Scheduling domain model, routing, and storage contracts |
| `plugin-api` | Extension API for external plugins |
| `netty` | Protocol and transport shared by Gateway and Executor |
| `executor-netty` | Netty Executor client used by business services |
| `firefly-spring-boot-autoconfigure` | Executor, job annotation, and Spring lifecycle auto-configuration |
| `firefly-spring-boot-starter` | Single integration entry point for Spring Boot applications |

Applications should not declare these modules separately. Depend on a lower-level artifact directly only when developing a custom transport, client, or plugin.

## Verify dependencies

Refresh Maven metadata and inspect the dependency tree:

```powershell
mvn -U dependency:tree
```

The resolved tree should include `firefly-spring-boot-starter`, `firefly-spring-boot-autoconfigure`, `executor-netty`, `netty`, and `scheduler-core`.

## Version policy

Released Maven Central versions are immutable. Upgrades must use an explicit new version; fixes after `1.0.0` will use a patch release such as `1.0.1`.

