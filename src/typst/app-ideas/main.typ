#import "@preview/flow-way:0.2.0": *


#show: flow.with(
  title: "App Ideas",
)

= 中文 language helper
== Description
- Must run blazingly fast. So, it could run instance of it in just miliseconds
- Must have a chatbotlike feature to talk to app model
- The model that used should be a small model so that
  - from 中文to 英语
    1. it will have a full meaning of the word/sentence
    2. it will do character-wise breakdown where each 汉字will have its own semantic meaning
  - from 英语to中文
    1. it will have a full translate of the 英语word in 中文
    2. it will also do the character-wise breakdown in 中文
== Tech Stack
- Jetpack Compose for UI
- LangDetect to differentiate between 中文和英语
- Local Model (Qwen ? )
