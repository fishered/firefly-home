---
layout: page
sidebar: false
aside: false
pageClass: firefly-home
title: Firefly
description: 轻量级 Java 21 定时调度服务
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
      一个轻量级、边界清晰的定时调度服务。它把任务定义、调度游标、执行器连接、分片租约和运维 API 拆成可理解的模块，让调度系统在正确的时间点亮正确的任务。
    </p>
    <div class="ff-actions">
      <a class="ff-button primary" :href="withBase('/guide/quick-start')">快速开始</a>
      <a class="ff-button secondary" :href="withBase('/features/')">查看技术组件</a>
      <a class="ff-button secondary" href="https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.1">Maven Central</a>
      <a class="ff-button ghost" href="https://github.com/fishered/Firefly">GitHub</a>
    </div>
  </div>
  <div class="ff-hero-strip">
    <span><strong>Java 21</strong>纯 Java 调度核心</span>
    <span><strong>IANA ZoneId</strong>任务级时区语义</span>
    <span><strong>JDBC HA</strong>lease + fencing token</span>
    <span><strong>Admin API</strong>独立控制台和 JSON API</span>
  </div>
</section>

<section class="ff-section">
  <h2>为调度中心而生，也适合嵌入式集成</h2>
  <p class="ff-section-lead">
    Firefly 可以作为业务进程内的轻量调度器，也可以作为独立调度中心运行。核心模块不绑定 Spring、HTTP、数据库或特定通信协议，外部能力通过 integration、transport、store 和 plugin 自然扩展。
  </p>
  <div class="ff-grid">
    <div class="ff-card accent-lime">
      <span class="ff-tag">core</span>
      <h3>调度语义先稳定</h3>
      <p>cron、fixed-rate、misfire、并发策略、任务级时区都放在纯 Java core 中，减少运行时框架对语义的影响。</p>
    </div>
    <div class="ff-card accent-cyan">
      <span class="ff-tag">transport</span>
      <h3>远程执行器主动连接</h3>
      <p>业务服务通过 Netty 主动注册到 gateway，不需要业务侧暴露公网端口，适合微服务和容器环境。</p>
    </div>
    <div class="ff-card accent-amber">
      <span class="ff-tag">store</span>
      <h3>JDBC 作为集群事实源</h3>
      <p>任务定义、运行游标、shard lease、execution 和 outbox 都可落库，支持节点重启、接管和审计。</p>
    </div>
  </div>
</section>

<div class="ff-band">
  <section class="ff-section ff-flow">
    <div>
      <h2>从本地运行到集群部署，路径保持一致</h2>
      <p class="ff-section-lead">
        本地可以用 memory 或 H2 快速验证；生产可以切换到 PostgreSQL 和 MySQL JDBC 存储，并按 api、gateway、scheduler 三类角色拆分节点。
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
  <h2>为什么选 Firefly</h2>
  <div class="ff-grid">
    <div class="ff-card accent-coral">
      <h3>时间正确性优先</h3>
      <p>任务显式声明 IANA ZoneId，运行态统一使用 UTC Instant，避免默认时区和 DST 规则把任务悄悄带偏。</p>
    </div>
    <div class="ff-card accent-lime">
      <h3>核心克制</h3>
      <p>scheduler-core 不依赖 Web 框架、IOC、数据库或监控系统，集成层可以替换，调度语义保持干净。</p>
    </div>
    <div class="ff-card accent-cyan">
      <h3>运维可观测</h3>
      <p>Admin UI、Admin HTTP API、Prometheus 指标和审计日志形成独立运维面，方便查看任务、节点、执行器和插件状态。</p>
    </div>
  </div>
</section>

<div class="ff-band">
  <section class="ff-section">
    <h2>和同类产品怎么选</h2>
    <p class="ff-section-lead">
      Firefly 不追求覆盖所有工作流场景，它更适合 Java 业务系统里的轻量调度中心、远程执行器管理、任务级时区正确性和可演进的模块边界。
    </p>
    <table class="ff-table">
      <thead>
        <tr>
          <th>维度</th>
          <th>Firefly</th>
          <th>传统任务调度平台</th>
          <th>工作流编排系统</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>定位</td>
          <td>轻量任务调度服务</td>
          <td>偏运维平台和任务管理</td>
          <td>复杂 DAG 和数据流编排</td>
        </tr>
        <tr>
          <td>集成方式</td>
          <td>嵌入式、Spring Boot、独立 Server、远程 Executor</td>
          <td>通常以中心服务和执行器 Agent 为主</td>
          <td>需要按工作流模型改造任务</td>
        </tr>
        <tr>
          <td>核心边界</td>
          <td>纯 Java core，插件和传输层独立</td>
          <td>平台能力与核心调度常耦合</td>
          <td>调度、依赖、状态机深度绑定</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

<section class="ff-section">
  <div class="ff-cta">
    <div>
      <h2>开始把任务交给 Firefly</h2>
      <p>先跑通本地 Server 和 Admin UI，再接入 Spring Boot 或 Netty 远程执行器。</p>
    </div>
    <div class="ff-actions">
      <a class="ff-button primary" :href="withBase('/guide/quick-start')">阅读快速开始</a>
      <a class="ff-button secondary" :href="withBase('/releases/v1.0.1')">查看 v1.0.1 更新</a>
      <a class="ff-button secondary" :href="withBase('/community/requirements')">提交需求</a>
    </div>
  </div>
</section>
