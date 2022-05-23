import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { determineHost, GAME_TABLE, HOST_KEY } from "./determineHost";
import { getSdk } from "../../sdk";
import {
  IS_MOUNTED_TABLE,
  persistIsMounted,
  persistIsUnMounted,
} from "./persistIsMounted";

export type HostState = {
  currentHost: Participant | null;
  isMounted: boolean;
};

const initialState: HostState = {
  currentHost: null,
  isMounted: true,
};

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    updateHost: (state) => {
      const sdk = getSdk();
      const hostParams: Parameters<typeof determineHost>[0] = {
        remoteParticipants: sdk.remoteParticipants,
        mounted: sdk.element.storage[IS_MOUNTED_TABLE],
        localParticipant: sdk.localParticipant,
        currentHost: sdk.storage.get(GAME_TABLE, HOST_KEY)?.value,
      };

      state.currentHost = determineHost(hostParams);

      if (
        state.isMounted &&
        !hostParams.mounted.find(
          (p) => p.value === hostParams.localParticipant.id
        )
      ) {
        // storage was cleared
        persistIsMounted();
      }
    },
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
      if (action.payload) {
        persistIsMounted();
      } else {
        persistIsUnMounted();
      }
    },
  },
});

export const {
  reducer,
  actions: { updateHost, setMounted },
} = hostSlice;
