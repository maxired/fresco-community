# answer-board

Implements an extension that allows a designer to ask a question and participants to respond to the question. Answers are persisted across sessions and users can see each other's answers.

## Options

- Question
- Max answers per participant
- Blur answers until participant answers

## Add to your fresco space

Paste this link into your space:

```
extension://fres-co.github.io/fresco-community/elements/answer-board/build/
```

## Build

Clone this repo then:

```bash
cd elements/answer-board
npm i
npm run build
```

## Develop locally

```bash
npm run build
npm run serve
```

Browser will open, change `https://` to `extension://` and paste into a fresco space.

Note: Chromium's self-signed certificate warning prompt can be disabled for `localhost` via <chrome://flags/#allow-insecure-localhost>
