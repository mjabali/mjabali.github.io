---
layout: post
title: "An Introduction to Trino"
categories: sql-engines
---

## Why Your Data Is Still Holding You Hostage, And How Trino Sets It Free

_A practical introduction to the distributed SQL engine quietly powering analytics at Netflix, Pinterest, LinkedIn, and beyond._

---

You've been there. A business stakeholder asks a question that sounds simple: _"Can you combine our customer data with the latest transaction logs and that user behavior data we're collecting in S3?"_

And you know, before you even check Slack, that the answer is not going to be simple. The customer data lives in PostgreSQL. The transaction logs are in a different schema on a different system managed by a different team. The behavioral data? Parquet files in an S3 bucket, queryable only through a Hive table that someone set up two years ago and nobody fully understands anymore.

This is the hidden tax of modern data infrastructure. Not the storage costs. Not the compute. The _friction_. The endless wrangling of data from siloed, incompatible systems before you can even begin to answer a question.

I've spent years working on SQL engines, and I can tell you: this problem doesn't get smaller as companies grow. It gets more complex. And it's exactly the problem that Trino was built to solve.

---

## The Real Problem with Big Data

When people talk about "big data challenges," they usually mean scale: petabytes of data, thousands of concurrent queries, sub-second response times. That's real. But it's only half the story.

The other half is diversity.

Today's organizations don't run one data system. They run many: relational databases for transactional workloads, object stores like S3 or Azure Blob for raw data, NoSQL systems like Cassandra or MongoDB for operational data, Kafka for event streams, Elasticsearch for search and log data. Each system exists for a good reason. Each one does something specific very well.

But here's the trap: every one of those systems speaks a different language. Has a different API. Requires different expertise to query. And keeps its data firmly in its own corner of your infrastructure.

The classic response to this was the data warehouse: extract data from all these systems, transform it, load it into a central repository, and query it there. ETL pipelines running nightly batch jobs, carefully maintained schemas, dedicated data engineering teams keeping it all in sync.

It works. But it's expensive, brittle, and slow. By the time the data lands in your warehouse, it may already be stale. And if the data you need _today_ isn't already part of the ETL pipeline, getting it added is a weeks-long project with approvals and backlogs.

The data lake was supposed to fix this: dump everything into one place and figure it out later. But in practice, it often became a data swamp: technically accessible, practically impenetrable.

---

## Enter Trino: SQL-on-Anything

Trino is an open source, distributed SQL query engine. That description undersells it.

What makes Trino distinctive, and genuinely powerful, is a deceptively simple architectural choice: **Trino doesn't store data. It queries data where it lives.**

Think about what that means. Instead of moving your data to meet your query engine, Trino moves the query to meet your data. Your PostgreSQL tables, your S3 Parquet files, your Kafka topics, your Elasticsearch indices: Trino treats all of them as data sources, accessible through standard ANSI SQL.

You want to join customer records from your operational database with purchase history in your data warehouse and behavioral events in your data lake, all in a single query? In Trino, that's not a project. It's a query.

```sql
SELECT
    c.customer_id,
    c.name,
    dw.lifetime_value,
    COUNT(e.event_id) AS recent_events
FROM postgresql.public.customers c
JOIN warehouse.sales.customer_summary dw ON c.customer_id = dw.customer_id
JOIN hive.events.user_actions e ON c.customer_id = e.user_id
WHERE e.event_date >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY 1, 2, 3
ORDER BY recent_events DESC;
```

That query spans three different systems. To Trino, it's routine.

This is what the Trino community calls **federated queries**: a single SQL statement that reaches across entirely different data systems simultaneously. No pre-joining required. No data movement. No ETL pipeline standing between your question and your answer.

---

## The Performance Angle: Why Not Just Use Hive?

Trino wasn't the first attempt at querying large distributed datasets with SQL. Apache Hive had been doing it at Facebook since 2008. At its peak, Facebook's Hive warehouse was 250 petabytes in size, handling hundreds of users running tens of thousands of queries per day.

And Hive was hitting its limits. Not on volume: Hive could store and batch-process enormous datasets. But on _interactivity_. Hive was built for batch workloads: you submit a job, it runs MapReduce, it eventually returns results. Analysts waiting hours for query results can't iterate quickly. They stop asking questions.

