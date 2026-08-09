---
layout: page
sidebar: false
aside: false
pageClass: firefly-home
title: Firefly
description: A lightweight Java 21 scheduling service
---

<script setup>
import { withBase } from 'vitepress';
</script>

<section class="ff-hero">
  <img class="ff-hero-map" :src="withBase('/firefly-scheduler-map.svg')" alt="Firefly scheduler architecture map" />
  <div class="ff-hero-content">
    <p class="ff-kicker">Java 21 scheduler / UTC cursor / Netty executor / JDBC HA</p>
    <h1>Firefly</h1>
    <p class="ff-hero-copy">
      A lightweight scheduling service with clear module boundaries. Firefly separates job definitions, runtime cursors, executor connections, shard leases, and operational APIs so scheduled work stays understandable and reliable.
    </p>
    <div class="ff-actions">
      <a class="ff-button primary" :href="withBase('/en/guide/quick-start')">Quick Start</a>
      <a class="ff-button secondary" :href="withBase('/en/features/')">Technical Components</a>
      <a class="ff-button secondary" href="https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.2">Maven Central</a>
      <a class="ff-button ghost" href="https://github.com/fishered/Firefly">GitHub</a>
    </div>
  </div>
  <div class="ff-hero-strip">
    <span><strong>Java 21</strong>pure Java scheduler core</span>
    <span><strong>IANA ZoneId</strong>job-level time-zone semantics</span>
    <span><strong>JDBC HA</strong>lease and fencing token</span>
    <span><strong>Admin API</strong>external console and JSON API</span>
  </div>
</section>

<section class="ff-section">
  <p class="ff-kicker">v1.0.6 runtime hardening</p>
  <h2>Reliable scheduler recovery with explicit single-node limits</h2>
  <p class="ff-section-lead">
    v1.0.6 adds timing-index recovery, local worker backpressure, batched shard renewal, bounded HTTP executors, and lower revision, drain, and metrics query costs.
  </p>
  <div class="ff-grid">
    <div class="ff-card accent-coral">
      <span class="ff-tag">recovery</span>
      <h3>Reload after failures</h3>
      <p>A failed cursor advance or Outbox write invalidates the TimingIndex so the next tick reloads durable state.</p>
    </div>
    <div class="ff-card accent-lime">
      <span class="ff-tag">backpressure</span>
      <h3>Bounded local execution</h3>
      <p>Virtual threads use explicit admission, FORBID claims atomically, and saturated work returns to the existing Outbox retry path.</p>
    </div>
    <div class="ff-card accent-cyan">
      <span class="ff-tag">coordination</span>
      <h3>Lower coordination cost</h3>
      <p>Shard leases renew in batches, revision checks run independently, metrics reuse snapshots, and HTTP pools are bounded.</p>
    </div>
  </div>
  <div class="ff-actions">
    <a class="ff-button primary" :href="withBase('/en/releases/v1.0.6')">Read the v1.0.6 Release Notes</a>
  </div>
</section>

<section class="ff-section">
  <h2>Built for a scheduler center, light enough to embed</h2>
  <p class="ff-section-lead">
    Firefly can run inside a business process or as a standalone scheduling center. The core does not bind to Spring, HTTP, databases, or a specific transport; those capabilities evolve in integration, transport, store, and plugin modules.
  </p>
  <div class="ff-grid">
    <div class="ff-card accent-lime">
      <span class="ff-tag">core</span>
      <h3>Stable scheduling semantics</h3>
      <p>Cron, fixed-rate, misfire, concurrency policy, and job-level time zones live in the pure Java core.</p>
    </div>
    <div class="ff-card accent-cyan">
      <span class="ff-tag">transport</span>
      <h3>Executor-initiated connections</h3>
      <p>Business services actively register with the gateway through Netty, so they do not need to expose listener ports.</p>
    </div>
    <div class="ff-card accent-amber">
      <span class="ff-tag">store</span>
      <h3>JDBC as the cluster source of truth</h3>
      <p>Job definitions, runtime cursors, shard leases, executions, outbox records, and audits can all be persisted.</p>
    </div>
  </div>
</section>

<div class="ff-band">
  <section class="ff-section ff-flow">
    <div>
      <h2>One path from local runs to clustered deployment</h2>
      <p class="ff-section-lead">
        Start locally with memory or H2, then switch to PostgreSQL or MySQL and split nodes by api, gateway, and scheduler roles.
      </p>
    </div>
    <div class="ff-terminal">
      <div class="ff-terminal-header"><i></i><i></i><i></i></div>
      <div class="ff-terminal-body">
        <span>.\gradlew.bat :server:launcher:run</span>
        <span>.\gradlew.bat :server:launcher:run --args=&quot;--firefly.config.profile=h2&quot;</span>
        <span>Admin UI:  http://127.0.0.1:9720</span>
        <span>Admin API: http://127.0.0.1:9710</span>
        <span>Metrics:   http://127.0.0.1:9711/metrics</span>
      </div>
    </div>
  </section>
</div>

<section class="ff-section">
  <h2>Why Firefly</h2>
  <div class="ff-grid">
    <div class="ff-card accent-coral">
      <h3>Time correctness first</h3>
      <p>Jobs explicitly declare IANA ZoneId values, while runtime state uses UTC Instant values.</p>
    </div>
    <div class="ff-card accent-lime">
      <h3>Restrained core</h3>
      <p>scheduler-core does not depend on web frameworks, IOC containers, databases, or monitoring systems.</p>
    </div>
    <div class="ff-card accent-cyan">
      <h3>Operational visibility</h3>
      <p>Admin UI, Admin HTTP API, Prometheus metrics, and audit logs form a separate operational surface.</p>
    </div>
  </div>
</section>

<div class="ff-band">
  <section class="ff-section">
    <h2>How it compares</h2>
    <p class="ff-section-lead">
      Firefly does not try to become a large workflow platform. It is a lightweight scheduler center for Java systems, remote executor management, job-level time correctness, and clear module boundaries.
    </p>
    <table class="ff-table">
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Firefly</th>
          <th>Traditional schedulers</th>
          <th>Workflow orchestrators</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Positioning</td>
          <td>Lightweight task scheduling service</td>
          <td>Operational task platform</td>
          <td>Complex DAG and dataflow orchestration</td>
        </tr>
        <tr>
          <td>Integration</td>
          <td>Embedded, Spring Boot, standalone Server, remote Executor</td>
          <td>Usually center service plus executor agent</td>
          <td>Tasks must fit workflow models</td>
        </tr>
        <tr>
          <td>Boundary</td>
          <td>Pure Java core with independent plugins and transports</td>
          <td>Platform features often couple with scheduling core</td>
          <td>Scheduling, dependency graph, and state machine are deeply tied</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

<section class="ff-section">
  <div class="ff-cta">
    <div>
      <h2>Start scheduling with Firefly</h2>
      <p>Run the local Server and Admin UI first, then connect Spring Boot jobs or Netty remote executors.</p>
    </div>
    <div class="ff-actions">
      <a class="ff-button primary" :href="withBase('/en/guide/quick-start')">Read Quick Start</a>
      <a class="ff-button secondary" :href="withBase('/en/releases/')">Read Release Note</a>
      <a class="ff-button secondary" :href="withBase('/en/community/requirements')">Submit Requests</a>
    </div>
  </div>
</section>
