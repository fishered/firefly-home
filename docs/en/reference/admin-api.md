---
title: Admin API
description: Firefly Admin HTTP JSON API reference.
---

# Admin API

Admin HTTP API lives in `apis/admin-http` and listens on:

```text
http://127.0.0.1:9710
```

Admin UI listens on `http://127.0.0.1:9720` and proxies browser-side `/api/*` requests to Java Admin HTTP API.

## Implementation boundary

Admin API continues to use JDK `HttpServer`, with runtime responsibilities separated as follows:

```text
AdminHttpPlugin             assembly, startup, and shutdown
AdminHttpRouter             route matching
AdminRouteRegistration      route, controller, and policy binding
AdminAuthorizationService   authentication and role decisions
AdminRequestReader          request-body and JSON boundaries
Admin*Controller            domain operations
AdminHttpResponder          consistent JSON and error responses
```

Authorization no longer checks business path strings such as `/api/users` or `/trigger`. Each route group receives an `AdminRoutePolicy` during registration, so a new endpoint must declare its access role and path reorganization cannot silently change permissions.

## Roles and request limits

| Role | Typical access |
|---|---|
| `READER` | `GET` and `HEAD` queries |
| `OPERATOR` | Job changes, manual triggers, execution cancellation, and Outbox requeue |
| `ADMIN` | Users, Integration Keys, and management actions without a narrower policy |

Login, health, and other public endpoints use an explicit anonymous policy. Admin API also enforces shared limits for request bodies, page sizes, and batch operations before a domain controller runs. These controls are server-side security boundaries; hiding a button in Admin UI is not authorization.

## Authentication

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/auth/config` | Check whether Admin authentication is enabled |
| `POST` | `/api/auth/login` | Log in with username and password, returns Bearer Token |
| `GET` | `/api/integration-key` | Check whether Executor Integration Key is configured |
| `POST` | `/api/integration-key` | Generate or rotate Integration Key; plaintext is returned once |

## Runtime Status

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/overview` | Overview page data |
| `GET` | `/api/plugins` | Plugin load and runtime status |
| `GET` | `/api/audit` | Admin change audit |

## Jobs

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/jobs` | List jobs |
| `POST` | `/api/jobs` | Create remote job |
| `GET` | `/api/jobs/{jobId}` | Get job details |
| `PUT` | `/api/jobs/{jobId}` | Update job |
| `PATCH` | `/api/jobs/{jobId}` | Enable or disable job |
| `DELETE` | `/api/jobs/{jobId}` | Delete job |
| `POST` | `/api/jobs/{jobId}/trigger` | Trigger job manually |
| `GET` | `/api/jobs/{jobId}/history` | View job change history |

Example:

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

## Executors

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/executors` | Online executor instances |
| `GET` | `/api/executor-definitions` | Logical executor definitions |
| `POST` | `/api/executor-definitions` | Create executor definition |
| `DELETE` | `/api/executor-definitions/{name}` | Delete executor definition |
| `POST` | `/api/executor-definitions/{name}/isolate` | Isolate executor |

## Executions and Outbox

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/executions` | List executions |
| `GET` | `/api/executions/{executionId}` | Execution details |
| `GET` | `/api/executions/root/{rootExecutionId}` | Retry history for one root |
| `POST` | `/api/executions/{executionId}/cancel` | Cancel execution |
| `POST` | `/api/executions/batch-cancel` | Batch cancel |
| `GET` | `/api/outbox/dead` | Dead dispatch records |
| `POST` | `/api/outbox/{outboxId}/requeue` | Requeue dead dispatch |
| `POST` | `/api/outbox/batch-requeue` | Batch requeue |

## Nodes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/nodes` | List nodes |
| `POST` | `/api/nodes/{nodeId}/drain` | Start node drain |
| `POST` | `/api/nodes/{nodeId}/resume` | Resume node |
| `GET` | `/api/nodes/{nodeId}/drain-status` | Check drain status |

## Schedule Helpers

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/schedules/preview` | Preview future fire times |
| `GET` | `/api/schedules/timezones?query=Asia` | Search IANA time zones |

## Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users` | List users |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/{username}` | Update user |
| `DELETE` | `/api/users/{username}` | Delete user |
