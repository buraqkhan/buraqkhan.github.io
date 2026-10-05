---
title: Undo the last Git commit
topic: Git
date: 2026-10-04
---

Keep the changes, drop the commit:

```bash
git reset --soft HEAD~1
```

Discard the changes too (careful — this is destructive):

```bash
git reset --hard HEAD~1
```

If the commit was already pushed, prefer `git revert HEAD` so history isn't rewritten.
