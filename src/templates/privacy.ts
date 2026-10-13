import type { LegalDocsState } from "@/types";
import { DATA_CATEGORIES, PURPOSES, SECURITY_MEASURES } from "@/data/catalogs";
import {
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";

function findLabel(catalog: { v: string; label: string }[], key: string): string {
  return catalog.find((c) => c.v === key)?.label || key;
}

export function generatePrivacyPolicy(state: LegalDocsState): string {
  const sections: string[] = [];

  // Header
  sections.push(buildDocumentHeader(state, "Política de Privacidad"));

  // 1. Introducción y ámbito
  sections.push(
    buildSection("1. INTRODUCCIÓN Y ÁMBITO DE APLICACIÓN", [
      `La presente Política de Privacidad regula el tratamiento de datos personales realizado por ${
        state.responsibleName || "el responsable"
      } (en adelante, "el Responsable" o "nosotros") en el marco del uso y funcionamiento de la aplicación "${
        state.appName
      }" (en adelante, "la Aplicación").`,
      state.description
        ? `Descripción del servicio: ${state.description.trim()}`
        : "La Aplicación proporciona los servicios y funcionalidades descritos en su plataforma o documentación oficial.",
      `El acceso y uso de la Aplicación implica que el usuario ha leído y comprende las condiciones de tratamiento recogidas en este documento. Si no estás de acuerdo con alguna de las disposiciones aquí contenidas, te rogamos que te abstengas de utilizar el servicio.`,
    ])
  );

  // 2. Identificación del responsable
  const controllerDetails = [
    `Identidad del responsable: ${state.responsibleName || "—"}`,
    `Condición: ${
      state.responsibleType === "company"
        ? "Persona jurídica / Empresa"
        : "Desarrollador independiente / Persona física"
    }`,
    `País de establecimiento: ${state.country || "—"}`,
    state.address ? `Dirección física / comercial: ${state.address.trim()}` : "",
    state.contactEmail
      ? `Canal de contacto directo para privacidad: ${state.contactEmail.trim()}`
      : "Canal de contacto: ver sección de contacto final.",
  ];
  sections.push(
    buildSection("2. RESPONSABLE DEL TRATAMIENTO DE DATOS", [
      "Los datos identificativos del responsable encargado de la custodia y tratamiento de la información son los siguientes:",
      buildBulletList(controllerDetails),
    ])
  );

  // 3. Categorías de datos recopilados
  const dataItems = state.dataCategories.map((k) => findLabel(DATA_CATEGORIES, k));
  sections.push(
    buildSection("3. CATEGORÍAS DE DATOS PERSONALES QUE RECOPILAMOS", [
      "En función de las funcionalidades utilizadas y del consentimiento otorgado, podemos recopilar y tratar las siguientes categorías de información:",
      dataItems.length > 0
        ? buildBulletList(dataItems)
        : "• No se han declarado categorías de datos personales específicas. Comprueba este apartado antes de su publicación definitiva.",
      "No recopilamos datos especialmente protegidos o sensibles (origen étnico, convicciones religiosas, datos de salud o afiliación sindical) salvo que se indique expresamente lo contrario con consentimiento explícito previo.",
    ])
  );

  // 4. Finalidades del tratamiento
  const purposeItems = state.purposes.map((k) => findLabel(PURPOSES, k));
  sections.push(
    buildSection("4. FINALIDADES DEL TRATAMIENTO", [
      "Tratamos los datos recopilados exclusivamente para fines legítimos, transparentes y proporcionados, entre los cuales se incluyen:",
      purposeItems.length > 0
        ? buildBulletList(purposeItems)
        : "• Prestar el servicio y posibilitar el funcionamiento de la aplicación.",
      "Nos comprometemos a no utilizar los datos personales para finalidades distintas o incompatibles con las aquí expuestas sin informar previamente al usuario y recabar su correspondiente autorización.",
    ])
  );

  // 5. Base jurídica (RGPD / GDPR)
  if (state.juris.gdpr) {
    sections.push(
      buildSection("5. BASES JURÍDICAS DEL TRATAMIENTO (CONFORME AL RGPD - UE 2016/679)", [
        "El tratamiento de tus datos personales se fundamenta en una o varias de las siguientes bases legales previstas en el Reglamento General de Protección de Datos:",
        buildBulletList([
          "Ejecución contractual (Art. 6.1.b RGPD): necesaria para dar de alta la cuenta, prestar el servicio contratado y gestionar las funcionalidades de la aplicación.",
          "Consentimiento expreso (Art. 6.1.a RGPD): para el envío de comunicaciones comerciales, el uso de cookies analíticas o de seguimiento publicitario, o el acceso a datos sensibles del dispositivo (como ubicación precisa).",
          "Obligación legal (Art. 6.1.c RGPD): cuando sea preceptivo para atender requerimientos judiciales, tributarios o de autoridades públicas competentes.",
          "Interés legítimo (Art. 6.1.f RGPD): para preservar la seguridad de las redes, prevenir el fraude y optimizar el rendimiento técnico de los sistemas, siempre que prevalezca el equilibrio con tus derechos fundamentales.",
        ]),
      ])
    );
  }

  // 6. Proveedores y destinatarios terceros
  if (state.thirdParties.length > 0) {
    const thirdPartyLines = state.thirdParties.map((tp) => {
      const parts = [`${tp.name || "Proveedor"}`];
      if (tp.service) parts.push(`Función: ${tp.service}`);
      if (tp.data) parts.push(`Datos tratados: ${tp.data}`);
      if (tp.purpose) parts.push(`Finalidad: ${tp.purpose}`);
      if (tp.policyUrl) parts.push(`Política de privacidad: ${tp.policyUrl}`);
      return parts.join(" | ");
    });

    sections.push(
      buildSection("6. ENCARGADOS DEL TRATAMIENTO Y DESTINATARIOS TERCEROS", [
        "Para prestar el servicio podemos compartir información estrictamente necesaria con proveedores externos de confianza que actúan en calidad de encargados del tratamiento bajo acuerdos vinculantes:",
        buildBulletList(thirdPartyLines),
        "No comercializamos, vendemos ni alquilamos tus datos personales a terceras partes bajo ningún concepto.",
      ])
    );
  }

  // 7. Transferencias internacionales
  if (state.transfers.international) {
    sections.push(
      buildSection("7. TRANSFERENCIAS INTERNACIONALES DE DATOS", [
        "Algunos de nuestros servidores o proveedores de servicios auxiliares pueden encontrarse ubicados fuera del país de residencia del usuario o fuera del Espacio Económico Europeo (EEE).",
        state.transfers.mechanisms
          ? `Garantías y salvaguardas aplicadas: ${state.transfers.mechanisms.trim()}`
          : "En tales supuestos, adoptamos las medidas contractuales y de seguridad exigibles para garantizar un nivel de protección sustancialmente equivalente al de la legislación de origen.",
      ])
    );
  }

  // 8. Plazos de conservación
  sections.push(
    buildSection("8. CONSERVACIÓN Y RETENCIÓN DE DATOS", [
      `Criterio temporal de conservación: ${
        state.retentionPeriod || "Durante la vigencia de la relación contractual."
      }`,
      state.retentionCriteria ? state.retentionCriteria.trim() : "",
      state.autoDeletion
        ? "La plataforma cuenta con mecanismos de depuración y eliminación automática de datos una vez alcanzados los periodos previstos."
        : "Los datos son depurados periódicamente tras verificar que han dejado de ser útiles para la finalidad original.",
      state.legalRetention
        ? "Determinados datos fiscales o contractuales podrán conservarse bloqueados durante los plazos legalmente fijados por la normativa tributaria y civil para atender posibles responsabilidades."
        : "",
      state.backupsInfo ? state.backupsInfo.trim() : "",
    ])
  );

  // 9. Medidas de seguridad técnicas y organizativas
  const securityItems = state.security.map((k) => findLabel(SECURITY_MEASURES, k));
  sections.push(
    buildSection("9. MEDIDAS DE SEGURIDAD TÉCNICAS Y ORGANIZATIVAS", [
      "Hemos implantado medidas técnicas y organizativas proporcionadas al riesgo para evitar la destrucción, alteración, pérdida accidental o el acceso no autorizado a los datos personales tratados:",
      securityItems.length > 0
        ? buildBulletList(securityItems)
        : "• Medidas básicas de control de acceso y protocolos seguros.",
      "A pesar de nuestros esfuerzos técnicos continuos, ningún sistema conectado a Internet es invulnerable al 100%. En caso de detectarse cualquier brecha de seguridad que entrañe un alto riesgo para tus derechos, se notificará con prontitud a las autoridades y a los usuarios afectados conforme a la ley.",
    ])
  );

  // 10. Derechos de los usuarios y cómo ejercerlos
  const rightsList = [
    "Derecho de Acceso: conocer qué datos personales tenemos sobre ti y cómo se tratan.",
    "Derecho de Rectificación: solicitar la corrección inmediata de datos inexactos o incompletos.",
    "Derecho de Supresión (al olvido): solicitar el borrado de tus datos cuando ya no sean requeridos.",
    "Derecho de Oposición: oponerte al tratamiento de tus datos por motivos basados en interés legítimo o mercadotecnia directa.",
    "Derecho a la Limitación del Tratamiento: solicitar la paralización cautelar del tratamiento en determinados supuestos legales.",
    "Derecho a la Portabilidad: recibir tus datos en un formato estructurado, de uso común y lectura mecánica.",
    "Derecho a Retirar el Consentimiento: revocar cualquier autorización previa en cualquier instante sin efectos retroactivos.",
  ];

  if (state.juris.gdpr) {
    rightsList.push(
      "Derecho a reclamar ante la autoridad de control en materia de protección de datos (ej. Agencia Española de Protección de Datos en España u homóloga en tu país)."
    );
  }

  if (state.juris.ccpa) {
    rightsList.push(
      "Derechos bajo la CCPA/CPRA (California): derecho a conocer la información recopilada, derecho a solicitar la eliminación, derecho a la no discriminación y derecho a solicitar que no se vendan ni compartan tus datos (Opt-Out of Sale/Share)."
    );
  }

  sections.push(
    buildSection("10. DERECHOS DEL USUARIO Y PROCEDIMIENTO DE EJERCICIO", [
      "Como titular de tus datos personales dispones de los siguientes derechos reconocidos por la legislación aplicable:",
      buildBulletList(rightsList),
      state.contactEmail
        ? `Para ejercitar cualquiera de estos derechos, envía una solicitud escrita junto con un justificante de tu identidad al correo electrónico: ${state.contactEmail}. Responderemos a tu solicitud en el plazo máximo estipulado por la ley aplicable.`
        : "Para ejercitar estos derechos puedes ponerte en contacto a través de los canales oficiales habilitados en la aplicación.",
    ])
  );

  // 11. Tecnologías de seguimiento y cookies
  if (
    state.cookies.necessary ||
    state.cookies.analytics ||
    state.cookies.advertising ||
    state.cookies.localStorage ||
    state.cookies.adIds
  ) {
    sections.push(
      buildSection("11. COOKIES Y TECNOLOGÍAS SIMILARES", [
        "Nuestra aplicación o sitio web utiliza cookies, almacenamiento local y tecnologías afines para su correcto funcionamiento, métricas de rendimiento y personalización. Para mayor detalle sobre cada categoría y cómo gestionarlas o desactivarlas, consulta nuestra Política de Cookies específica.",
      ])
    );
  }

  // 12. Menores de edad
  if (state.features.minors || state.audience === "minors") {
    sections.push(
      buildSection("12. TRATAMIENTO DE DATOS DE MENORES DE EDAD", [
        `La edad mínima autorizada para registrarse o utilizar el servicio es de ${
          state.minors.minAge || "16"
        } años.`,
        state.minors.parental
          ? "Exigimos la autorización expresa o verificación del consentimiento de padres o tutores legales antes de habilitar el acceso a usuarios que no alcancen la edad requerida."
          : "No recopilamos intencionadamente datos personales de menores de edad sin la debida autorización legal.",
        state.minors.specialContact
          ? `Para cualquier consulta, supresión o notificación urgente referida a cuentas de menores, puedes dirigirte prioritariamente a: ${state.minors.specialContact}.`
          : "Si un progenitor o tutor detecta que su representado ha proporcionado datos sin su consentimiento, puede contactarnos para proceder a la inmediata eliminación de la información.",
      ])
    );
  }

  // 13. Inteligencia Artificial
  if (state.features.ai) {
    sections.push(
      buildSection("13. FUNCIONALIDADES BASADAS EN INTELIGENCIA ARTIFICIAL", [
        state.ai.functions
          ? `Uso de tecnología de IA: ${state.ai.functions.trim()}`
          : "La Aplicación incorpora módulos asistidos por modelos de inteligencia artificial.",
        state.ai.dataSent
          ? `Datos transmitidos al proveedor de IA: ${state.ai.dataSent.trim()}`
          : "Solo se remite al motor de IA la información técnica indispensable para atender la petición requerida por el usuario.",
        state.ai.stored ? state.ai.stored.trim() : "",
        state.ai.training ? state.ai.training.trim() : "",
        state.ai.automated
          ? "Aviso sobre decisiones automatizadas: Se informa al usuario de que determinadas funciones evalúan parámetros de manera automatizada. El usuario tiene derecho a solicitar la intervención humana, expresar su punto de vista e impugnar la decisión cuando resulte jurídicamente exigible."
          : "",
      ])
    );
  }

  // 14. Modificaciones y actualizaciones
  sections.push(
    buildSection("14. MODIFICACIÓN DE LA PRESENTE POLÍTICA DE PRIVACIDAD", [
      "Nos reservamos el derecho de modificar o actualizar esta Política de Privacidad en cualquier momento para reflejar cambios legislativos, jurisprudenciales o modificaciones sustanciales en el funcionamiento de la Aplicación.",
      "Cualquier modificación relevante será comunicada oportunamente mediante avisos en la Aplicación, correo electrónico o la actualización visible de la fecha de entrada en vigor en el encabezado de este documento.",
    ])
  );

  // 15. Contacto
  sections.push(
    buildSection("15. CANAL DE CONTACTO", [
      state.contactEmail
        ? `Si tienes cualquier pregunta, sugerencia o reclamación relativa al tratamiento de tu privacidad o al contenido de esta política, puedes dirigirte en cualquier momento a: ${state.contactEmail}.`
        : "Para cualquier cuestión sobre el tratamiento de tus datos, utiliza el canal de soporte habitual dentro de la aplicación.",
    ])
  );

  return sections.join("\n\n");
}
