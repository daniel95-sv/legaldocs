import { describe, it, expect } from "vitest";
import { generatePrivacyPolicy } from "@/templates/privacy";
import { generateTermsAndConditions } from "@/templates/terms";
import { generateLegalNotice } from "@/templates/legal";
import { generateCookiesPolicy } from "@/templates/cookies";
import { generateAccountDeletionPolicy } from "@/templates/deletion";
import { generateStoreDisclosure } from "@/templates/store-disclosure";
import { generateAllDocuments } from "@/core/document-generator/generator";
import { DEFAULT_INITIAL_STATE } from "@/data/catalogs";

describe("Document Generators", () => {
  const baseState = {
    ...DEFAULT_INITIAL_STATE,
    appName: "SecureChat",
    responsibleName: "SecureLabs S.L.",
    country: "España",
    contactEmail: "legal@securechat.com",
    dataCategories: ["name", "email", "ip"],
    purposes: ["accounts", "security"],
    features: {
      ...DEFAULT_INITIAL_STATE.features,
      accounts: true,
      ugc: true,
      payments: true,
    },
  };

  it("generates privacy policy with declared categories and controller", () => {
    const text = generatePrivacyPolicy(baseState);
    expect(text).toContain("POLÍTICA DE PRIVACIDAD");
    expect(text).toContain("SecureChat");
    expect(text).toContain("SecureLabs S.L.");
    expect(text).toContain("legal@securechat.com");
    expect(text).toContain("Nombre y apellidos");
    expect(text).toContain("Correo electrónico");
  });

  it("generates terms and conditions with UGC and payment clauses", () => {
    const text = generateTermsAndConditions(baseState);
    expect(text).toContain("TÉRMINOS Y CONDICIONES");
    expect(text).toContain("CONTENIDO GENERADO POR EL USUARIO");
    expect(text).toContain("PAGOS");
  });

  it("generates legal notice with company data", () => {
    const text = generateLegalNotice(baseState);
    expect(text).toContain("AVISO LEGAL");
    expect(text).toContain("SecureLabs S.L.");
  });

  it("generates cookies policy when cookies are declared", () => {
    const stateWithCookies = {
      ...baseState,
      cookies: { ...baseState.cookies, necessary: true, analytics: true },
    };
    const text = generateCookiesPolicy(stateWithCookies);
    expect(text).toContain("POLÍTICA DE COOKIES");
    expect(text).toContain("Cookies analíticas o de rendimiento");
  });

  it("generates account deletion policy with instructions", () => {
    const text = generateAccountDeletionPolicy(baseState);
    expect(text).toContain("ELIMINACIÓN DE CUENTAS");
    expect(text).toContain("legal@securechat.com");
  });

  it("generates store disclosure summary", () => {
    const text = generateStoreDisclosure(baseState);
    expect(text).toContain("FICHA DE DIVULGACIÓN DE SEGURIDAD DE DATOS");
    expect(text).toContain("SecureChat");
  });

  it("generates all selected documents via orchestrator", () => {
    const allSelectedState = {
      ...baseState,
      docs: {
        privacy: true,
        terms: true,
        legal: true,
        cookies: true,
        deletion: true,
        storeDisclosure: true,
      },
    };

    const docs = generateAllDocuments(allSelectedState);
    expect(docs.privacy).toBeDefined();
    expect(docs.terms).toBeDefined();
    expect(docs.legal).toBeDefined();
    expect(docs.cookies).toBeDefined();
    expect(docs.deletion).toBeDefined();
    expect(docs.storeDisclosure).toBeDefined();
  });
});
