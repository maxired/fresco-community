window.fresco = window.fresco || {
  _listeners: [],
  onReady: function (callback) {
    window.fresco._listeners.push(callback);
  },
  setState: () => {},
};

const referrer = document.referrer.replace(/\/$/, "");
const headElement = document.querySelector("head");
let cssHeader = document.createElement("link");
cssHeader.ref = "stylesheet";
cssHeader.href = `${referrer}/sdk.css`;

let sdkHeader = document.createElement("script");
sdkHeader.type = "text/javascript";
sdkHeader.src = `${referrer}/sdk.js`;

headElement.append(cssHeader);
headElement.append(sdkHeader);
