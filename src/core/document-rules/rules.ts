import type { LegalDocsState, DocumentId } from "@/types";

export interface RuleRecommendation {
  type: "document" | "warning" | "info";
  message: string;
  suggestedDoc?: DocumentId;
}

export function evaluateDocumentRules(state: LegalDocsState): RuleRecommendation[] {
  const recommendations: RuleRecommendation[] = [];

  // Rule 1: Accounts without deletion policy
  if (state.features.accounts && !state.docs.deletion) {
    recommendations.push({
      type: "document",
      message:
        "Tu aplicación permite crear cuentas. Tanto Google Play como Apple App Store exigen publicar una Política de Eliminación de Cuentas y Datos accesible.",
      suggestedDoc: "deletion",
    });
  }

  // Rule 2: Analytics or Ads without Cookies Policy
  const usesTracking =
    state.features.analytics ||
    state.features.ads ||
    state.cookies.analytics ||
    state.cookies.advertising;

  if (usesTracking && !state.docs.cookies) {
    recommendations.push({
      type: "document",
      message:
        "Declaras el uso de analítica o publicidad. Se recomienda generar una Política de Cookies y tecnologías de seguimiento.",
      suggestedDoc: "cookies",
    });
  }

  // Rule 3: Mobile apps without Store Disclosure
  if (
    (state.appType === "android" || state.appType === "ios") &&
    !state.docs.storeDisclosure
  ) {
    recommendations.push({
      type: "document",
      message:
        "Para aplicaciones móviles en tiendas oficiales, se recomienda generar la Divulgación de Seguridad de Datos para tiendas.",
      suggestedDoc: "storeDisclosure",
    });
  }

  // Rule 4: Automated decisions with AI
  if (state.features.ai && state.ai.automated) {
    recommendations.push({
      type: "warning",
      message:
        "Has indicado decisiones automatizadas con IA. En jurisdicciones como la Unión Europea (Art. 22 RGPD), esto requiere información adicional y el derecho a intervención humana.",
    });
  }

  // Rule 5: Minors target
  if (state.features.minors || state.audience === "minors") {
    recommendations.push({
      type: "warning",
      message:
        "La aplicación está dirigida o accesible a menores. Las normativas de protección a la infancia (COPPA en EE.UU., RGPD-K en Europa) exigen verificación parental rigurosa y revisión legal profesional.",
    });
  }

  // Rule 6: International transfers without safeguards
  if (state.transfers.international && !state.transfers.mechanisms.trim()) {
    recommendations.push({
      type: "warning",
      message:
        "Declaras transferencias internacionales de datos pero no has especificado garantías (como Cláusulas Contractuales Tipo de la UE).",
    });
  }

  // Rule 7: Payments without refund policy
  if (state.features.subscriptions && !state.purposes.includes("subscriptions")) {
    recommendations.push({
      type: "info",
      message:
        "Has marcado suscripciones en características, pero no incluiste la gestión de suscripciones en finalidades de tratamiento.",
    });
  }

  return recommendations;
}