In 2012, four Facebook engineers started building something new from scratch. The goal: maintain Hive's scale while delivering the response times analysts actually needed. The result was Presto, which, after a naming evolution driven by a fork, became Trino in late 2020.

The performance comes from architectural choices that are baked in at every level:

- **In-memory parallel processing**: data stays in memory between pipeline stages instead of being written to disk between steps
- **Pipelined execution across cluster nodes**: as soon as one stage produces output, downstream stages can begin consuming it
- **Multithreaded execution**: every CPU core in the cluster stays busy
- **Bytecode generation**: Trino compiles query plans into optimized JVM bytecode at runtime

For users, these translate into one thing: queries that used to take three days now take fifteen minutes. And queries that would have been cost-prohibitive to run at all are suddenly viable.

---

## Separation of Storage and Compute, Before It Was Cool

One of Trino's most forward-looking design decisions was separating storage from compute. Today, this is a buzzword that every cloud data warehouse uses in its marketing. In 2012, it was a genuinely novel architectural choice.

Because Trino doesn't own any storage, you can scale your query compute independently from your data. Have a month-end analytics spike? Scale up your Trino cluster for that period, then scale it back down. Your data doesn't move, your storage costs don't change, and you're not paying for compute capacity you don't need the other 27 days of the month.

This is fundamentally different from traditional data warehouse architectures, where compute and storage are tightly coupled and scaling one requires scaling the other.

---

## The Use Cases That Matter

Trino's flexibility means it gets used differently at different companies. A few patterns show up repeatedly:

**The Universal Analytics Access Point.** Point all your BI tools (Tableau, Looker, Power BI, whatever) at a single Trino endpoint. Behind the scenes, Trino connects to every data source in your organization. Your analysts use the SQL they already know, and they never have to care which underlying system holds which data.

**The Virtual Data Warehouse.** Instead of building and maintaining expensive ETL pipelines to move data into a central warehouse, use Trino to query data in place. Define your semantic layer in Trino views. Let the business query those views without ever knowing (or needing to know) where the underlying data actually lives.

**The Data Lake Query Engine.** Trino was born as a Hadoop/HDFS query engine, and it remains excellent at this. With connectors for modern table formats like Apache Iceberg and Delta Lake, it's a first-class query engine for the modern data lakehouse stack.

**ETL Without the E and L.** With Trino, many traditional ETL workflows can be replaced with ELT: Extract, Load (into your lake as-is), and Transform using Trino queries. Or skip the pipeline altogether and transform on the fly at query time.

---

## A Word on Where Trino Fits (and Doesn't)

It's worth being precise about what Trino is not.

Trino is **not a database**. It has no storage of its own. It can't replace your operational PostgreSQL instance or your transactional MySQL database.

Trino is **not optimized for OLTP** (online transaction processing). If you need sub-millisecond point lookups, Trino is not your tool. It's built for OLAP: complex analytical queries across large datasets.

And Trino is **not magic**. The performance you get depends on how your underlying data sources are structured, how well they support predicate pushdown to Trino's connector layer, and how your cluster is sized. Getting the most out of Trino, especially at scale, requires care.

But for analytical workloads on diverse data sources, it's genuinely hard to beat.

---

## Why This Matters Now

Data infrastructure is at an inflection point. The old dichotomy, monolithic data warehouse _or_ chaotic data lake, is giving way to something more nuanced: a distributed, federated query layer that meets data where it lives, regardless of format or storage system.

Trino sits at the center of this shift. It's running in production at Netflix, Pinterest, LinkedIn, Lyft, Shopify, and dozens of other companies handling massive scale. Amazon built Athena on top of it. Starburst built an enterprise data platform around it.

And it's open source, actively maintained, and genuinely improving with every release.

If you're working in the data space, as an engineer, analyst, architect, or product person, understanding Trino is increasingly part of the baseline. Not because it's the only tool in the toolbox, but because it represents a fundamentally sound approach to a problem that isn't going away: the proliferation of data across incompatible, siloed systems.

The data isn't going to consolidate itself. Trino meets it where it is.

---

_I'm a Product Manager for SQL Engines at Expedia Group. I write about distributed data systems, query engines, and the infrastructure decisions that shape how organizations access and understand their data. Follow for more._
