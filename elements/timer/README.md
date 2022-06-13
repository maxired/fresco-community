# Configure the hosts file

1. Open & Edit your hosts file

- On mac (in terminal):
```
    sudo vi /etc/hosts
```
- On Windows:
```
    c:\windows\system32\drivers\etc\hosts
```

2. Add an entry in hosts

```
    127.0.0.1 dev-community.fres.co
```

4. Test the host resolution with Ping

```
    ping dev-community.fres.co
```

**If the Ping respond, the host resolution is correctly configured ✅**

# Set up your web server
To respond to https://dev-community.fres.co/ 

1. Into points to the root of the repo, install & launch https-localhost

```
    npx https-localhost
```

2. Go to your element to test the HTTPS server, example:

```
    https://dev-community.fres.co/elements/timer/index.htm
```

**If you see the timer, the server is correctly launched ✅**

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
