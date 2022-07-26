import { useTextFit } from "./useTextFit";
import textfit from "textfit";
import { renderHook } from "@testing-library/react";

jest.mock("textfit");

describe("useTextFit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call textFit on empty an string", () => {
    const { result, rerender } = renderHook((text) => useTextFit(text), {
      initialProps: "initial-text",
    });
    (result.current as any).current = document.createElement("div");

    rerender("");

    expect(textfit).toHaveBeenCalled();
  });
});
