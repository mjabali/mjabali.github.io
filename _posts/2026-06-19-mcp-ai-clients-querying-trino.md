---
layout: post
title: "Giving Your SQL Engine to an LLM: What Breaks When AI Clients Query Trino via MCP"
categories: ai-analytics
---

## Your Query Engine Was Built for Analysts. It Wasn't Built for Agents.

_A field guide to what actually happens when you connect an LLM to a distributed SQL engine like Trino, and the guardrails you need before you let it run._

---

Every analytics platform team is getting the same request right now, in one form or another: _"Can our AI assistant just query the data directly?"_

It sounds like a small ask. You already have Trino. You already have BI tools and notebooks talking to it over standard connectors. Surely pointing an LLM-based client at the same endpoint is just... another connector?

It isn't. Not because the SQL is hard. LLMs are, if anything, unreasonably good at writing SQL. It's because everything *around* the query changes when the thing issuing it is a model instead of a person, and most analytics platforms were never designed with that actor in mind.

I've spent the last two years building the product layer that sits between AI clients, developer environments, and governed analytics infrastructure at Expedia Group. Here's what actually breaks, and what it takes to fix it.

---

## The Naive Version, and Why It Fails Fast

The naive integration looks like this: expose your SQL engine (Trino, in this case) as a tool an LLM can call, via something like the Model Context Protocol (MCP). The model gets a `run_query` tool, maybe a `list_tables` and `get_schema` tool alongside it, and off it goes.

This works great in a demo. It falls apart in the first week of real usage, for reasons that have nothing to do with the model's SQL-writing ability:

- **The model doesn't know what it doesn't know.** A human analyst who gets a cryptic table name pauses and asks a colleague. An LLM will confidently guess at a join key, get it wrong, and produce a plausible-looking wrong answer with total confidence.
- **Discovery is a query too.** `SHOW TABLES` and `DESCRIBE` calls look cheap, but a model exploring a schema it doesn't understand will issue dozens of them per session, often against catalogs with thousands of tables it has no reason to see.
- **There's no "oops."** A person who writes a runaway query watches it spin and cancels it. An agent in a loop will retry, reformulate, and resubmit a bad query pattern faster than any human would, and won't necessarily notice it's stuck.
- **Access control assumptions quietly break.** Your row-level and column-level security was almost certainly designed around named human identities and roles. "The AI client, acting on behalf of user X, inside a session, inside a broader agent workflow" is a different authorization shape than most platforms have modeled.

None of this means don't do it. It means the integration surface is a product, not a wire-up.

---

## What Actually Needs to Exist

Based on what's held up in practice, four things need to be true before an AI client should get real query access to a production SQL engine.

### 1. Schema and governed metadata as a first-class tool, not an afterthought

The single highest-leverage thing you can give a model is a *narrow, curated view* of what it's allowed to see, not raw `information_schema` access. That means:

- Domain- or skill-scoped table registries, so the model's schema discovery is bounded to the handful of tables relevant to the task, not the entire catalog.
- Column-level descriptions and known-good join paths baked into the metadata the model reads, not left for it to infer from naming conventions.
- Freshness and lineage signals surfaced alongside the schema, so the model (and the user reading its output) knows whether it's looking at an authoritative source or a stale copy.

This is the same instinct behind semantic layers and governed data catalogs. It's just now serving a non-human consumer with zero tolerance for ambiguity and infinite patience for asking the wrong question anyway.

### 2. Guardrails that assume the caller will be wrong, a lot

Design the query path assuming a meaningful fraction of generated SQL will be malformed, unbounded, or subtly incorrect, because it will be.

- **Cost and row limits enforced server-side**, not requested politely in a prompt. Prompts are guidance; limits need to be structural.
- **Query validation and static analysis before execution**, catching cartesian joins, missing partition filters, and `SELECT *` against huge tables before they ever hit the cluster.
- **Timeouts and circuit breakers tuned for agent behavior**, which is bursty and retry-heavy in a way human usage patterns aren't.
- **Read-only by default**, full stop, until there's a very deliberate reason and a very deliberate audit trail for anything else.

### 3. Authentication that survives the extra hop

The AI client is rarely the end of the chain. It's a developer environment or a chat interface, acting on behalf of a person, sometimes through an orchestration layer that itself calls other tools. Your platform standards need to answer, concretely:

- Whose permissions apply when the agent queries: the end user's, the service's, or some intersection?
- How does that identity propagate through MCP or whatever protocol you're using, without silently widening to a broad service-account identity because that was the easy path?
- What gets logged, and is it enough to reconstruct *why* a query ran, not just *that* it ran?

Get this wrong and you've either built a system too locked-down to be useful, or one that just handed every chat session standing service-account access to the warehouse.

### 4. Validation and testing standards for a non-deterministic caller

Traditional API testing assumes a deterministic caller. An LLM-driven client is not deterministic. The same task can produce different tool-call sequences on different runs. Your testing and validation approach needs to shift accordingly:

- Test the *tool contract*, not just the SQL output. Is the schema tool returning what the model needs to succeed, or is it forcing guesswork?
- Build a regression suite of realistic agent tasks, not just query correctness tests, and track how often the model needs unplanned retries or clarification as a first-class metric.
- Treat "the model asked a clarifying question instead of guessing" as a success case, and design your tool responses to make that the easy path, not the hard one.

---

## The Pattern Underneath All of This

Strip away the AI framing and this is a familiar product problem: **you're onboarding a new class of consumer to a platform that was built for a different one.** The same instincts that made self-service analytics for humans painful (undocumented schemas, no ownership, unclear cost implications, ambiguous access boundaries) get amplified when the consumer never gets tired, never feels embarrassed about a wrong guess, and can issue a hundred queries before a human notices.

The platforms that get this right aren't the ones with the cleverest prompt engineering. They're the ones that treated "an AI client is now a caller of my analytics platform" as a governance and product design problem first, and a model-capability problem second.

---

## Where to Start, Practically

If you're at the point of getting this request from your own organization, the smallest useful first step is not "connect the LLM to the warehouse." It's:

1. Stand up a **read-only, narrowly-scoped** schema and query tool against a handful of well-understood tables.
2. Put **server-side limits** in front of it before a single real user touches it.
3. Instrument it hard enough that you can answer "what did the model actually do" after the fact, not just "what did it return."

Everything else, broader table registries, richer skills, cross-domain queries, is easier to add once that foundation holds. What's much harder is retrofitting guardrails onto something that's already gained a following inside the company because it was fast to ship.

---

_I'm a Principal Product Manager for Analytics Platform, AI & Data Products at Expedia Group. I write about distributed data systems, AI-assisted analytics, and the platform standards that make both safe to run in production. Follow for more._
