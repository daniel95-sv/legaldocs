import type { LegalDocsState } from "@/types";
import { DEFAULT_INITIAL_STATE } from "@/data/catalogs";

const STORAGE_KEY = "legaldocs_wizard_v2";

export function saveStateToLocalStorage(state: LegalDocsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("No se pudo guardar el estado en localStorage:", error);
  }
}

export function loadStateFromLocalStorage(): LegalDocsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_INITIAL_STATE };
    const parsed = JSON.parse(raw);

    // Merge safely with default initial state
    return {
      ...DEFAULT_INITIAL_STATE,
      ...parsed,
      juris: { ...DEFAULT_INITIAL_STATE.juris, ...(parsed.juris || {}) },
      features: { ...DEFAULT_INITIAL_STATE.features, ...(parsed.features || {}) },
      transfers: { ...DEFAULT_INITIAL_STATE.transfers, ...(parsed.transfers || {}) },
      cookies: { ...DEFAULT_INITIAL_STATE.cookies, ...(parsed.cookies || {}) },
      ai: { ...DEFAULT_INITIAL_STATE.ai, ...(parsed.ai || {}) },
      minors: { ...DEFAULT_INITIAL_STATE.minors, ...(parsed.minors || {}) },
      docs: { ...DEFAULT_INITIAL_STATE.docs, ...(parsed.docs || {}) },
      dataCategories: Array.isArray(parsed.dataCategories)
        ? parsed.dataCategories
        : DEFAULT_INITIAL_STATE.dataCategories,
      purposes: Array.isArray(parsed.purposes)
        ? parsed.purposes
        : DEFAULT_INITIAL_STATE.purposes,
      thirdParties: Array.isArray(parsed.thirdParties)
        ? parsed.thirdParties
        : DEFAULT_INITIAL_STATE.thirdParties,
      security: Array.isArray(parsed.security)
        ? parsed.security
        : DEFAULT_INITIAL_STATE.security,
      generatedDocs: parsed.generatedDocs || {},
    };
  } catch (error) {
    console.warn("Error leyendo localStorage, reiniciando:", error);
    return { ...DEFAULT_INITIAL_STATE };
  }
}

export function clearStateFromLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("No se pudo limpiar localStorage:", error);
  }
}
