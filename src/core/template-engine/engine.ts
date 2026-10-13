import type { LegalDocsState } from "@/types";

export function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatDateSpanish(isoDate: string): string {
  if (!isoDate) return "—";
  try {
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function sanitizeFilename(name: string): string {
  return String(name || "documento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "documento";
}

export function buildDocumentHeader(state: LegalDocsState, docTitle: string): string {
  const lines: string[] = [];
  lines.push(docTitle.toUpperCase());
  lines.push("");
  lines.push(`Aplicación: ${state.appName.trim()}`);
  if (state.responsibleName.trim()) {
    lines.push(`Titular / Responsable: ${state.responsibleName.trim()}`);
  }
  if (state.contactEmail.trim()) {
    lines.push(`Contacto: ${state.contactEmail.trim()}`);
  }
  if (state.url.trim()) {
    lines.push(`Sitio web oficial: ${state.url.trim()}`);
  }
  lines.push(`Fecha de entrada en vigor: ${formatDateSpanish(state.effectiveDate)}`);
  lines.push(`Última actualización: ${formatDateSpanish(new Date().toISOString().slice(0, 10))}`);
  lines.push("");
  lines.push("================================================================================");
  lines.push("");
  return lines.join("\n");
}

export function buildSection(title: string, paragraphs: (string | undefined | null)[]): string {
  const filtered = paragraphs.filter((p): p is string => Boolean(p && p.trim()));
  if (filtered.length === 0) return "";
  return `${title}\n\n${filtered.join("\n\n")}`;
}

export function buildBulletList(items: (string | undefined | null)[]): string {
  const filtered = items.filter((it): it is string => Boolean(it && it.trim()));
  if (filtered.length === 0) return "";
  return filtered.map((i) => `• ${i.trim()}`).join("\n");
}
