# Set up

1. Add an entry in hosts:

```
    127.0.0.1 dev-community.fres.co
```

2. Set up your web server to respond to https://dev-community.fres.co/ (points to the root of the repo)

# To add the timer to a fres.co space

1. Copy the following snippet

```
    extension://dev-community.fres.co/elements/timer/index.htm?duration=10
```

2. Paste it in the space

# Source of inspiration

Although we have already deviated from Miro's SDK, it is a good reference.
https://developers.miro.com/docs/how-to-start
https://github.com/miroapp/app-examples/blob/master/miro.d.ts
