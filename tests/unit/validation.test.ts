import { describe, it, expect } from "vitest";
import { validateStep, validateAllForGeneration } from "@/core/validation/schemas";
import { DEFAULT_INITIAL_STATE } from "@/data/catalogs";

describe("Validation Schemas", () => {
  it("rejects empty appName in app step", () => {
    const state = { ...DEFAULT_INITIAL_STATE, appName: "", appType: "web" as const };
    const result = validateStep("app", state);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "appName")).toBe(true);
  });

  it("rejects empty appType in app step", () => {
    const state = { ...DEFAULT_INITIAL_STATE, appName: "AppValida", appType: "" as any };
    const result = validateStep("app", state);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "appType")).toBe(true);
  });

  it("validates valid app step successfully", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      appName: "AppValida",
      appType: "web" as const,
      contactEmail: "contacto@miapp.com",
      url: "https://miapp.com",
      effectiveDate: "2026-10-13",
    };
    const result = validateStep("app", state);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("validates responsible step", () => {
    const invalid = { ...DEFAULT_INITIAL_STATE, responsibleName: "", country: "" };
    expect(validateStep("resp", invalid).valid).toBe(false);

    const valid = { ...DEFAULT_INITIAL_STATE, responsibleName: "Juan Pérez", country: "España" };
    expect(validateStep("resp", valid).valid).toBe(true);
  });

  it("validates that at least one data category is selected", () => {
    const empty = { ...DEFAULT_INITIAL_STATE, dataCategories: [] };
    expect(validateStep("data", empty).valid).toBe(false);

    const filled = { ...DEFAULT_INITIAL_STATE, dataCategories: ["email", "name"] };
    expect(validateStep("data", filled).valid).toBe(true);
  });

  it("validates that at least one purpose is selected", () => {
    const empty = { ...DEFAULT_INITIAL_STATE, purposes: [] };
    expect(validateStep("purp", empty).valid).toBe(false);

    const filled = { ...DEFAULT_INITIAL_STATE, purposes: ["accounts"] };
    expect(validateStep("purp", filled).valid).toBe(true);
  });

  it("validates full state for generation", () => {
    const readyState = {
      ...DEFAULT_INITIAL_STATE,
      appName: "Mi Gran App",
      appType: "mobile" as any,
      responsibleName: "Empresa S.L.",
      country: "México",
      dataCategories: ["name", "email"],
      purposes: ["functionality"],
      retentionPeriod: "1 año",
      docs: { ...DEFAULT_INITIAL_STATE.docs, privacy: true },
    };

    const res = validateAllForGeneration(readyState);
    expect(res.valid).toBe(true);
  });
});
