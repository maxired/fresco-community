fresco.onReady(function () {
  const main = document.getElementById("main");

  function render() {
    main.innerHTML = `
        <div>
            <ul>
                ${[
                  "sliderConfigurable",
                  "numberConfigurable",
                  "colorConfigurable",
                  "stringConfigurable",
                  "selectionConfigurable",
                  "actionConfigurable",
                ]
                  .map(
                    (name) => `<li>${name} : ${fresco.element.state[name]}</li>`
                  )
                  .join("")}
            </ul>
        </div>`;
  }

  const defaultState = {
    sliderConfigurable: 12,
    numberConfigurable: 36,
    colorConfigurable: "#ddd",
    stringConfigurable: "Hello",
    selectionConfigurable: "Foo",
    actionConfigurable: "Bar",
  };

  const elementConfig = {
    title: "Configurables",
    toolbarButtons: [
      {
        title: "Number Slider",
        ui: { type: "slider", min: 1, max: 60 },
        property: "sliderConfigurable",
      },
      {
        title: "Number free",
        ui: { type: "number", min: 1, max: 60 },
        property: "numberConfigurable",
      },
      {
        title: "Color",
        ui: { type: "color" },
        property: "colorConfigurable",
      },
      {
        title: "String",
        ui: { type: "string" },
        property: "stringConfigurable",
      },
      {
        title: "Selections",
        ui: { type: "selection", options: ["Foo", "Bar", "Baz"] },
        property: "selectionConfigurable",
      },
      {
        title: "Actions",
        ui: { type: "action", options: ["Foo", "Bar", "Baz"] },
        property: "actionConfigurable",
      },
    ],
  };

  fresco.onStateChanged(function () {
    render();
  });
  fresco.initialize(defaultState, elementConfig);
  render();
});
