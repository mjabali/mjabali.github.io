---
layout: post
title: "Two MCP Servers, Not One: Why We Split Data Access From Analytics Workflow"
categories: ai-analytics
---

# The Query Is the Easy Part. Where It Lives Afterward Is the Hard Part.

_A case for splitting "let an AI query your data" and "let an AI produce durable analytics work" into two separate tools, not one._

---

In my last post, I laid out what breaks when you connect an LLM to a production SQL engine, and the guardrails needed to make that safe. There's a design decision underneath all of it that's worth pulling out on its own, because it's easy to get wrong in a way that only shows up months later: **should "run a query" and "turn that query into something durable" be the same tool, or two different ones?**

Every team I've seen tackle this starts by building one tool. It queries data, and it also saves the result somewhere useful. It feels efficient. It is, for about three months. Then it starts to strain, because those two jobs want fundamentally different properties.

---

## Two Jobs Wearing One Hat

Think about what "let an AI work with our data" actually decomposes into.

**Job one: exploration.** An analyst, or an agent acting on their behalf, doesn't yet know which tables matter, what the join keys are, whether a column means what its name implies, or whether the data behind it is even fresh. This phase is fast, disposable, and wrong a lot of the time on the way to being right. Nobody needs a permanent record of the fourteen wrong queries it took to find the correct join.

**Job two: persistence and collaboration.** Once a query is validated, it stops being disposable. Someone wants to run it again next week. Someone else wants to see it, comment on it, schedule it, or build a dashboard on top of it. This phase cares about ownership, versioning, scheduling, and discoverability, none of which matter during exploration.

A single tool that does both ends up compromising on both. Make it optimized for fast, disposable exploration, and you get a mess of ungoverned, undocumented queries scattered everywhere once people start relying on them. Make it optimized for durable, governed artifacts, and every exploratory question turns into ceremony that discourages the exploration you wanted to enable in the first place.

---

## The Split: A Data-Engine Layer and a Workflow Layer

The pattern that's held up in practice is to treat these as two separate MCP servers with a clear boundary between them.

**A data-engine server** sits directly in front of your query engine. Its entire job is read-only exploration: list catalogs and schemas, inspect table structure, explain a query plan, run a SELECT and see what comes back. It has no concept of "save this" or "share this." It's deliberately narrow, and that narrowness is the point, because it means the guardrails on it can also be narrow and strict: read-only enforcement, row caps, short-lived sessions. There's a small, well-defined blast radius to reason about.

**A workflow server** sits a layer up, in whatever tool your organization already uses to manage durable analytics work (a notebook platform, a BI tool's saved-query layer, whatever plays that role for you). Its job is to take a query that's already been drafted and validated and turn it into something with a lifecycle: a saved document, a scheduled run, a shared asset with comments and an owner. It doesn't need direct query-engine credentials of its own in the same sense. It operates on top of queries that have already been proven out.

The two are meant to be used in sequence, not in competition: explore and validate against the data-engine server, then hand the finished query to the workflow server once it's actually worth persisting.

---

## Why This Is a Better Shape Than One Do-Everything Tool

**Different failure modes want different blast radii.** A bad exploratory query is annoying. It wastes some compute and some of the model's context. A bad _persisted_ query, one that got scheduled and is now feeding a dashboard someone checks every Monday, is a business problem. Keeping those two failure modes behind two different tools means you can be more conservative with the one that has more downstream consequence, without throttling the one that's supposed to be fast and cheap to use.

**Ownership and governance land in the right place.** Nobody wants to govern every ad hoc SELECT a model runs while it's figuring out a join key. Everybody should want to govern what gets scheduled to run every night against production data, or what gets shared as a "trusted" analytics asset to the rest of the org. Splitting the tools means governance effort concentrates where it actually needs to, on the workflow layer, instead of being either absent everywhere or oppressive everywhere.

**Each tool gets simpler, not harder, to build well.** A tool that only does read-only exploration can be extremely opinionated about safety: strict row limits, aggressive timeouts, no write path to reason about at all. A tool that only does persistence and scheduling can be extremely opinionated about lifecycle: versioning, ownership transfer, access review. Neither has to compromise to also handle the other's job.

**It matches how good analysts already work.** Nobody sits down and writes a perfectly scheduled, shared, documented query on the first try. They poke around, run some throwaway queries, get it wrong a couple of times, and only once they've landed on something correct do they think about saving and sharing it. The two-tool split isn't imposing a new workflow on people; it's giving an AI client the same two-phase shape that already reflects how the work happens.

---

## Where This Can Go Wrong

The split only pays off if the boundary stays clean. A few ways I've seen it erode:

- **Letting the workflow tool get its own direct query-engine access "for convenience."** The moment it can run arbitrary SQL against the engine directly instead of operating on already-validated queries, you've quietly recreated the single do-everything tool, just with two names.
- **Treating the data-engine tool as also being the place users go to save things**, because it's the one they're already using. If persistence starts happening there informally, undocumented "temporary" queries become permanent fixtures nobody governs.
- **Not making the handoff obvious.** If it isn't clear to a user (or the model acting for them) that "you're done exploring, now go persist this," people either persist too early, before validation, or never persist at all and just keep re-running the exploratory version by habit.

None of these are architecture problems so much as discipline problems. The two-server boundary works as long as the intended handoff, explore here, persist there, stays the obvious path rather than something people have to be reminded of.

---

## The Underlying Principle

Strip away the MCP framing and this is a familiar lesson from API design: **a tool's guarantees should match its job, and a tool trying to do two jobs with different guarantees ends up doing neither one well.** Read-only exploration wants to be cheap, fast, and forgiving of dead ends. Durable analytics assets want to be governed, owned, and stable. Those aren't two settings on the same dial. They're two different tools.

If you're standing up AI-facing data access today and it's tempting to build one tool that does the querying and the saving, that instinct is understandable, and it's also the thing to resist. Build the boundary in from the start. It's a lot easier than trying to cut a single overloaded tool in half once people already depend on it doing both jobs badly.

---

_I'm a Principal Product Manager for Analytics Platform, AI & Data Products at Expedia Group. I write about distributed data systems, AI-assisted analytics, and the platform standards that make both safe to run in production. Follow for more._
