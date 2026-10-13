import { describe, it, expect } from "vitest";
import { evaluateDocumentRules } from "@/core/document-rules/rules";
import { DEFAULT_INITIAL_STATE } from "@/data/catalogs";

describe("Document Rules Engine", () => {
  it("recommends deletion policy when accounts feature is enabled without deletion doc", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      features: { ...DEFAULT_INITIAL_STATE.features, accounts: true },
      docs: { ...DEFAULT_INITIAL_STATE.docs, deletion: false },
    };

    const rules = evaluateDocumentRules(state);
    const hasDeletionRule = rules.some(
      (r) => r.suggestedDoc === "deletion" && r.type === "document"
    );
    expect(hasDeletionRule).toBe(true);
  });

  it("recommends cookies policy when analytics is enabled without cookies doc", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      features: { ...DEFAULT_INITIAL_STATE.features, analytics: true },
      docs: { ...DEFAULT_INITIAL_STATE.docs, cookies: false },
    };

    const rules = evaluateDocumentRules(state);
    const hasCookiesRule = rules.some(
      (r) => r.suggestedDoc === "cookies" && r.type === "document"
    );
    expect(hasCookiesRule).toBe(true);
  });

  it("warns when automated decisions are enabled with AI", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      features: { ...DEFAULT_INITIAL_STATE.features, ai: true },
      ai: { ...DEFAULT_INITIAL_STATE.ai, automated: true },
    };

    const rules = evaluateDocumentRules(state);
    const hasWarning = rules.some(
      (r) => r.type === "warning" && r.message.includes("decisiones automatizadas")
    );
    expect(hasWarning).toBe(true);
  });

  it("warns when app is aimed at minors", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      audience: "minors" as const,
    };

    const rules = evaluateDocumentRules(state);
    const hasMinorsWarning = rules.some(
      (r) => r.type === "warning" && r.message.includes("menores")
    );
    expect(hasMinorsWarning).toBe(true);
  });
});
