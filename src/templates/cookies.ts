import type { LegalDocsState } from "@/types";
import {
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";

export function generateCookiesPolicy(state: LegalDocsState): string {
  const sections: string[] = [];

  sections.push(buildDocumentHeader(state, "Política de Cookies y Tecnologías de Seguimiento"));

  // 1. Definición
  sections.push(
    buildSection("1. ¿QUÉ SON LAS COOKIES Y TECNOLOGÍAS SIMILARES?", [
      `En la aplicación y plataforma web "${state.appName}" empleamos cookies, almacenamiento local del navegador (HTML5 Web Storage), píxeles e identificadores de dispositivo (en adelante denominados genéricamente "Cookies") para posibilitar el inicio de sesión, recordar tus preferencias y evaluar la navegación.`,
      "Las cookies son pequeños ficheros de datos que se descargan o alojan en tu terminal (ordenador, smartphone o tablet) al acceder a determinadas páginas o interactuar con una aplicación, permitiendo almacenar y recuperar información sobre tus hábitos de navegación o tu equipo.",
    ])
  );

  // 2. Categorías utilizadas
  const usedCategories: string[] = [];
  if (state.cookies.necessary) {
    usedCategories.push(
      "Cookies técnicas y estrictamente necesarias: Son imprescindibles para la operatividad del servicio (mantener la sesión autenticada, equilibrar la carga del servidor, gestionar el carrito de compra o recordar ajustes de seguridad). No requieren el consentimiento del usuario para su instalación."
    );
  }
  if (state.cookies.analytics) {
    usedCategories.push(
      "Cookies analíticas o de rendimiento: Permiten cuantificar el número de usuarios, analizar el tiempo de permanencia y conocer qué secciones son más populares de forma estadística y anonimizada para mejorar la experiencia de navegación."
    );
  }
  if (state.cookies.advertising) {
    usedCategories.push(
      "Cookies publicitarias y de seguimiento comportamental: Gestionan la frecuencia y el formato de los impactos publicitarios, pudiendo elaborar perfiles de navegación para mostrar anuncios acordes a tus intereses declarados o inferidos."
    );
  }
  if (state.cookies.localStorage) {
    usedCategories.push(
      "Almacenamiento local (localStorage / sessionStorage): Empleado para almacenar información persistente del lado del cliente, tales como la selección de modo oscuro/claro o el borrador local de formularios en el navegador."
    );
  }
  if (state.cookies.adIds) {
    usedCategories.push(
      "Identificadores publicitarios para móviles (IDFA en iOS, GAID en Android): Mecanismos propios del sistema operativo móvil empleados para atribución de descargas y medición del impacto de campañas."
    );
  }

  sections.push(
    buildSection("2. TIPOS DE TECNOLOGÍAS UTILIZADAS EN ESTE SERVICIO", [
      "En función de las funcionalidades que tengas activas, utilizamos las siguientes categorías de cookies y almacenamiento:",
      usedCategories.length > 0
        ? buildBulletList(usedCategories)
        : "• No se han declarado tecnologías de seguimiento activas. Revisa esta sección antes de publicar.",
    ])
  );

  // 3. Gestión y consentimiento
  sections.push(
    buildSection("3. GESTIÓN DEL CONSENTIMIENTO Y CONFIGURACIÓN", [
      state.cookies.analytics || state.cookies.advertising
        ? "Consentimiento previo: Para las cookies de analítica y publicidad, solicitamos tu consentimiento informado antes de su activación. Puedes aceptar, rechazar o configurar tus opciones en cualquier instante desde el banner o panel de configuración de privacidad habilitado."
        : "No utilizamos cookies publicitarias o de analítica invasiva que requieran consentimiento previo independiente.",
      "Nota técnica relevante: La publicación de este documento informativo no exime de la obligación de disponer de una herramienta técnica de gestión del consentimiento (CMP / Cookie Banner) cuando la normativa territorial (como la Directiva ePrivacy en la UE) así lo requiera.",
    ])
  );

  // 4. Desactivación desde navegadores
  sections.push(
    buildSection("4. CÓMO BLOQUEAR O ELIMINAR COOKIES DESDE TU NAVEGADOR", [
      "Puedes permitir, bloquear o suprimir las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador que utilices:",
      buildBulletList([
        "Google Chrome: Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.",
        "Mozilla Firefox: Ajustes > Privacidad y seguridad > Cookies y datos del sitio.",
        "Apple Safari: Preferencias > Privacidad > Bloquear todas las cookies.",
        "Microsoft Edge: Configuración > Cookies y permisos del sitio.",
      ]),
      "Ten presente que deshabilitar cookies técnicas puede impedir el funcionamiento correcto de funciones básicas como mantener la sesión iniciada o guardar el progreso de navegación.",
    ])
  );

  // 5. Contacto
  sections.push(
    buildSection("5. ACTUALIZACIONES Y CONTACTO", [
      "Esta Política de Cookies puede ser revisada y actualizada periódicamente en función de los cambios en las tecnologías aplicadas o de directrices de las autoridades de control.",
      state.contactEmail
        ? `Si tienes dudas sobre el tratamiento de cookies en nuestra aplicación, puedes dirigirte a: ${state.contactEmail}.`
        : "Para consultas sobre cookies, utiliza el canal de soporte principal.",
    ])
  );

  return sections.join("\n\n");
}
