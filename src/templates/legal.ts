import type { LegalDocsState } from "@/types";
import {
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";

export function generateLegalNotice(state: LegalDocsState): string {
  const sections: string[] = [];

  sections.push(buildDocumentHeader(state, "Aviso Legal e Información Corporativa"));

  // 1. Datos del titular
  sections.push(
    buildSection("1. DATOS IDENTIFICATIVOS DEL TITULAR", [
      "En cumplimiento de los deberes de información previa exigidos por la normativa sobre servicios de la sociedad de la información y comercio electrónico (LSSI-CE y normativa análoga), se comunican los datos del responsable del sitio web y/o aplicación:",
      buildBulletList([
        `Titular o denominación social: ${state.responsibleName || "—"}`,
        `Condición jurídica: ${
          state.responsibleType === "company"
            ? "Entidad mercantil / Persona jurídica"
            : "Profesional autónomo / Desarrollador independiente"
        }`,
        `País de radicación: ${state.country || "—"}`,
        state.address ? `Domicilio postal: ${state.address.trim()}` : "",
        state.contactEmail ? `Correo electrónico de contacto: ${state.contactEmail.trim()}` : "",
        state.url ? `Sitio web oficial: ${state.url.trim()}` : "",
      ]),
    ])
  );

  // 2. Finalidad
  sections.push(
    buildSection("2. FINALIDAD Y ÁMBITO DEL SITIO O APLICACIÓN", [
      `El presente espacio digital ("${state.appName}") tiene como finalidad primordial ${
        state.description ? state.description.trim() : "la divulgación y puesta a disposición de sus funciones y productos digitales"
      }.`,
      "La navegación por este entorno confiere la condición de Usuario y comporta la asunción de los términos contenidos en este Aviso Legal, complementados por la Política de Privacidad y Términos de Uso aplicables.",
    ])
  );

  // 3. Propiedad intelectual
  sections.push(
    buildSection("3. PROPIEDAD INTELECTUAL E INDUSTRIAL", [
      "El diseño, logotipos, código fuente, desarrollos de software, contenidos textuales y creaciones multimedia integradas en esta plataforma corresponden en exclusiva a su Titular o a terceros debidamente licenciados.",
      "Queda expresamente prohibida la reproducción total o parcial, transformación, distribución, comunicación pública o puesta a disposición con fines comerciales no autorizados sin el consentimiento expreso y por escrito del titular legítimo.",
    ])
  );

  // 4. Exclusión de garantías y responsabilidad
  sections.push(
    buildSection("4. EXCLUSIÓN DE RESPONSABILIDAD", [
      "El Titular declina toda responsabilidad por los perjuicios que pudieren derivarse de interferencias, omisiones, interrupciones, averías o desconexiones en el funcionamiento operativo de los sistemas de telecomunicación ajenos a su control.",
      "Tampoco responde por la presencia de códigos maliciosos introducidos por agentes externos que puedan causar daños en los dispositivos del Usuario, correspondiendo a este disponer de herramientas antivirus y de navegación seguras.",
    ])
  );

  // 5. Enlaces a terceros
  sections.push(
    buildSection("5. ENLACES EXTERNOS (LINKS)", [
      "La presencia de hiperenlaces a sitios o plataformas de terceros tiene carácter meramente instrumental o informativo. El Titular no ejerce control editorial sobre tales plataformas ni asume responsabilidad por la veracidad, licitud o políticas de privacidad de los sitios enlazados.",
    ])
  );

  // 6. Legislación aplicable
  sections.push(
    buildSection("6. LEGISLACIÓN APLICABLE Y JURISDICCIÓN", [
      `El presente Aviso Legal se encuentra sometido a las leyes vigentes en ${state.country || "el país de establecimiento del titular"}.`,
      "Cualquier controversia derivada de la interpretación o ejecución de este texto se sustanciará ante los tribunales competentes conforme a la normativa de fuero procesal que resulte de aplicación.",
    ])
  );

  return sections.join("\n\n");
}
