import { describe, expect, it } from "vitest";
import { searchFeedback } from "./feedback-search";

const feedback = [
  { id: "1", name: "Aisha Rahman", message: "The walkway lights need attention." },
  { id: "2", name: "Daniel Tan", message: "Please add more benches near the market." },
];

describe("searchFeedback", () => {
  it("finds feedback messages case-insensitively", () => {
    expect(searchFeedback(feedback, "LIGHTS")).toEqual([feedback[0]]);
  });

  it("finds citizen names case-insensitively", () => {
    expect(searchFeedback(feedback, "daniel")).toEqual([feedback[1]]);
  });

  it("keeps all feedback when the search is blank", () => {
    expect(searchFeedback(feedback, "  ")).toEqual(feedback);
  });
});
