import { reducer, frescoUpdate } from "./hostSlice";
import { IS_MOUNTED_TABLE } from "./persistIsMounted";
import * as determineHost from "./determineHost";
import * as sdk from "../../sdk";
import * as mounted from "./persistIsMounted";

const mockSdk = (
  sdkOverride: Partial<IFrescoSdk> = {},
  realtimeOverride: RealtimeTables = {}
) => {
  const { GAME_TABLE, HOST_KEY } = determineHost;
  const realtime: RealtimeTables = {
    [IS_MOUNTED_TABLE]: { id: "my-id" },
    [GAME_TABLE]: {
      [HOST_KEY]: { id: "my-id", name: "my-name" },
    },
    ...realtimeOverride,
  };
  jest.spyOn(sdk, "getSdk").mockReturnValue({
    localParticipant: {
      id: "my-id",
      name: "my-name",
    },
    remoteParticipants: [],
    storage: {
      realtime: {
        get: (tableName: string, key: string) => realtime[tableName][key],
        all: (tableName: string) => realtime[tableName],
        set: jest.fn(),
      },
    },
    ...sdkOverride,
  } as unknown as IFrescoSdk);
};

describe("hostSlice", () => {
  describe("updateHost", () => {
    it("should persist isMounted if not persisted", () => {
      mockSdk(undefined, {
        [IS_MOUNTED_TABLE]: {},
      });
      const spy = jest.spyOn(mounted, "persistIsMounted");
      reducer(
        { currentHost: null, isMounted: true, frescoUpdateCount: 0 },
        frescoUpdate()
      );
      expect(spy).toBeCalled();
    });
  });
});
