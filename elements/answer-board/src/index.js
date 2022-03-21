import "./style";
import { useEffect, useState } from "preact/hooks";

const Home = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!fresco) {
      return;
    }

    fresco.onReady(() => {
      fresco.onStateChanged(() => {
        setItems(fresco.element.state.items ?? []);
      });
      console.warn("ready, fresco:", fresco.element.state);
      // if (!fresco.element.state?.items?.map) {
      //   // bad state, throw it all away
      //   console.warn("bad items");
      //   fresco.setState({ items: [] });
      // } else setItems(fresco.element.state.items);
      fresco.initialize(
        {},
        {
          title: "Answer Board",
          autoAdjustHeight: true,
          toolbarButtons: [
            {
              title: "Answers",
              ui: { type: "string", multiLine: true },
              property: "items",
            },
          ],
        }
      );
    });
  }, []);

  const [itemValue, setItemValue] = useState("");

  const addItem = (e) => {
    if (itemValue && itemValue.trim()) {
      const newItems = [...items, itemValue];
      setItems(newItems);
      fresco.setState({ items: newItems });
      setItemValue("");
    }
    e.preventDefault();
  };

  const deleteItem = (e, ix) => {
    e.preventDefault();
    console.log("deleting item", ix);
    const newItems = fresco.element.state.items.filter((_, i) => i !== ix);
    setItems(newItems);
    fresco.setState({ items: newItems });
  };

  return (
    <div>
      <h1 style={{ margin: 0 }}>Answer Board</h1>
      <p>This is the answer-board component.</p>
      <h2>Answers</h2>
      {items.length ? (
        <ul>
          {items.map((item, ix) => (
            <li key={ix}>
              {item} <button onClick={(e) => deleteItem(e, ix)}>Delete</button>
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

export default function App() {
  return (
    <div>
      <Home />
    </div>
  );
}
