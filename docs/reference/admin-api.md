---
title: Admin API
description: Firefly Admin HTTP JSON API 参考。
---

# Admin API

Admin HTTP API 位于 `apis/admin-http`，默认监听：

```text
http://127.0.0.1:9710
```

Admin UI 默认监听 `http://127.0.0.1:9720`，并将浏览器侧 `/api/*` 代理到 Java Admin HTTP API。

## 实现边界

Admin API 继续使用 JDK `HttpServer`，但运行时职责已拆分：

```text
AdminHttpPlugin             装配、启动和关闭
AdminHttpRouter             路由匹配
AdminRouteRegistration      路由、Controller 与策略绑定
AdminAuthorizationService   认证与角色判定
AdminRequestReader          请求体和 JSON 边界
Admin*Controller            领域操作
AdminHttpResponder          统一 JSON 与错误响应
```

授权层不再检查 `/api/users`、`/trigger` 等业务路径字符串。每组路由在注册时绑定 `AdminRoutePolicy`，新增端点必须同时声明访问角色，因此路径组织变化不会悄悄改变权限。

## 角色与请求限制

| 角色 | 典型权限 |
|---|---|
| `READER` | `GET`、`HEAD` 查询 |
| `OPERATOR` | 修改任务、手动触发、取消执行、重放 Outbox |
| `ADMIN` | 用户、Integration Key 和未单独授权的管理动作 |

登录和健康检查等公开端点使用显式匿名策略。Admin API 还统一限制请求体、分页大小和批量操作数量；超限输入会在进入领域 Controller 前被拒绝。角色规则和限制属于服务端安全边界，不能只依靠 Admin UI 隐藏按钮。

## 认证

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/auth/config` | 查看 Admin 认证是否启用 |
| `POST` | `/api/auth/login` | 使用用户名和密码登录，返回 Bearer Token |
| `GET` | `/api/integration-key` | 查看 Executor Integration Key 是否已配置 |
| `POST` | `/api/integration-key` | 生成或轮换 Integration Key，明文只返回一次 |

登录请求：

```json
{
  "username": "admin",
  "password": "admin"
}
```

响应：

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

## 运行状态

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/health` | 健康检查 |
| `GET` | `/api/overview` | 首页概览数据 |
| `GET` | `/api/plugins` | 插件加载和运行状态 |
| `GET` | `/api/audit` | Admin 变更审计 |

## 任务

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/jobs` | 任务列表 |
| `POST` | `/api/jobs` | 创建远程任务 |
| `GET` | `/api/jobs/{jobId}` | 查看任务详情 |
| `PUT` | `/api/jobs/{jobId}` | 更新任务 |
| `PATCH` | `/api/jobs/{jobId}` | 启停任务 |
| `DELETE` | `/api/jobs/{jobId}` | 删除任务 |
| `POST` | `/api/jobs/{jobId}/trigger` | 手动触发任务 |
| `GET` | `/api/jobs/{jobId}/history` | 查看任务变更历史 |

创建任务示例：

```json
{
  "id": "billing-daily",
  "name": "Daily billing",
  "groupId": "billing",
  "handlerName": "billingHandler",
  "scheduleType": "CRON",
  "scheduleValue": "0 0 2 * * *",
  "zoneId": "Asia/Shanghai",
  "enabled": true
}
```

## 执行器

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/executors` | 在线执行器实例 |
| `GET` | `/api/executor-definitions` | 逻辑执行器定义 |
| `POST` | `/api/executor-definitions` | 创建执行器定义 |
| `DELETE` | `/api/executor-definitions/{name}` | 删除执行器定义 |
| `POST` | `/api/executor-definitions/{name}/isolate` | 隔离执行器 |

## 执行记录和 Outbox

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/executions` | 执行记录列表 |
| `GET` | `/api/executions/{executionId}` | 执行详情 |
| `GET` | `/api/executions/root/{rootExecutionId}` | 同一 root 的重试历史 |
| `POST` | `/api/executions/{executionId}/cancel` | 取消执行 |
| `POST` | `/api/executions/batch-cancel` | 批量取消 |
| `GET` | `/api/outbox/dead` | 死信派发记录 |
| `POST` | `/api/outbox/{outboxId}/requeue` | 重放死信派发 |
| `POST` | `/api/outbox/batch-requeue` | 批量重放 |

## 节点

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/nodes` | 节点列表 |
| `POST` | `/api/nodes/{nodeId}/drain` | 开始节点 drain |
| `POST` | `/api/nodes/{nodeId}/resume` | 恢复节点 |
| `GET` | `/api/nodes/{nodeId}/drain-status` | 查看 drain 状态 |

## 调度辅助

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/api/schedules/preview` | 预览未来触发时间 |
| `GET` | `/api/schedules/timezones?query=Asia` | 搜索可用 IANA 时区 |

## 用户管理

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/users` | 用户列表 |
| `POST` | `/api/users` | 创建用户 |
| `PUT` | `/api/users/{username}` | 更新用户 |
| `DELETE` | `/api/users/{username}` | 删除用户 |
