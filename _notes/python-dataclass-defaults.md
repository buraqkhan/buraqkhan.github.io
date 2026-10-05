---
title: Mutable defaults in dataclasses
topic: Python
date: 2026-09-28
---

Never use a mutable value directly as a default. Use `field(default_factory=...)`:

```python
from dataclasses import dataclass, field

@dataclass
class Config:
    tags: list[str] = field(default_factory=list)
```

Dataclasses actually raise `ValueError` for `list`, `dict`, and `set` defaults, but
other mutable objects slip through silently.
