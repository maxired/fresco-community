import { Game } from "./Game";
import { render } from "@testing-library/react";
import { getWrapper, mockSdk } from "./mocks";
import { createStore } from "./store";
import { initializeGame, updateGame } from "./features/game/gameSlice";
import {
  createCard,
  createGameDefinition,
  createGameState,
} from "./features/game/objectMother";
import { Game as GamePersistence } from "./features/game/Game";
import { Card } from "./features/game/types";
import "@testing-library/jest-dom";
import { persistGameVote } from "./features/voting/persistence";
import { updateVote } from "./features/voting/votingSlice";

jest.mock("textfit");

const renderGame = ({
  card = createCard(),
  store = createStore(),
}: Partial<{
  card: Card;
  store: ReturnType<typeof createStore>;
}>) => {
  const gameDefinition = createGameDefinition({
    cards: [card],
  });
  let game = new GamePersistence().startGame(createGameState(gameDefinition));
  const state = game.retrieve();

  store.dispatch({
    type: initializeGame.fulfilled.type,
    payload: gameDefinition,
  });

  store.dispatch(
    updateGame({
      flags: state.flags,
      phase: state.phase,
      round: state.round,
      selectedCard: state.selectedCard,
      stats: state.stats,
      previouslySelectedCardIds: state.previouslySelectedCardIds,
    })
  );

  return render(<Game />, {
    wrapper: getWrapper(store),
  });
};

describe("Game", () => {
  beforeEach(() => {
    mockSdk();
  });
  it("should render 'No' answer", () => {
    const card = createCard({ answer_no: "No!!!" });

    const { getByText } = renderGame({ card });

    expect(getByText("No!!!")).toBeInTheDocument();
  });

  it("should render 'Yes' answer", () => {
    const card = createCard({ answer_yes: "Yes!!!" });

    const { getByText } = renderGame({ card });

    expect(getByText("Yes!!!")).toBeInTheDocument();
  });

  it("should render question", () => {
    const card = createCard({ card: "Question!!!" });

    const { getByText } = renderGame({ card });

    expect(getByText("Question!!!")).toBeInTheDocument();
  });

  it("should render countdown", () => {
    const store = createStore();

    const { getByTestId } = renderGame({ store });
    persistGameVote({ answer: "Yes", countdown: 3 });
    store.dispatch(updateVote());

    expect(getByTestId("countdown")).toHaveTextContent("3...");
  });
});
