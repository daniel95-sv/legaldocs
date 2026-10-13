import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  formatDateSpanish,
  sanitizeFilename,
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";
import { DEFAULT_INITIAL_STATE } from "@/data/catalogs";

describe("Template Engine & Helpers", () => {
  it("escapes special HTML characters correctly", () => {
    const input = `<script>alert("xss" & 'injection')</script>`;
    const escaped = escapeHtml(input);
    expect(escaped).toBe(
      "&lt;script&gt;alert(&quot;xss&quot; &amp; &#39;injection&#39;)&lt;/script&gt;"
    );
  });

  it("formats dates in readable Spanish format", () => {
    const formatted = formatDateSpanish("2026-10-13");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("octubre");
  });

  it("handles empty or invalid dates gracefully", () => {
    expect(formatDateSpanish("")).toBe("—");
    expect(formatDateSpanish("invalid-date")).toBe("invalid-date");
  });

  it("sanitizes filenames safely removing accents and dangerous characters", () => {
    const sanitized = sanitizeFilename("Política de Privacidad: Mi App / V1!");
    expect(sanitized).toBe("Politica-de-Privacidad-Mi-App-V1");
  });

  it("builds document headers with application details", () => {
    const state = {
      ...DEFAULT_INITIAL_STATE,
      appName: "TestApp",
      responsibleName: "Acme Corp",
      contactEmail: "legal@acme.com",
      url: "https://acme.com",
    };

    const header = buildDocumentHeader(state, "Política de Privacidad");
    expect(header).toContain("POLÍTICA DE PRIVACIDAD");
    expect(header).toContain("Aplicación: TestApp");
    expect(header).toContain("Titular / Responsable: Acme Corp");
    expect(header).toContain("Contacto: legal@acme.com");
    expect(header).toContain("Sitio web oficial: https://acme.com");
  });

  it("builds sections cleanly omitting null or empty paragraphs", () => {
    const section = buildSection("1. INTRODUCCIÓN", [
      "Primer párrafo.",
      "",
      null,
      undefined,
      "Segundo párrafo.",
    ]);
    expect(section).toBe("1. INTRODUCCIÓN\n\nPrimer párrafo.\n\nSegundo párrafo.");
  });

  it("builds bullet lists with bullet points", () => {
    const list = buildBulletList(["Elemento A", "", "Elemento B"]);
    expect(list).toBe("• Elemento A\n• Elemento B");
  });
});
