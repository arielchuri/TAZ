# Concepts

## Identity & Matching Without User Accounts

**What it is:** A way to associate data with a person and match records to each
other without building authentication (no login, passwords, sessions, or a
`users` table). Instead, a plain `name` field stored on each record acts as the
identity and the *join key* between a person and their entries.

**Why it matters:** Accounts add a lot of weight (storage, security, sessions)
that small, trusted, offline-first apps don't need. For TAZ's Give & Take board,
the only thing a match actually requires is enough info for two people to find
each other. The `name` on each entry provides exactly that, while staying within
the project's "flat JSON, no databases, offline-first" constraints. As a bonus,
grouping records by `name` yields implicit profiles ("everything Anna offers")
for free — no auth needed.

**Example:** Matching needs to offers by shared `item`, carrying the name along:

```js
// skills.json (offers) and needs.json (requests) — each entry carries a name.
function findMatches(needs, skills) {
  return needs.map((need) => ({
    need,
    offers: skills.filter((s) => s.item === need.item), // match on item
  }));
}
// → "Anna offers a Ladder" can be surfaced next to "Sam needs a Ladder".
```

**Gotcha:** Identity is honor-based — anyone can type any name, and two people
named "Sam" are indistinguishable. That's acceptable for a small trusted
community but would not be safe for anything requiring real authorization or
private data. If you later need uniqueness, add an opt-in identifier (a short
handle or "where to find me" hint) rather than reaching for full accounts.
