import "./style";
import { useEffect, useState } from "preact/hooks";

const Home = () => {
  const [answers, setAnswers] = useState([]);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!fresco) {
      return;
    }

    fresco.onReady(() => {
      setReady(true);
      fresco.onStateChanged(() => {
        console.log(
          "state updated!",
          fresco.element.state,
          fresco.element.publicState
        );
        setAnswers(fresco.element.publicState?.answers ?? []);
      });
      fresco.initialize(
        {
          question: "What is your favorite color?",
          maxAnswersPerParticipant: 1,
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
            {
              title: "Max answers per participant",
              ui: { type: "number" },
              property: "maxAnswersPerParticipant",
            },
          ],
        }
      );
    });
  }, []);

  if (!ready) {
    return null;
  }

  const addAnswer = (e) => {
    const value = newAnswerText.trim();
    if (value) {
      const newAnswers = [
        ...answers,
        { ownerId: fresco.element.participantId, value: value },
      ];
      setAnswers(newAnswers);
      fresco.setPublicState({ answers: newAnswers });
      setNewAnswerText("");
    }
    e.preventDefault();
  };

  const deleteAnswer = (e, ix) => {
    e.preventDefault();
    console.log("deleting answer", ix);
    const newAnswers = fresco.element.state.answers.filter((_, i) => i !== ix);
    setAnswers(newAnswers);
    fresco.setPublicState({ answers: newAnswers });
  };

  const myAnswerCount = answers.filter(
    (a) => a.ownerId === fresco.element.participantId
  ).length;
  const allowedAnswers = fresco.element.state.maxAnswersPerParticipant;
  const canAddAnswer = myAnswerCount < allowedAnswers;

  return (
    <div>
      <h1 style={{ margin: 0 }}>{fresco?.element?.state?.question}</h1>
      <h2>Answers</h2>
      {answers.length ? (
        <ul>
          {answers.map((answer, ix) => (
            <li key={ix}>
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
