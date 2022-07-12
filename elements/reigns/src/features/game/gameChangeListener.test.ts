import { AppState } from "../../store";
import { getSdk } from "../../sdk";
import { detectGameChange } from "./gameChangeListener";
import { mockSdk } from "./mocks";
import { createGameState } from "./objectMother";
import { setHost } from "../host/persistence";
import { HostState } from "../host/hostSlice";
import { Card, GameState } from "./types";
import { Game } from "./Game";
import { PARTICIPANT_VOTE_TABLE } from "../voting/persistence";

describe("gameChangeListener", () => {
  beforeEach(() => {
    mockSdk(undefined, {
      [PARTICIPANT_VOTE_TABLE]: {
        ["some-participant"]: "Yes",
      },
    });
    jest.clearAllMocks();
  });
  describe("detectGameChange", () => {
    it("should not clear votes not host", () => {
      const otherHost = {
        id: "someone-else",
        name: "whatever",
      };
      setHost(otherHost);
      detectGameChange(
        {
          game: createGameState(undefined, { gameUrl: "original-url" }),
          host: {
            currentHost: otherHost,
          } as HostState,
        } as AppState,
        {
          game: { gameUrl: "new-url" } as GameState,
        } as AppState
      );

      const votes = Object.keys(
        getSdk().storage.realtime.all(PARTICIPANT_VOTE_TABLE)
      );
      expect(votes).not.toHaveLength(0);
    });
    it("should not clear votes if initializing", () => {
      const localParticipant = getSdk().localParticipant as Participant;
      setHost(localParticipant);

      detectGameChange(
        {
          game: createGameState(undefined, { gameUrl: null }),
          host: {
            currentHost: localParticipant,
          } as HostState,
        } as AppState,
        {
          game: { gameUrl: "new-url" } as GameState,
        } as AppState
      );

      const votes = Object.keys(
        getSdk().storage.realtime.all(PARTICIPANT_VOTE_TABLE)
      );
      expect(votes).not.toHaveLength(0);
    });

    it("should clear votes if game is changed", () => {
      const localParticipant = getSdk().localParticipant as Participant;
      setHost(localParticipant);

      detectGameChange(
        {
          game: createGameState(undefined, { gameUrl: "old-url" }),
          host: {
            currentHost: localParticipant,
          } as HostState,
        } as AppState,
        {
          game: { gameUrl: "new-url" } as GameState,
        } as AppState
      );

      const votes = Object.keys(
        getSdk().storage.realtime.all(PARTICIPANT_VOTE_TABLE)
      );
      expect(votes).toHaveLength(0);
    });

    it("should change if designer cards updates from empty", () => {
      const localParticipant = getSdk().localParticipant as Participant;
      setHost(localParticipant);
      const gameChangedSpy = jest.spyOn(Game.prototype, "changeGame");

      detectGameChange(
        {
          game: createGameState(undefined, { gameUrl: "old-url" }),
          host: {
            currentHost: localParticipant,
          } as HostState,
        } as AppState,
        {
          game: {
            gameUrl: "new-url",
            designerCards: [{ card: "A new card" }],
          } as GameState,
        } as AppState
      );

      expect(gameChangedSpy).toHaveBeenCalled();
    });

    it("should change if designer cards update", () => {
      const localParticipant = getSdk().localParticipant as Participant;
      setHost(localParticipant);
      const gameChangedSpy = jest.spyOn(Game.prototype, "changeGame");

      detectGameChange(
        {
          game: createGameState(undefined, {
            gameUrl: "old-url",
            designerCards: [{ card: "A different card" } as Card],
          }),
          host: {
            currentHost: localParticipant,
          } as HostState,
        } as AppState,
        {
          game: {
            gameUrl: "new-url",
            designerCards: [{ card: "A new card" }],
          } as GameState,
        } as AppState
      );

      expect(gameChangedSpy).toHaveBeenCalled();
    });

    it("should not change if designer cards stays the same", () => {
      const localParticipant = getSdk().localParticipant as Participant;
      setHost(localParticipant);
      const gameChangedSpy = jest.spyOn(Game.prototype, "changeGame");

      detectGameChange(
        {
          game: createGameState(undefined, {
            gameUrl: "same-url",
            designerCards: [{ card: "The same card" } as Card],
          }),
          host: {
            currentHost: localParticipant,
          } as HostState,
        } as AppState,
        {
          game: {
            gameUrl: "same-url",
            designerCards: [{ card: "The same card" }],
          } as GameState,
        } as AppState
      );

      expect(gameChangedSpy).not.toHaveBeenCalled();
    });
  });
});
