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

export function generateStoreDisclosure(state: LegalDocsState): string {
  const sections: string[] = [];

  sections.push(
    buildDocumentHeader(
      state,
      "Ficha de Divulgación de Seguridad de Datos para Tiendas de Aplicaciones (Google Play / App Store)"
    )
  );

  // 1. Finalidad del documento
  sections.push(
    buildSection("1. RESUMEN EJECUTIVO PARA TIENDAS DE APLICACIONES", [
      `Este documento resume las prácticas de recopilación, uso, compartición y seguridad de datos de "${
        state.appName
      }", concebido como guía técnica de apoyo para completar los formularios de 'Seguridad de los datos' de Google Play Console y 'Nutritional Privacy Labels' de Apple App Store Connect.`,
    ])
  );

  // 2. Datos recopilados y clasificados
  const dataList = state.dataCategories.map((k) => findLabel(DATA_CATEGORIES, k));
  sections.push(
    buildSection("2. TIPOS DE DATOS RECOPILADOS Y COMPARTIDOS", [
      "Categorías declaradas que la aplicación recopila o transmite fuera del dispositivo:",
      dataList.length > 0
        ? buildBulletList(dataList)
        : "• No se declaran datos recopilados fuera del dispositivo.",
    ])
  );

  // 3. Finalidades declaradas
  const purposeList = state.purposes.map((k) => findLabel(PURPOSES, k));
  sections.push(
    buildSection("3. FINALIDADES VINCULADAS A CADA DATO", [
      "Propósitos autorizados para el tratamiento de dicha información en el ecosistema de la app:",
      purposeList.length > 0
        ? buildBulletList(purposeList)
        : "• Funcionalidad básica de la aplicación.",
    ])
  );

  // 4. Compartición con proveedores externos
  const thirdPartyItems = state.thirdParties.map((tp) => {
    return `${tp.name} — Servicio: ${tp.service || "Auxiliar"} | Datos: ${
      tp.data || "Mínimos indispensables"
    } | Finalidad: ${tp.purpose || "Operativa"}`;
  });

  sections.push(
    buildSection("4. TRANSFERENCIA Y COMPARTICIÓN CON TERCEROS (SDKs Y PROVEEDORES)", [
      state.thirdParties.length > 0
        ? buildBulletList(thirdPartyItems)
        : "• No se declaran transferencias a terceros proveedores o redes publicitarias.",
      "Nota: Los SDKs de analítica o publicidad integrados en el binario computan como datos compartidos ante las políticas de las tiendas.",
    ])
  );

  // 5. Prácticas de seguridad de las tiendas
  const secItems = state.security.map((k) => findLabel(SECURITY_MEASURES, k));
  sections.push(
    buildSection("5. PRÁCTICAS Y GARANTÍAS DE SEGURIDAD", [
      "Declaración de estándares de seguridad conforme a los cuestionarios oficiales:",
      buildBulletList([
        state.security.includes("tls")
          ? "Cifrado en tránsito: Todos los datos transmitidos entre la app y los servidores viajan mediante protocolos criptográficos seguros (HTTPS/TLS)."
          : "Cifrado en tránsito no habilitado por defecto.",
        state.features.accountDeletion
          ? "Mecanismo de eliminación de datos y cuentas: La aplicación ofrece un mecanismo explícito para que los usuarios soliciten la eliminación total de sus cuentas y datos."
          : "Mecanismo de eliminación de datos: Debes habilitar y documentar un canal de baja si la app requiere registro de usuarios.",
        ...secItems,
      ]),
    ])
  );

  // 6. Información adicional o notas internas
  if (state.docs.storeDisclosureExtra?.trim()) {
    sections.push(
      buildSection("6. NOTAS TÉCNICAS COMPLEMENTARIAS DEL DESARROLLADOR", [
        state.docs.storeDisclosureExtra.trim(),
      ])
    );
  }

  return sections.join("\n\n");
}
