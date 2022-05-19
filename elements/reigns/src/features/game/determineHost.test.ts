import { determineHost } from "./determineHost";
import { getSdk } from "../../sdk";

const mockStorage = {
  clear: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
};
jest.mock("../../sdk", () => ({
  getSdk: () =>
    ({
      storage: mockStorage,
    } as unknown as IFrescoSdk),
}));

describe("determineHost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const createStorageItem = (value: string) =>
    ({ value } as ProtectedStorageItem);
  const createParticipant = (id: string): Participant => ({ id, name: id });
  it("chooses an eligible host by alphabetic id order", () => {
    const host = determineHost({
      mounted: [
        createStorageItem("b"),
        createStorageItem("a"),
        createStorageItem("c"),
      ],
      remoteParticipants: [createParticipant("b"), createParticipant("a")],
      localParticipant: createParticipant("c"),
      previousHost: null,
    });
    expect(host?.id).toBe("a");
  });
  it("should exclude disconnected players", () => {
    const host = determineHost({
      mounted: [createStorageItem("a"), createStorageItem("b")],
      remoteParticipants: [],
      localParticipant: createParticipant("b"),
      previousHost: null,
    });
    expect(host?.id).toBe("b");
  });

  it("should exclude unmounted players", () => {
    const host = determineHost({
      mounted: [createStorageItem("b")],
      remoteParticipants: [createParticipant("a")],
      localParticipant: createParticipant("b"),
      previousHost: null,
    });
    expect(host?.id).toBe("b");
  });

  it("should choose previous host if still eligible", () => {
    const host = determineHost({
      mounted: [createStorageItem("a"), createStorageItem("b")],
      remoteParticipants: [createParticipant("b")],
      localParticipant: createParticipant("a"),
      previousHost: createParticipant("b"),
    });
    expect(host?.id).toBe("b");
  });
  it("should choose new host if previous host not eligible", () => {
    const host = determineHost({
      mounted: [createStorageItem("a")],
      remoteParticipants: [createParticipant("b")],
      localParticipant: createParticipant("a"),
      previousHost: createParticipant("b"),
    });
    expect(host?.id).toBe("a");
  });

  describe("on host change", () => {
    it("should persist new host if current user", () => {
      const host = determineHost({
        mounted: [createStorageItem("a")],
        remoteParticipants: [createParticipant("b")],
        localParticipant: createParticipant("a"),
        previousHost: createParticipant("b"),
      });
      expect(mockStorage.add).toBeCalledWith(
        "host",
        expect.objectContaining({ id: "a" })
      );
    });

    it("should not persist new host, if new host is another user", () => {
      const host = determineHost({
        mounted: [createStorageItem("a")],
        remoteParticipants: [createParticipant("a")],
        localParticipant: createParticipant("b"),
        previousHost: createParticipant("a"),
      });
      expect(mockStorage.add).not.toBeCalled();
    });
  });
});
