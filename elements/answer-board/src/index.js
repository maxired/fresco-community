import "./style";
import { useEffect, useState } from "preact/hooks";

const MAX_ANSWER_CHARACTERS = 50;

const initialState = {
  question: "What is your favorite color?",
  maxAnswersPerParticipant: 1,
  blurAnswersUntilParticipantAnswers: false,
};

const Home = () => {
  const [count, updateCount] = useState(0);
  console.log("render", count);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!fresco) {
      return;
    }

    fresco.onReady(() => {
      setReady(true);
      fresco.onStateChanged(() => {
        console.log(`state updated ${count}`, fresco.element);
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

  const answers = fresco.element.publicState?.answers ?? [];

  const myAnswerCount = answers.filter(
    (a) => a.ownerId === fresco.element.participantId
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
      const newAnswers = [
        ...answers,
        { ownerId: fresco.element.participantId, value: value },
      ];
      fresco.setPublicState({ answers: newAnswers });
      setNewAnswerText("");
    }
    e.preventDefault();
  };

  const deleteAnswer = (e, ix) => {
    e.preventDefault();
    console.log("deleting answer", ix);
    const newAnswers = answers.filter((_, i) => i !== ix);
    fresco.setPublicState({ answers: newAnswers });
  };

  return (
    <div>
      <h1 style={{ margin: 0 }}>{fresco?.element?.state?.question}</h1>
      <h2>Answers</h2>
      {answers.length ? (
        <ul>
          {answers.map((answer, ix) => (
            <li key={ix} style={answerStyle}>
              {answer.value}{" "}
              {answer.ownerId === fresco.element.participantId && (
                <button onClick={(e) => deleteAnswer(e, ix)}>Delete</button>
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
          fresco.setPublicState({ answers: [] });
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
