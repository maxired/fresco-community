import "./style";
import { useEffect, useState } from "preact/hooks";

const MAX_ANSWER_CHARACTERS = 50;
const ANSWERS_STORAGE = "answers";

const initialState = {
  question: "What is your favorite color?",
  maxAnswersPerParticipant: 1,
  blurAnswersUntilParticipantAnswers: false,
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
          color: "transparent",
          "text-shadow": "0 0 8px #000",
        }
      : {};

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
      <h1 style={{ margin: 0 }}>{fresco?.element?.state?.question}</h1>
      <h2>Answers</h2>
      {answers.length ? (
        <ul>
          {answers.map((answer) => (
            <li key={answer.id} style={answerStyle}>
              {answer.value}{" "}
              {answer.ownerId === fresco.element.ownerId && (
                <button onClick={(e) => deleteAnswer(e, answer.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No answers yet, add your own!</p>
      )}
      {canAddAnswer && (
        <form>
          <input
            type="text"
            name="comment"
            placeholder="Add your answer"
            value={newAnswerText}
            maxLength={MAX_ANSWER_CHARACTERS}
            onChange={(e) => setNewAnswerText(e.target.value)}
          />
          <button onClick={addAnswer}>Add answer</button>
        </form>
      )}
      <button
        onClick={(e) => {
          answers.forEach((a) => fresco.storage.remove(ANSWERS_STORAGE, a.id));
          e.preventDefault();
        }}
      >
        Clear all answers
      </button>
      <button
        onClick={(e) => {
          fresco.setState(initialState);
          e.preventDefault();
        }}
      >
        Reset
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
