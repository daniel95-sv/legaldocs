import type { DocumentId, LegalDocsState } from "@/types";
import { sanitizeFilename, escapeHtml } from "@/core/template-engine/engine";

const DOC_PREFIXES: Record<DocumentId, string> = {
  privacy: "politica-de-privacidad",
  terms: "terminos-y-condiciones",
  legal: "aviso-legal",
  cookies: "politica-de-cookies",
  deletion: "politica-eliminacion-cuentas",
  storeDisclosure: "divulgacion-tiendas",
};

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function exportDocumentToTXT(
  docId: DocumentId,
  content: string,
  state: LegalDocsState
): void {
  const prefix = DOC_PREFIXES[docId] || "documento";
  const slug = sanitizeFilename(state.appName);
  const filename = `${prefix}-${slug}.txt`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function exportDocumentToHTML(
  docId: DocumentId,
  content: string,
  state: LegalDocsState
): void {
  const prefix = DOC_PREFIXES[docId] || "documento";
  const slug = sanitizeFilename(state.appName);
  const filename = `${prefix}-${slug}.html`;

  const safeContent = escapeHtml(content);
  const appNameSafe = escapeHtml(state.appName);

  const htmlDoc = `<!DOCTYPE html>
<html lang="${state.language || "es"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(prefix.replace(/-/g, " ").toUpperCase())} — ${appNameSafe}</title>
  <style>
    :root {
      color-scheme: light;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      max-width: 840px;
      margin: 2.5rem auto;
      padding: 0 1.5rem;
      line-height: 1.65;
      color: #1a202c;
      background-color: #ffffff;
    }
    header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 1.25rem;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 1.6rem;
      color: #0f172a;
      margin-top: 0;
    }
    .disclaimer {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #92400e;
      margin-bottom: 1.5rem;
      border-radius: 4px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
      font-size: 0.95rem;
      line-height: 1.7;
    }
    footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 3rem;
      padding-top: 1rem;
      font-size: 0.85rem;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        max-width: 100%;
      }
      .disclaimer {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${appNameSafe}</h1>
  </header>
  <div class="disclaimer">
    Aviso: Este documento es un borrador informativo generado con LegalDocs Generator. Debe revisarse y adaptarse a las condiciones reales de la actividad antes de su publicación oficial.
  </div>
  <main>
    <pre>${safeContent}</pre>
  </main>
  <footer>
    Documento generado el ${new Date().toLocaleDateString("es-ES")} — LegalDocs Generator
  </footer>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, filename);
}
