---
title: 提交需求
description: 如何向 Firefly 提交需求、问题和改进建议。
---

# 提交需求

欢迎通过 GitHub Issues 提交需求、问题和改进建议：

[打开 Firefly Issues](https://github.com/fishered/Firefly/issues)

## 建议包含的信息

- 你的使用场景：嵌入式、Spring Boot、独立 Server 或远程 Executor
- 期望行为：你希望 Firefly 如何调度、派发、重试或展示
- 当前行为：如果是问题，请提供日志、配置和复现步骤
- 运行环境：JDK、数据库、部署方式和节点角色
- 风险边界：是否涉及时区、DST、集群切换、任务幂等或执行超时

## 需求类型

| 类型 | 示例 |
|---|---|
| 功能增强 | 新的 transport、告警插件、任务模板 |
| 文档改进 | 快速开始、部署说明、API 示例 |
| 运维能力 | 节点 drain、死信重放、审计查询 |
| 兼容性 | 数据库方言、Spring Boot 版本、JDK 版本 |

对于行为变更类需求，请尽量说明是否影响已有任务语义。
