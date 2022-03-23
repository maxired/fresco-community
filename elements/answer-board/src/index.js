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
        console.log(
          "state updated!",
          fresco.element.state,
          fresco.element.publicState
        );
        setItems(fresco.element.publicState?.items ?? []);
      });
      console.warn("ready, fresco:", fresco.element.state);
      fresco.initialize(
        {
          question: "What is your favorite color?",
        },
        {
          title: "Answer Board",
          autoAdjustHeight: true,
          toolbarButtons: [
            {
              title: "Question",
              ui: { type: "string" },
              property: "question",
            },
          ],
        }
      );
    });
  }, []);

  const [itemValue, setItemValue] = useState("");

  const addItem = (e) => {
    const newItem = itemValue.trim();
    if (newItem) {
      const newItems = [...items, newItem];
      setItems(newItems);
      fresco.setPublicState({ items: newItems });
      setItemValue("");
    }
    e.preventDefault();
  };

  const deleteItem = (e, ix) => {
    e.preventDefault();
    console.log("deleting item", ix);
    const newItems = fresco.element.state.items.filter((_, i) => i !== ix);
    setItems(newItems);
    fresco.setPublicState({ items: newItems });
  };

  return (
    <div>
      <h1 style={{ margin: 0 }}>{fresco?.element?.state?.question}</h1>
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
      <button
        onClick={(e) => {
          fresco.setPublicState({ items: [] });
          e.preventDefault();
        }}
      >
        Clear Public State
      </button>
      <button
        onClick={(e) => {
          fresco.setState({ question: "was reset" });
          e.preventDefault();
        }}
      >
        Clear State
      </button>
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
