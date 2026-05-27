#import "_essay.typ": essay

#show: essay.with(
  title: "On the Quiet Hours",
  subtitle: "A dummy post — testing the essay template",
  date: "2026-05-20",
)

There is a particular quality to the hours just before dawn. The world has not yet remembered itself, and so neither, perhaps, have we. It is in this brief suspension that thinking becomes possible — not the goal-directed thinking of meetings and tasks, but the wandering kind, the kind that follows its own logic.

== On Beginnings

Every essay must begin somewhere, and the choice of beginning is already an argument. To start with a story is to say: this is the kind of truth that lives in particulars. To start with a definition is to say: first we must agree on what we are talking about.

This is a block quote, the sort of thing a long essay leans on heavily:

#quote(block: true)[
  The unexamined life is not worth living.
]

== On Code

Sometimes essays bleed into the technical. Here is a small piece of inline code: `const x = 42`. And here is a block:

```python
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

== On Footnotes

A philosophical essay without footnotes is barely an essay at all#footnote[This is, of course, an overstatement. But not by much.]. They are the conversation underneath the conversation.

== A Closing Thought

The dawn arrives, eventually. The world remembers itself. But for a few hours, something else was possible.
