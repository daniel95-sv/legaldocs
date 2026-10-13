import { jsPDF } from "jspdf";
import type { LegalDocsState, DocumentId } from "@/types";
import { sanitizeFilename, formatDateSpanish } from "@/core/template-engine/engine";

const DOC_TITLES: Record<DocumentId, string> = {
  privacy: "Política de Privacidad",
  terms: "Términos y Condiciones",
  legal: "Aviso Legal",
  cookies: "Política de Cookies",
  deletion: "Política de Eliminación de Cuentas y Datos",
  storeDisclosure: "Divulgación para Tiendas de Aplicaciones",
};

export async function exportDocumentToPDF(
  docId: DocumentId,
  content: string,
  state: LegalDocsState
): Promise<void> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const bottomFooterLimit = pageHeight - 15;

  const docTitle = DOC_TITLES[docId] || "Documento Legal";
  const appName = state.appName.trim() || "Aplicación";
  const effectiveDateStr = formatDateSpanish(state.effectiveDate);

  // Setup styles
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(33, 37, 41);

  const lines = doc.splitTextToSize(content, usableWidth);
  let y = margin + 12; // Start after top header
  const lineHeight = 5.2;

  lines.forEach((line: string) => {
    // Check if line looks like a header (all caps or starting with number and dot)
    const isSectionHeader = /^[0-9]+\.\s+[A-ZÁÉÍÓÚÑ\s]+$/.test(line.trim());

    if (y + (isSectionHeader ? lineHeight * 2 : lineHeight) > bottomFooterLimit) {
      doc.addPage();
      y = margin + 12;
    }

    if (isSectionHeader) {
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(24, 49, 83);
      doc.text(line, margin, y);
      y += lineHeight + 1;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
    } else {
      doc.text(line, margin, y);
      y += lineHeight;
    }
  });

  // Stamp headers and footers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(110, 120, 135);
    doc.text(
      `${appName.toUpperCase()} — ${docTitle.toUpperCase()}`,
      margin,
      margin - 4
    );
    doc.text(
      `Vigencia: ${effectiveDateStr}`,
      pageWidth - margin,
      margin - 4,
      { align: "right" }
    );

    // Header divider line
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, margin - 1, pageWidth - margin, margin - 1);

    // Running Footer divider line
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text(
      "Borrador orientativo generado por LegalDocs Generator. No constituye asesoramiento legal.",
      margin,
      pageHeight - 7
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" }
    );
  }

  const filename = `${docId}-${sanitizeFilename(appName)}.pdf`;
  doc.save(filename);
}
