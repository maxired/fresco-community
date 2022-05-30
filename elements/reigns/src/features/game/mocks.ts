import * as sdk from "../../sdk";

export const mockSdk = (
  sdkOverride: Partial<IFrescoSdk> = {},
  realtimeOverride: RealtimeTables = {}
) => {
  const realtime: RealtimeTables = {
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
        set: (tableName: string, key: string, value: string) => {
          if (!key || !tableName) {
            return;
          }

          if (!realtime[tableName]) {
            realtime[tableName] = {};
          }

          realtime[tableName][key] = value;
        },
        get: (tableName: string, key: string) => {
          return realtime[tableName] && realtime[tableName][key];
        },
        all: (tableName: string) => realtime[tableName],
      },
    },
    ...sdkOverride,
  } as unknown as IFrescoSdk);
};
