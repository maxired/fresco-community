// fake sdk, used for local developemt
window.addEventListener("load", (event) => {
  console.log("load");
  window.fresco._listeners.forEach((listener) => listener());
});

window.fresco.onStateChanged = (callback) => {
  window.fresco.setState = (state) => {
    window.fresco.element.state = { ...window.fresco.element.state, ...state };
    callback();
  };
};

window.fresco.initialize = (state, config) => {
  window.fresco.element = {
    state,
  };
  window.fresco.localParticipant = {
    permission: {
      canEdit: true,
    },
  };
};
