# answer-board

Implements an extension that allows a designer to ask a question and participants to respond to the question. Answers are persisted across sessions and users can see each other's answers.

## Options

- Question
- Max answers per participant
- Blur answers until participant answers

## Build

Clone this repo then:

```bash
cd elements/answer-board
npm i
npm build
```

## Develop locally

After building, run the following from root:

```bash
npx http-server-ssl -S
```

Then:

1. Open the https link, accept the self-signed certificate.
1. Navigate to elements/answer-board/build
1. Change the url from `https://` to `extension://` and paste into a fresco space
