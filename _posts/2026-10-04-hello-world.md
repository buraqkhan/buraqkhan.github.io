---
title: Hello, world
description: Why I built this site and what I plan to write about.
tags: [meta]
---

Every engineer eventually builds a personal site. This is mine.

## Why a static site?

Static sites are fast, cheap (free, here), and almost impossible to break.
There is no database, no server to patch, and nothing to log into. Posts are
plain Markdown files in a Git repository, which means they are versioned,
diffable, and portable.

## What to expect

- **Blog** — longer essays on software, systems, and learning.
- **Reading** — a running log of books, with short reactions.
- **Notes** — small, evolving notes. Less polished, more frequent.

Here is some code, to make sure the highlighting works:

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

> Simplicity is prerequisite for reliability. — Edsger Dijkstra

More soon.
