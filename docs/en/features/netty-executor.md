---
title: Netty Executor
description: Remote executor registration, heartbeat, trigger, and result reporting.
---

# Netty Executor

Netty is Firefly's default remote Executor transport. It handles long-lived connections, registration, heartbeat, trigger commands, ACK, and result reporting.

## Protocol Boundary

```text
REGISTER_EXECUTOR
HEARTBEAT
TRIGGER_JOB
ACK_JOB
REPORT_RESULT
UNREGISTER_EXECUTOR
```

Business services actively connect to the gateway. The scheduler center finds online instances by executorName and sends trigger commands.

## Spring Boot Configuration

```yaml
firefly:
  executor:
    name: billing-executor
    instance-id: ${HOSTNAME:billing-service-local}
    auto-start: true
    gateway-addresses:
      - firefly-1:9700
      - firefly-2:9700
    service-name: billing-service
    integration-key: ${FIREFLY_INTEGRATION_KEY}
    idempotency-directory: /data/firefly-executor-results
```

An executor is ready to receive jobs only after it receives the `REGISTERED` response from Gateway.
