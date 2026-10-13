import { describe, it, expect } from "vitest";
import { formatDocumentToPrintHtml } from "@/services/print/print-generator";

describe("Print Document Generator", () => {
  it("formats text into clean, structured HTML for printing", () => {
    const rawContent = `POLÍTICA DE PRIVACIDAD
Aplicación: MiApp
Titular: Juan Pérez

1. INTRODUCCIÓN Y ÁMBITO
Este es un párrafo de introducción sobre el servicio.

2. CATEGORÍAS DE DATOS
Tratamos los siguientes datos:
• Correo electrónico
• Dirección IP

==================================================
Aviso de validez.`;

    const html = formatDocumentToPrintHtml("Política de Privacidad", "MiApp", rawContent);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Política de Privacidad — MiApp</title>");
    expect(html).toContain('<h1 class="print-doc-title">POLÍTICA DE PRIVACIDAD</h1>');
    expect(html).toContain('<h2 class="print-section-header">1. INTRODUCCIÓN Y ÁMBITO</h2>');
    expect(html).toContain('<ul class="print-list">');
    expect(html).toContain("<li>Correo electrónico</li>");
    expect(html).toContain("<li>Dirección IP</li>");
    expect(html).toContain('<hr class="print-divider" />');
    expect(html).toContain('<div class="print-doc-footer">');
  });
});
