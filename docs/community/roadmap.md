---
title: 路线图
description: Firefly 后续演进方向。
---

# 路线图

Firefly 的演进方向保持一个原则：核心调度语义先稳定，平台能力通过独立模块逐步接入。

## 当前版本：v1.2.1

配额预演与容量规划已于 2026-11-07 发布。版本提供无副作用 dry-run、五类资源容量基线、确定性推荐、数据质量标记、Admin 预览—应用闭环和全租户有界导出。

## 近期方向

- 完善 Admin API 文档和请求/响应示例
- 补充更多 Spring Boot Starter 使用案例
- 增强 Admin UI 的执行历史和异常排查能力
- 丰富 Prometheus 告警模板
- 补充外部插件兼容性测试矩阵
- 扩充容量报告的运维示例和真实 PostgreSQL/MySQL 性能基线

## 中期方向

- tracing 插件
- 更多 Executor transport
- 更完整的任务导入导出
- 集群维护工具
- schema 迁移工具链优化
- 弹性额度与突发积分（需要先定义准入和计费边界）

## 长期原则

- 不把 Web、存储、监控和通信协议写进 scheduler-core
- 不让默认时区参与任务语义
- 不在数据库不可用时产生无法 fencing 的新执行
- 不让 Admin UI 和 Java API 重新耦合
- 不自动应用配额建议，不用机器学习把历史峰值包装成容量承诺
