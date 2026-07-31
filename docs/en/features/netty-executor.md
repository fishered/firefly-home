---
title: Netty Executor
description: Remote executor registration, heartbeat, trigger, and result reporting.
---

# Netty Executor

Netty is Firefly's default remote Executor transport. It handles long-lived connections, registration, heartbeat, trigger commands, ACK, and result reporting.

## Module and serialization boundary

```text
transports/netty-protocol   wire records, message types, Jackson JSON codec
transports/netty            Gateway connections and dispatch coordination
clients/executor-netty      business-side Executor Client and idempotency adapters
```

The wire format uses explicit JSON models rather than JDK native serialization. Domain records are mapped to protocol records before Jackson encoding. New fields must account for missing values on older peers, message types, and protocol negotiation; arbitrary domain objects are not written directly to the network.

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

## Result-persistence backpressure

After Gateway receives an ACK or execution result, persistence runs on a dedicated bounded executor rather than a Netty EventLoop. Saturation moves work into a separately bounded delayed-retry area. Attempts, delay, and retry capacity are finite, and shutdown cancels further waiting.

Gateway resumes automatic reads after the worker drops below its low watermark. Exhausted retry attempts or capacity produce an explicit rejection and update the relevant execution state. This absorbs transient database disruption; it is not an infinite buffer, and `1.0.2` does not introduce the still-undefined failure registry.
