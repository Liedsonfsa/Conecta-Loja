import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn (className utility)", () => {
  it("should merge class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe(
      "class1 class2"
    );
  });

  it("should handle undefined and null values", () => {
    expect(cn("class1", undefined, null, "class2")).toBe("class1 class2");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("should handle objects with boolean values", () => {
    expect(cn({ class1: true, class2: false, class3: true })).toBe(
      "class1 class3"
    );
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("px-4 py-2", "px-6")).toMatch(/px-6/);
    expect(cn("px-4 py-2", "px-6")).toMatch(/py-2/);
  });

  it("should return empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should handle single class name", () => {
    expect(cn("single-class")).toBe("single-class");
  });

  it("should properly merge conflicting Tailwind utilities", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-white", "bg-black")).toBe("bg-black");
  });
});
