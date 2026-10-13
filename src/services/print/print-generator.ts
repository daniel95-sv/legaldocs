import type { DocumentId, LegalDocsState } from "@/types";
import { escapeHtml } from "@/core/template-engine/engine";

const DOC_DISPLAY_NAMES: Record<DocumentId, string> = {
  privacy: "Política de Privacidad",
  terms: "Términos y Condiciones",
  legal: "Aviso Legal",
  cookies: "Política de Cookies",
  deletion: "Política de Eliminación de Cuentas y Datos",
  storeDisclosure: "Divulgación para Tiendas de Aplicaciones",
};

/**
 * Convierte el texto plano del documento legal en un documento HTML profesional,
 * estructurado y con reglas de paginación adecuadas para su impresión en papel o PDF.
 */
export function formatDocumentToPrintHtml(
  title: string,
  appName: string,
  content: string
): string {
  const lines = content.split("\n");
  const bodyHtml: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        bodyHtml.push("</ul>");
        inList = false;
      }
      continue;
    }

    // Separadores decorativos como ========== o ----------
    if (/^[=\-_]{4,}$/.test(trimmed)) {
      if (inList) {
        bodyHtml.push("</ul>");
        inList = false;
      }
      bodyHtml.push('<hr class="print-divider" />');
      continue;
    }

    // Elementos de viñeta (•, -, *)
    if (/^[•\-\*]\s+/.test(trimmed)) {
      if (!inList) {
        bodyHtml.push('<ul class="print-list">');
        inList = true;
      }
      const itemText = escapeHtml(trimmed.replace(/^[•\-\*]\s+/, ""));
      bodyHtml.push(`<li>${itemText}</li>`);
      continue;
    }

    if (inList) {
      bodyHtml.push("</ul>");
      inList = false;
    }

    // Título principal en mayúsculas (primera línea relevante)
    if (i === 0 && trimmed === trimmed.toUpperCase() && trimmed.length > 5) {
      bodyHtml.push(`<h1 class="print-doc-title">${escapeHtml(trimmed)}</h1>`);
      continue;
    }

    // Títulos de sección numerados (ej. 1. INTRODUCCIÓN..., 2. RESPONSABLE...)
    if (/^[0-9]+\.\s+[A-ZÁÉÍÓÚÑ\s\(\)\/\-–]+$/.test(trimmed)) {
      bodyHtml.push(`<h2 class="print-section-header">${escapeHtml(trimmed)}</h2>`);
      continue;
    }

    // Líneas de metadatos del encabezado (Aplicación:, Titular:, Fecha:)
    if (/^(Aplicación|Titular|Responsable|Fecha|Última actualización|Versión):/i.test(trimmed)) {
      bodyHtml.push(`<p class="print-meta-line"><strong>${escapeHtml(trimmed)}</strong></p>`);
      continue;
    }

    // Párrafos regulares
    bodyHtml.push(`<p class="print-paragraph">${escapeHtml(trimmed)}</p>`);
  }

  if (inList) {
    bodyHtml.push("</ul>");
  }

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} — ${escapeHtml(appName)}</title>
  <style>
    @page {
      margin: 20mm 15mm 20mm 15mm;
      size: A4 portrait;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      color: #111827;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
    }

    .print-doc-title {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10pt 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2pt solid #2563eb;
      padding-bottom: 6pt;
      page-break-after: avoid;
      break-after: avoid;
    }

    .print-meta-line {
      font-size: 9.5pt;
      color: #334155;
      margin: 2pt 0;
      line-height: 1.45;
    }

    .print-divider {
      border: 0;
      border-top: 1pt solid #cbd5e1;
      margin: 10pt 0 14pt 0;
    }

    .print-section-header {
      font-size: 11.5pt;
      font-weight: 700;
      color: #1e3a8a;
      margin: 14pt 0 6pt 0;
      page-break-after: avoid;
      break-after: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .print-paragraph {
      margin: 0 0 7.5pt 0;
      text-align: justify;
      hyphens: auto;
      text-justify: inter-word;
    }

    .print-list {
      margin: 4pt 0 9pt 18pt;
      padding: 0;
    }

    .print-list li {
      margin-bottom: 3.5pt;
      text-align: justify;
      line-height: 1.55;
    }

    .print-doc-footer {
      margin-top: 24pt;
      border-top: 0.75pt solid #cbd5e1;
      padding-top: 8pt;
      font-size: 8.5pt;
      color: #64748b;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  </style>
</head>
<body>
  ${bodyHtml.join("\n")}
  <div class="print-doc-footer">
    Documento oficial: ${escapeHtml(title)} — Aplicación: ${escapeHtml(appName)} — Fecha de impresión: ${currentDate}
  </div>
</body>
</html>`;
}

/**
 * Imprime exclusivamente el documento legal activo mediante un iframe aislado,
 * garantizando que solo se imprima el contenido del texto sin elementos de la interfaz.
 */
export function printDocumentContent(
  docId: DocumentId,
  content: string,
  state: LegalDocsState
): void {
  const title = DOC_DISPLAY_NAMES[docId] || "Documento Legal";
  const appName = state.appName.trim() || "Aplicación";
  const fullHtml = formatDocumentToPrintHtml(title, appName, content);

  // Buscar o crear un iframe aislado para impresión
  let iframe = document.getElementById("legaldocs-print-frame") as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "legaldocs-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);
  }

  const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!iframeDoc) {
    // Si por políticas estrictas no se pudiera acceder al iframe, fallback limpio
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(fullHtml);
  iframeDoc.close();

  // Esperar a que el navegador procese los estilos antes de invocar la ventana de impresión
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn("Fallo en impresión vía iframe, usando fallback:", e);
      window.print();
    }
  }, 150);
}
