---
layout: post
title: "Who's Actually Validating the AI's SQL? A Governance Gap Nobody's Solved"
categories: ai-analytics
---

## The Query Ran Successfully. That's Not the Same as Correct.

_Every AI-assisted analytics platform ships with a line buried in the docs that says the user is responsible for validating the output. Almost nobody has built anything that makes that actually happen._

---

Go read the fine print on most AI-assisted analytics tools shipping today, the kind that let a chat interface or coding assistant query a data warehouse on your behalf, and you'll find some version of the same sentence: the user is responsible for independently validating any SQL, result set, or interpretation before it's used to support a real decision.

It's the right sentence to write. It's also, almost everywhere I've seen it, the entire governance model. A disclaimer, not a system.

That gap is worth naming directly, because it's not a minor rough edge. It's the single biggest thing standing between "AI-assisted analytics is a neat productivity feature" and "AI-assisted analytics is something an organization can actually trust its decisions on."

---

## Why "The User Should Check It" Isn't Nothing, But Isn't Enough

There's a reason every platform lands on some version of this disclaimer: it's true. A model can write plausible, syntactically correct SQL that joins the wrong tables, aggregates at the wrong grain, or silently drops rows through a filter that looked reasonable but wasn't. Nobody wants to claim the AI's output is trustworthy by default, because it isn't.

But putting the responsibility on the user, full stop, quietly assumes the user is equipped and motivated to actually do that checking. In practice:

- **The people most likely to lean on an AI assistant for SQL are often the people least equipped to spot a subtle mistake in it.** That's not a knock on them; it's the whole point of the tool. If you already knew exactly which tables to join and how to handle the edge cases, you probably didn't need the assistant's help drafting the query.
- **A confident, well-formatted answer doesn't invite scrutiny.** A model that returns a number with a clean sentence around it looks a lot more finished than a human colleague saying "I think it's around this, let me double check." The AI's presentation style actively works against the instinct to verify it.
- **Validation takes real effort, and effort gets skipped under deadline pressure.** "Please independently verify the source tables, joins, filters, time windows, and business meaning" is a real checklist. It's also exactly the kind of checklist that gets skipped when the number is needed for a meeting in twenty minutes and it looks plausible.

None of this means the disclaimer is wrong to include. It means it can't be the whole answer.

---

## What an Actual System, Instead of a Disclaimer, Looks Like

If "the user must validate" is going to mean something, the platform has to make validation cheap, visible, and hard to skip by accident, rather than an unaided act of discipline.

**Show the work, not just the answer.** The generated SQL, not just the result, should be sitting right next to the output by default, not one click away in an expandable section nobody opens. If a user can't glance at the query and immediately see which tables and filters were used, they can't validate anything, and they know it, and they'll skip the step because it feels like starting from scratch.

**Surface the load-bearing assumptions the model made, explicitly.** Which time window did it default to? Did it assume a table without a documented "current" flag meant the latest snapshot? Did it pick a join key because it was the only plausible-looking match, without confirming cardinality? A model that surfaces "here's what I assumed, and here's what I wasn't sure about" gives a user something concrete to check. A model that just returns a number gives them nothing to grab onto.

**Make provenance and freshness part of the answer, not something you have to go dig for separately.** If the underlying table hasn't been updated in three weeks, or the query hit a known-stale replica, that belongs in the response, not buried in a data catalog the user would have to think to check.

**Track validation as a first-class signal, not an afterthought.** If a platform can distinguish "a user looked at this, understood the query, and confirmed it" from "a user glanced at a number and moved on," that distinction is worth capturing. It's the difference between output that's been through a governance step and output that's merely been produced.

**Calibrate friction to consequence.** A quick exploratory question doesn't need the same validation ceremony as a number that's about to appear in an exec deck or feed an automated decision. Treating every AI-generated query with identical friction either over-burdens the low-stakes cases or, more likely, trains people to click through the friction reflexively, which defeats the purpose for the high-stakes ones too.

---

## The Uncomfortable Part: Accountability Doesn't Disappear, It Just Gets Vague

Here's the part that doesn't get solved by better UI alone. When a wrong number from an AI-assisted query ends up in a decision, and it eventually surfaces as wrong, who's actually accountable?

In a fully human workflow, this is at least traceable: someone wrote the query, someone reviewed it or didn't, someone signed off on using the result. Insert an AI client into that chain and the accountability doesn't disappear, but it gets diffuse in a way that's easy for everyone involved to quietly assume is somebody else's problem. The user assumes the tool wouldn't have surfaced something so clearly wrong. The platform team assumes the disclaimer they wrote covers them. The model, obviously, isn't accountable to anyone.

That diffusion is exactly the governance gap. Fixing it isn't purely a product problem, it also needs organizational clarity: what level of AI-assisted analysis is fine for exploratory, low-stakes use without sign-off, versus what tier of decision requires a named human to have actually verified the query before it's used. Most organizations haven't drawn that line yet. The platforms that do this well are the ones that make where the line is obvious, not just documented.

---

## Where to Actually Start

You don't need a fully worked-out policy framework before you ship anything. The smallest useful step is making the disclaimer true in the cases that matter most:

1. **Always show the generated SQL alongside the answer**, by default, not behind a toggle. This alone does more for real validation than any policy document.
2. **Pick one high-stakes surface, a scheduled report, a dashboard feeding a business review, whatever carries the most weight in your org, and require an explicit human confirmation step before AI-generated output reaches it.** Don't try to gate everything on day one.
3. **Log what was, and wasn't, validated**, even crudely, so you can actually see the gap between "AI produced this" and "a human confirmed this" instead of assuming it's small.

The disclaimer isn't wrong. It's just not a governance model on its own, and treating it like one is the part worth fixing before it's someone else's incident to explain.

---

_I'm a Principal Product Manager for Analytics Platform, AI & Data Products at Expedia Group. I write about distributed data systems, AI-assisted analytics, and the platform standards that make both safe to run in production. Follow for more._
