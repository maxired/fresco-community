```
extension://dev-community.fres.co/elements/score-keeper/index.htm
```


```
const bc = new BroadcastChannel('fresco-community-score-keeper_channel');
bc.postMessage({ action: 'GivePoints', payload: { points: { type: 'coin', value: 1 } }});

```

