#import "@preview/noteworthy:0.3.0": *

#show: noteworthy.with(
  paper-size: "a4",
  font: "New Computer Modern",
  language: "EN",
  title: "中文app",
  // header-title: "Header Title", // Optional: The document title will be used instead of it if it is absent
  date: "2026-05-04", //Optional: Current system date will be used if this is absent
  author: "jon",
  // contact-details: "https://example.com", // Optional: Maybe a link to your website, or phone number
  toc-title: "Table of Contents",
  // watermark: "DRAFT", // Optional: Watermark for the document
)

= Requirements
1. I want the application to be able to translate a string to a string. More formally, I want :
  - The app to be able to translate a text from 中文 to 英文, such that
    - it gives the full meaning of translation in 英文
    - for each 汉字 in the input，it gives the semantic meaning of each 汉字
  - The app to be able to translate a text from 英文 to 中文, such that
    - it gives the full meaning of translation in 中文
    - for each 汉字in the output, it gives the semantic meaning of each 汉字
  - The app to be able to translate from a string with mixed language to 中文，such that
    - it gives the full meaning translation in  中文
    - for each 汉字in the output, it gives the semantic meaning of each 汉字

2. I want the library to be created as SDK so that I could create it in different platform (such as android, web, etc)

= Example

1. 中文
```
TranslationResult(
    input       = "我喜欢学习中文",
    fullMeaning = "I like studying Chinese",
    breakdown   = [
        TokenBreakdown("我",   CHINESE, "wǒ",       "I / me"),
        TokenBreakdown("喜欢", CHINESE, "xǐ huān",  "to like / to enjoy"),
        TokenBreakdown("学习", CHINESE, "xué xí",   "to study / to learn"),
        TokenBreakdown("中文", CHINESE, "zhōng wén","Chinese language")
    ]
)
```

2. 英文
```
TranslationResult(
    input       = "I like studying Chinese",
    fullMeaning = "我喜欢学习中文",
    breakdown   = [
        TokenBreakdown("我",   CHINESE, "wǒ",       "I / me"),
        TokenBreakdown("喜欢", CHINESE, "xǐ huān",  "to like / to enjoy"),
        TokenBreakdown("学习", CHINESE, "xué xí",   "to study / to learn"),
        TokenBreakdown("中文", CHINESE, "zhōng wén","Chinese language")
    ]
)
```
3. Mixed
```
TranslationResult(
    input       = "我like学习中文",
    fullMeaning = "我喜欢学习中文",
    breakdown   = [
        TokenBreakdown("我",   CHINESE, "wǒ",       "I / me"),
        TokenBreakdown("喜欢", CHINESE, "xǐ huān",  "to like / to enjoy"),
        TokenBreakdown("学习", CHINESE, "xué xí",   "to study / to learn"),
        TokenBreakdown("中文", CHINESE, "zhōng wén","Chinese language")
    ]
)
```

= Architecture
Previously, I just wanted to create only android app. But after thinking more about it, I think
I should create it in several platofrm. Because of that, the main engine of the app should be decoupled from the app
Hence, I will explain the diagram of the main translation engine before diving it into each platform.

== Translation flow
#image("translation_routing_diagram.svg")
== Flow Diagram
#image("overall_architecture.svg")
== Android
