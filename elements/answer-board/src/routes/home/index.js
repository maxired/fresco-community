import { h } from "preact";
import { useState } from "preact/hooks";
import style from "./style.css";

const initialState = { items: [] };

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

class FrescoShim {
  get _state() {
    const state = localStorage.getItem("fresco-shim-state");
    return state ? JSON.parse(state) : initialState;
  }

  get element() {
    return { state: this._state };
  }

  setState(state) {
    localStorage.setItem("fresco-shim-state", JSON.stringify(state));
  }
}

const getFrescoSdk = () => window.fresco ?? new FrescoShim();

const Home = () => {
  const [itemValue, setItemValue] = useState("");
  const forceUpdate = useForceUpdate();
  const addItem = () => {
    if (itemValue && itemValue.trim()) {
      getFrescoSdk().setState({
        items: [...getFrescoSdk().element.state.items, itemValue.trim()],
      });
      setItemValue("");
    }
  };

  const deleteItem = (ix) => {
    console.log("deleting item", ix);
    getFrescoSdk().setState({
      items: getFrescoSdk().element.state.items.filter((_, i) => i !== ix),
    });
    forceUpdate();
  };

  console.log("items", getFrescoSdk().element.state);

  const items = getFrescoSdk().element.state.items;

  return (
    <div class={style.home}>
      <h1 style={{ margin: 0 }}>Answer BOard</h1>
      <p>This is the answer-board component.</p>
      <h2>Answers</h2>
      {items.length ? (
        <ul>
          {items.map((item, ix) => (
            <li key={ix}>
              {item} <button onClick={() => deleteItem(ix)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers yet, add your own!</p>
      )}
      <form>
        <input
          type="text"
          name="comment"
          placeholder="Add your answer"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
        />
        <button onClick={addItem}>Add item</button>
      </form>
    </div>
  );
};

export default Home;
