interface IToolbarButton {
  title: string;
  ui: { type: string };
  property: string;
}

interface IInitializeOptions {
  title: string;
  toolbarButtons: IToolbarButton[];
}

type AppearanceValue =
  | string
  | number
  | boolean
  | Record<string, AppearanceValue>;

type Participant = {
  name: string;
  id: string;
};

type ProtectedStorageItem = {
  ownerId: string;
  id: string;
  value: ProtectedStorageValueType;
};

type RealtimeValue =
  | Record<string, unknown>
  | string
  | boolean
  | undefined
  | null;

type RealtimeKeyValues = { [key: string]: RealtimeValue };

type RealtimeTables = {
  [tableName: string]: RealtimeKeyValues;
};

interface IFrescoSdk {
  onReady(callback: () => void): void;
  onStateChanged(callback: () => void): void;
  subscribeToGlobalEvent(
    eventName: string,
    handler: (event: any) => void
  ): () => void;
  element: {
    state: any;
    id: string;
    name: string;
    appearance: Record<string, AppearanceValue>;
    storage: {
      [tableName: string]: ProtectedStorageItem[];
    };
  };
  realtime: RealtimeTables;
  setState(state: any): void;
  initialize(defaultState: any, options: IInitializeOptions): void;
  send(action: { type: string; payload: any }): void;
  localParticipant: Participant & {
    identityId: string;
    isInsideElement: boolean;
  };
  remoteParticipants: Participant[];
  storage: {
    add: (tableName: string, value: AppearanceValue) => void;
    remove: (tableName: string, id: string) => void;
    clear: (tableName: string) => void;
    set: (tableName: string, id: string, value: AppearanceValue) => void;
    get: (tableName: string, id: string) => ProtectedStorageItem | null;
    realtime: {
      set: (tableName: string, key: string, value: RealtimeValue) => void;
      get: (tableName: string, key: string) => RealtimeValue;
      all: (tableName: string) => RealtimeKeyValues;
      clear: (tableName: string) => void;
    };
  };
}

declare var fresco: IFrescoSdk;
