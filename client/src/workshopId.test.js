import { describe, expect, it } from "vitest";
import { isValidWorkshopId, normalizeWorkshopId } from "./workshopId";

describe("workshop ID validation", () => {
  it("accepts the seeded workshop IDs", () => {
    expect(isValidWorkshopId("S0000001A")).toBe(true);
    expect(isValidWorkshopId("S0000002B")).toBe(true);
  });

  it("normalizes surrounding whitespace and casing", () => {
    expect(normalizeWorkshopId(" s0000001a ")).toBe("S0000001A");
    expect(isValidWorkshopId(" s0000001a ")).toBe(true);
  });

  it("rejects empty and malformed IDs", () => {
    expect(isValidWorkshopId("")).toBe(false);
    expect(isValidWorkshopId("S000001A")).toBe(false);
    expect(isValidWorkshopId("S0000001")).toBe(false);
    expect(isValidWorkshopId("not-an-id")).toBe(false);
  });
});
