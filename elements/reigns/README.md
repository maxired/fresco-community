[x] Change meter visual
[x] Load cards from json
[x] Pick next card to show
[x] Set stats on decision
[x] Decide on click
[x] Death
[x] Max 100
[ ] Weighing

# reigns

Implements an extension that allows a designer to re-create the reigns game on any topic.

## Add to your fresco space

Paste this link into your space:

```
extension://fres-co.github.io/fresco-community/elements/reigns/dist/
```

## Build

Clone this repo then:

```bash
cd elements/reigns
npm i
npm run build
```

## Develop locally

```bash
npm run dev
```

Change `https://` to `extension://` and paste into a fresco space.

Note: Chromium's self-signed certificate warning prompt can be disabled for `localhost` via <chrome://flags/#allow-insecure-localhost>
