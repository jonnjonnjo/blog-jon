// Long-form essay styling — Substack / LessWrong inspired.
// Usage:
//   #import "_essay.typ": essay
//   #show: essay.with(
//     title: "My Essay",
//     subtitle: "An optional dek",
//     date: "2026-05-20",
//   )

#let essay(
  title: none,
  subtitle: none,
  author: "Jonathan Arthurito Aldi Sinaga",
  date: none,
  body,
) = {
  set document(
    title: if title != none { title } else { "essay" },
    author: author,
  )

  set page(
    paper: "a4",
    margin: (x: 1.75in, y: 1.25in),
  )

  // Spectral — Google's modern long-form serif.
  set text(
    font: ("Spectral", "EB Garamond", "Linux Libertine", "New Computer Modern"),
    size: 11pt,
    lang: "en",
  )

  set par(
    leading: 0.75em,
    spacing: 1.2em,
    first-line-indent: 0pt,
    justify: true,
    linebreaks: "optimized",
  )

  set heading(numbering: none)
  show heading: it => {
    v(1.6em, weak: true)
    it
    v(0.4em, weak: true)
  }
  show heading.where(level: 1): set text(size: 1.4em, weight: "semibold")
  show heading.where(level: 2): set text(size: 1.15em, weight: "semibold")
  show heading.where(level: 3): set text(size: 1em, weight: "regular", style: "italic")

  show quote.where(block: true): it => block(
    inset: (left: 1em, y: 0.3em),
    stroke: (left: 2pt + luma(180)),
    text(style: "italic", it.body),
  )

  show raw.where(block: false): it => box(
    fill: luma(245),
    inset: (x: 3pt),
    outset: (y: 3pt),
    radius: 2pt,
    text(font: ("IBM Plex Mono", "DejaVu Sans Mono"), size: 0.92em, it),
  )

  show raw.where(block: true): it => block(
    fill: luma(245),
    inset: 10pt,
    radius: 4pt,
    width: 100%,
    text(font: ("IBM Plex Mono", "DejaVu Sans Mono"), size: 0.92em, it),
  )

  show link: it => underline(offset: 2pt, it)

  show footnote.entry: it => {
    set text(size: 0.88em)
    set par(leading: 0.55em)
    it
  }

  // Title block — inline, no separate cover page
  if title != none {
    text(size: 1.9em, weight: "bold")[#title]
    if subtitle != none {
      linebreak()
      v(0.3em, weak: true)
      text(size: 1.15em, fill: luma(110), style: "italic")[#subtitle]
    }
    v(0.6em, weak: true)
    text(size: 0.88em, fill: luma(120))[
      #author
      #if date != none [· #date]
    ]
    v(0.5em)
    line(length: 100%, stroke: 0.5pt + luma(220))
    v(1.5em)
  }

  body
}
