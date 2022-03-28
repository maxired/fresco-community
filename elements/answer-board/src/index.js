import "./style";
import { useEffect, useState } from "preact/hooks";

const MAX_ANSWER_CHARACTERS = 50;
const ANSWERS_STORAGE = "answers";

const initialState = {
  question: "What is your favorite color?",
  maxAnswersPerParticipant: 1,
  blurAnswersUntilParticipantAnswers: false,
};

const style = {
  question: {
    padding: 20,
    margin: 0,
    borderBottom: "1px black solid",
  },
  answers: {
    display: "flex",
    flexWrap: "wrap",
    padding: 0,
    margin: 0,
  },
  answer: {
    backgroundColor: "#94B300",
    width: 140,
    height: 140,
    padding: 5,
    margin: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    fontSize: 20,
    textAlign: "center",
    border: "solid 1px black",
  },
  delete: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 5,
    fontWeight: "bold",
  },
  yourAnswerContainer: {
    marginTop: 10,
    padding: 10,
  },
  yourAnswerTextbox: {
    padding: 10,
    fontSize: 16,
  },
  yourAnswerButton: {
    padding: 10,
    marginLeft: 10,
    fontSize: 16,
  },
};

const Home = () => {
  const [count, updateCount] = useState(0);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!fresco) {
      return;
    }

    fresco.onReady(() => {
      setReady(true);
      fresco.onStateChanged(() => {
        updateCount((c) => c + 1);
      });
      fresco.initialize(initialState, {
        title: "Answer Board",
        autoAdjustHeight: true,
        toolbarButtons: [
          {
            title: "Question",
            ui: { type: "string" },
            property: "question",
          },
          {
            title: "Max answers per participant",
            ui: { type: "number" },
            property: "maxAnswersPerParticipant",
          },
          {
            title: "Blur answers until participant answers?",
            ui: { type: "checkbox" },
            property: "blurAnswersUntilParticipantAnswers",
          },
        ],
      });
    });
  }, []);

  if (!ready) {
    return <h1>Initialising...</h1>;
  }

  const answers = fresco.element?.storage[ANSWERS_STORAGE] || [];

  const myAnswerCount = answers.filter(
    (a) => a.ownerId === fresco.element.ownerId
  ).length;

  const allowedAnswers = fresco.element.state.maxAnswersPerParticipant;
  const canAddAnswer = myAnswerCount < allowedAnswers;
  const hasAnswered = myAnswerCount > 0;

  const answerStyle =
    !hasAnswered && fresco.element.state.blurAnswersUntilParticipantAnswers
      ? {
          ...style.answer,
          color: "transparent",
          "text-shadow": "0 0 8px #000",
        }
      : style.answer;

  const addAnswer = (e) => {
    const value = newAnswerText.trim();
    if (value) {
      fresco.storage.add(ANSWERS_STORAGE, value);
      setNewAnswerText("");
    }
    e.preventDefault();
  };

  const deleteAnswer = (e, id) => {
    e.preventDefault();
    fresco.storage.remove(ANSWERS_STORAGE, id);
  };

  return (
    <div>
      <h1 style={style.question}>{fresco?.element?.state?.question}</h1>
      {canAddAnswer && (
        <div style={style.yourAnswerContainer}>
          <form>
            <input
              style={style.yourAnswerTextbox}
              type="text"
              name="comment"
              placeholder="Add your answer"
              value={newAnswerText}
              maxLength={MAX_ANSWER_CHARACTERS}
              onChange={(e) => setNewAnswerText(e.target.value)}
            />
            <button style={style.yourAnswerButton} onClick={addAnswer}>
              Add answer
            </button>
          </form>
        </div>
      )}
      {answers.length ? (
        <ul style={style.answers}>
          {answers.map((answer) => (
            <li key={answer.id} style={answerStyle}>
              {answer.value}{" "}
              {answer.ownerId === fresco.element.ownerId && (
                <button
                  onClick={(e) => deleteAnswer(e, answer.id)}
                  style={style.delete}
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers yet, add your own!</p>
      )}
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
