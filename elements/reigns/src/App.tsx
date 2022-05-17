import React, { Dispatch, useEffect, useRef } from "react";
import { Meters } from "./Meters";
import { Question } from "./Question";
import { NoAnswer } from "./NoAnswer";
import { YesAnswer } from "./YesAnswer";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  answerNo,
  answerYes,
  initializeGame,
  startGame,
  updateGame,
} from "./features/game/gameSlice";
import { GamePhase } from "./constants";
import { AppState } from "./features/game/types";

const FRESCO_STORAGE_PARTICIPANT_LOGS_TABLE = "participants_log";

const useOnFrescoStateUpdate = () => {
  const dispatch = useDispatch();
  const prevLocalParticipantRef = useRef<{
    id: string | null;
    isInsideElement: boolean | null;
  }>({ id: null, isInsideElement: null });

  return (updateFrescoState: () => void) => {
    const state = fresco.element.state;
    dispatch(updateGame(state));

    if (
      fresco.localParticipant.id !== prevLocalParticipantRef.current.id ||
      fresco.localParticipant.isInsideElement !==
        prevLocalParticipantRef.current.isInsideElement
    ) {
      fresco.storage.add(FRESCO_STORAGE_PARTICIPANT_LOGS_TABLE, {
        id: fresco.localParticipant.id,
        isInsideElement: fresco.localParticipant.isInsideElement,
      });
      prevLocalParticipantRef.current = {
        ...fresco.localParticipant,
      };
    }

    const partipantsState = (
      fresco.element.storage?.[FRESCO_STORAGE_PARTICIPANT_LOGS_TABLE] ?? []
    ).reduce((memo, entry) => {
      if (
        !entry.value ||
        !entry.value.id ||
        !(
          fresco.remoteParticipants.ids.includes(entry.value.id) ||
          fresco.localParticipant.id === entry.value.id
        ) // only computing logs for currently connected participants
      ) {
        return memo;
      }

      const log = entry.value;
      if (!memo[log.id]) {
        memo[log.id] = { ...log };
        return memo;
      }

      memo[log.id] = { ...memo[log.id], ...log };
      return memo;
    }, {});

    const doCheckVote = (
      partipantsState: Record<string, { answer: string }>
    ) => {
      const results = Object.values(partipantsState).reduce(
        (memo, participant) => {
          if (participant.answer === "yes") {
            memo.answerYes++;
          } else if (participant.answer === "no") {
            memo.answerNo++;
          } else {
            memo.waitingForAnswer++;
          }

          return memo;
        },
        {
          answerNo: 0,
          answerYes: 0,
          waitingForAnswer: 0,
        }
      );

      if (results.waitingForAnswer === 0) {
        if (results.answerNo > results.answerYes && results.answerNo > 0) {
          dispatch(answerNo());
          updateFrescoState();
        } else if (
          results.answerYes > results.answerNo &&
          results.answerYes > 0
        ) {
          dispatch(answerYes());
          updateFrescoState();
        }
      }
    };

    doCheckVote(partipantsState);
  };
};

const useFresco = function (onUpdate: (updateState: () => void) => void) {
  const store = useStore<AppState>();
  const updateFrescoState = () => {
    const state = store.getState();
    console.log("updateFrescoGameState", state);
    fresco.setState({
      phase: state.game.phase,
      selectedCard: state.game.selectedCard,
      stats: state.game.stats,
    });
  };

  const teleport = (
    target: string,
    targetPrefix = `${fresco.element.appearance.NAME}-`
  ) =>
    fresco.send({
      type: "extension/out/redux",
      payload: {
        action: {
          type: "TELEPORT",
          payload: { anchorName: `${targetPrefix}${target}` },
        },
      },
    });

  useEffect(() => {
    fresco.onReady(function () {
      fresco.onStateChanged(() => onUpdate(updateFrescoState));

      const defaultState = {
        selectedCard: null,
        phase: GamePhase.LOADING,
        stats: [],
        gameUrl: "games/gdpr.json",
      };

      fresco.initialize(defaultState, {
        title: "Reigns",
        toolbarButtons: [
          {
            title: "Game url",
            ui: { type: "string" },
            property: "gameUrl",
          },
        ],
      });
    });
  }, []);

  return { updateFrescoState, teleport };
};

export default function App() {
  const phase = useSelector((state: AppState) => state.game.phase);
  const selectedCard = useSelector(
    (state: AppState) => state.game.selectedCard
  );
  const currentStats = useSelector((state: AppState) => state.game.stats);
  const gameUrl = useSelector((state: AppState) => state.game.gameUrl);
  const gameDefinition = useSelector(
    (state: AppState) => state.game.definition
  );

  const localParticipantVote = (answer: string) =>
    fresco.storage.add(FRESCO_STORAGE_PARTICIPANT_LOGS_TABLE, {
      id: fresco.localParticipant.id,
      answer,
    });

  const prevSelectionCardRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    // reseting vote on card change
    if (prevSelectionCardRef.current !== selectedCard?.selectionId) {
      prevSelectionCardRef.current = selectedCard?.selectionId;
      localParticipantVote("");
      teleport("neutral");
    }
  }, [selectedCard]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameUrl) {
      return;
    }
    dispatch(initializeGame(gameUrl) as any);
  }, [gameUrl]);

  const { updateFrescoState, teleport } = useFresco(useOnFrescoStateUpdate());

  useEffect(() => {
    if (phase === GamePhase.STARTED) {
      const yesListener = fresco.subscribeToGlobalEvent(
        "custom.reign.yes",
        () => {
          localParticipantVote("yes");
        }
      );

      const noListener = fresco.subscribeToGlobalEvent(
        "custom.reign.no",
        () => {
          localParticipantVote("no");
        }
      );

      return () => {
        yesListener();
        noListener();
      };
    }
  }, [phase]);

  const doStartGame = () => {
    dispatch(startGame());
    updateFrescoState();
  };

  if (phase === GamePhase.LOADING) {
    return <div className="death">Loading...</div>;
  }

  if (phase === GamePhase.ERROR) {
    return <div className="death">ERROR :(</div>;
  }

  if (phase === GamePhase.ENDED) {
    return (
      <div className="death" onClick={doStartGame}>
        {gameDefinition?.deathMessage}
      </div>
    );
  }

  if (phase === GamePhase.NOT_STARTED) {
    return (
      <div className="death" onClick={doStartGame}>
        Click to start
      </div>
    );
  }

  if (!selectedCard) {
    return null;
  }

  return (
    <>
      <Meters stats={currentStats} />
      <Question card={selectedCard} />
      <div className="answers">
        <NoAnswer text={selectedCard.answer_no || "No"} />
        <div className="answer answer--neutral" />
        <YesAnswer text={selectedCard.answer_yes || "Yes"} />
      </div>
    </>
  );
}
