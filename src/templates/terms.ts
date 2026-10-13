import type { LegalDocsState } from "@/types";
import {
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";

export function generateTermsAndConditions(state: LegalDocsState): string {
  const sections: string[] = [];

  // Header
  sections.push(buildDocumentHeader(state, "Términos y Condiciones de Uso"));

  // 1. Objeto
  sections.push(
    buildSection("1. OBJETO Y ACEPTACIÓN DE LOS TÉRMINOS", [
      `El presente documento establece los Términos y Condiciones generales (en adelante, "los Términos") que rigen el acceso, descarga y uso de la aplicación "${
        state.appName
      }" (en adelante, "la Aplicación"), propiedad y bajo titularidad de ${
        state.responsibleName || "el titular"
      }.`,
      state.description
        ? `Objeto del servicio: ${state.description.trim()}`
        : "La Aplicación proporciona los servicios y prestaciones descritos en su entorno interactivo o documentación comercial.",
      `El registro, navegación o utilización continuada de la Aplicación atribuye la condición de Usuario y constituye la aceptación íntegra, expresa y sin reservas de todos y cada uno de los Términos vigentes en el momento del acceso. Si el usuario no estuviere conforme con el tenor de las presentes cláusulas, deberá abstenerse de utilizar la Aplicación.`,
    ])
  );

  // 2. Identificación del titular
  sections.push(
    buildSection("2. DATOS IDENTIFICATIVOS DEL TITULAR", [
      "De conformidad con las leyes mercantiles y de servicios de la sociedad de la información, se ponen a disposición los datos de la entidad titular:",
      buildBulletList([
        `Denominación / Titular: ${state.responsibleName || "—"}`,
        `Naturaleza: ${
          state.responsibleType === "company"
            ? "Sociedad / Persona jurídica"
            : "Desarrollador independiente / Persona física"
        }`,
        `País: ${state.country || "—"}`,
        state.address ? `Domicilio: ${state.address.trim()}` : "",
        state.contactEmail ? `Correo de atención y notificaciones: ${state.contactEmail.trim()}` : "",
        state.url ? `Sitio web oficial: ${state.url.trim()}` : "",
      ]),
    ])
  );

  // 3. Requisitos y capacidad
  sections.push(
    buildSection("3. CAPACIDAD LEGAL Y CONDICIONES DE ACCESO", [
      "El servicio está dirigido a personas físicas mayores de edad con plena capacidad de obrar y contratar conforme a su ordenamiento jurídico.",
      state.features.minors || state.audience === "minors"
        ? `En caso de usuarios menores de edad (edad mínima requerida de ${
            state.minors.minAge || "16"
          } años), el acceso quedará condicionado al conocimiento y autorización previa y documentada de sus padres, tutores o representantes legales, quienes responderán de los actos efectuados por los menores a su cargo.`
        : "Si el usuario accede en representación de una persona jurídica o entidad mercantil, declara y garantiza contar con los poderes de representación necesarios para obligar a dicha entidad a los presentes Términos.",
      "Asimismo, el usuario se compromete a respetar en todo momento las condiciones complementarias de distribución y uso estipuladas por las plataformas desde las cuales descargue o ejecute la Aplicación (Google Play, Apple App Store, navegadores web, etc.).",
    ])
  );

  // 4. Registro y cuentas
  if (state.features.accounts) {
    sections.push(
      buildSection("4. REGISTRO, CUENTAS DE USUARIO Y SEGURIDAD", [
        "Para acceder a determinadas funcionalidades es necesario completar el proceso de registro facilitando información veraz, completa y debidamente actualizada.",
        "El Usuario es el único responsable de custodiar la confidencialidad de sus credenciales de acceso (nombre de usuario, contraseñas o tokens de sesión) y de todas las acciones efectuadas desde su cuenta personal.",
        state.features.oauth
          ? "Si el registro o inicio de sesión se efectúa mediante proveedores de identidad externos (como Google, Apple o similares), el usuario queda sujeto simultáneamente a las políticas y condiciones operativas de dichas plataformas proveedoras."
          : "",
        "En caso de sospecha fundada de extravío, sustracción o uso no autorizado de las credenciales, el Usuario deberá comunicarlo de inmediato al Titular para proceder al bloqueo cautelar de la cuenta.",
        state.features.accountDeletion
          ? "El usuario tiene el derecho de solicitar la baja definitiva y eliminación de su cuenta en cualquier momento conforme al procedimiento especificado en la Política de Eliminación de Cuentas y Datos."
          : "",
      ])
    );
  }

  // 5. Obligaciones y conductas prohibidas
  sections.push(
    buildSection("5. OBLIGACIONES DEL USUARIO Y CONDUCTAS PROHIBIDAS", [
      "El Usuario se compromete a hacer un uso diligente, correcto y lícito de la Aplicación. Queda taxativamente prohibido:",
      buildBulletList([
        "Utilizar el servicio con propósitos fraudulentos, delictivos o contrarios a la legislación imperativa vigente.",
        "Vulnerar los derechos de propiedad intelectual, industrial, secreto comercial o intimidad de terceros.",
        "Introducir, transmitir o difundir virus informáticos, troyanos, gusanos o cualquier software malicioso o lesivo para los sistemas del Titular o de otros usuarios.",
        "Intentar vulnerar, deshabilitar, eludir o poner a prueba los mecanismos de autenticación, cortafuegos o medidas de seguridad implementadas.",
        "Realizar ingeniería inversa, descompilación o desmontaje del código fuente de la Aplicación, salvo en los supuestos expresamente habilitados por ley.",
        "Desplegar robots, spiders, scripts automatizados o técnicas de scraping abusivo que saturen o degraden la disponibilidad de los servidores.",
        "Hacerse pasar por otra persona o entidad física o jurídica, o falsificar encabezados de comunicaciones de red.",
      ]),
    ])
  );

  // 6. Propiedad Intelectual
  sections.push(
    buildSection("6. PROPIEDAD INTELECTUAL E INDUSTRIAL", [
      `Todos los derechos sobre la Aplicación "${
        state.appName
      }", incluyendo sin carácter restrictivo el código fuente, la arquitectura de software, bases de datos, diseños gráficos, interfaces, textos, logotipos, marcas comerciales y nombres de dominio, son propiedad exclusiva de ${
        state.responsibleName || "el Titular"
      } o de sus legítimos licenciantes.`,
      "El Titular otorga al Usuario una licencia personal, limitada, no transferible, no sublicenciable y revocable para utilizar la Aplicación en sus dispositivos compatibles con fines estrictamente autorizados. Esta licencia en ningún caso confiere título de propiedad ni derecho de explotación económica ajeno a las funcionalidades previstas.",
    ])
  );

  // 7. Contenido del usuario (UGC)
  if (state.features.ugc) {
    sections.push(
      buildSection("7. CONTENIDO GENERADO POR EL USUARIO (UGC)", [
        "El Usuario conservará en todo momento la titularidad de los derechos sobre los textos, imágenes, comentarios o archivos que decida publicar, subir o transmitir a través de la Aplicación.",
        "Al publicar contenidos en la plataforma, el Usuario concede al Titular una licencia no exclusiva, gratuita, mundial y durante la vigencia legal del derecho para alojar, reproducir, adaptar y mostrar dicho material con la única finalidad de prestar y difundir el servicio según las preferencias del Usuario.",
        "El Usuario garantiza que ostenta todas las titularidades, licencias o consentimientos necesarios sobre los contenidos que aporta y que no infringen derechos de terceros.",
        "El Titular se reserva el derecho de supervisar, moderar o retirar de manera inmediata cualquier contenido que vulnere los presentes Términos o la ley aplicable, sin derecho a compensación para el infractor.",
      ])
    );
  }

  // 8. Pagos y suscripciones
  if (state.features.payments || state.features.subscriptions) {
    const paymentClauses: string[] = [];
    if (state.features.payments) {
      paymentClauses.push(
        "Modalidades y procesamiento de pago: Los importes correspondientes a compras o transacciones dentro de la aplicación se gestionarán mediante plataformas y pasarelas de pago de terceros certificadas. El Titular no almacena directamente datos bancarios o números de tarjeta de crédito."
      );
      paymentClauses.push(
        "Precios e impuestos: Todos los precios informados incluirán los tributos aplicables con arreglo a la normativa territorial vigente, salvo advertencia en contrario."
      );
    }
    if (state.features.subscriptions) {
      paymentClauses.push(
        "Suscripciones periódicas: La contratación de planes de suscripción supone la facturación reiterada y por adelantado conforme al ciclo contratado (mensual, anual, etc.). Salvo cancelación explícita antes de la fecha límite del periodo en curso, la suscripción se renovará automáticamente."
      );
      paymentClauses.push(
        "Gestión de bajas de suscripción: El Usuario podrá cancelar la renovación automática en cualquier momento desde los ajustes de su cuenta o a través de la tienda de aplicaciones correspondiente (Google Play Subscriptions / Apple In-App Purchases). La cancelación surtirá efectos al expirar el ciclo ya abonado."
      );
      paymentClauses.push(
        "Desistimiento y reembolsos: Las políticas de reembolso se regirán por los plazos de desistimiento de los derechos del consumidor y por los reglamentos estipulados por la tienda o pasarela de pago emisora."
      );
    }
    sections.push(buildSection("8. CONDICIONES ECONÓMICAS, PAGOS Y SUSCRIPCIONES", paymentClauses));
  }

  // 9. Disponibilidad del servicio y soporte
  sections.push(
    buildSection("9. DISPONIBILIDAD DEL SERVICIO Y MODIFICACIONES TÉCNICAS", [
      "El Titular realiza sus mejores esfuerzos técnicos para garantizar la continuidad y estabilidad de la Aplicación. Sin embargo, el servicio se suministra en modalidad 'tal cual' ('as is') y según disponibilidad.",
      "El Titular se reserva la potestad de suspender temporalmente el acceso con motivo de operaciones de mantenimiento técnico, actualizaciones de seguridad, caídas fortuitas en redes de comunicaciones o fuerza mayor, sin que tales contingencias originen derecho a compensación económica.",
    ])
  );

  // 10. Limitación de responsabilidad
  sections.push(
    buildSection("10. LIMITACIÓN DE RESPONSABILIDAD", [
      "En la medida máxima autorizada por la normativa aplicable, el Titular declina toda responsabilidad por:",
      buildBulletList([
        "Daños indirectos, emergentes, lucro cesante o pérdidas de datos derivados del uso o imposibilidad de uso de la Aplicación.",
        "Fallos de conexión de red imputables a los proveedores de telecomunicaciones del Usuario.",
        "Incompatibilidades de software o hardware ajenas al diseño estándar de la aplicación.",
        "Contenidos o comportamientos de terceros que interactúen a través de la plataforma.",
      ]),
      "Ninguna cláusula de este documento pretende restringir o excluir aquellas responsabilidades que por ley imperativa de protección al consumidor o derecho imperativo no puedan ser limitadas por pacto contractual.",
    ])
  );

  // 11. Suspensión y terminación
  sections.push(
    buildSection("11. SUSPENSIÓN Y RESOLUCIÓN DEL CONTRATO", [
      "El Titular podrá rescindir, restringir o suspender de manera unilateral el acceso a la cuenta y al uso de la Aplicación ante cualquier incumplimiento grave o reiterado de los presentes Términos, mediando notificación motivada siempre que resulte materialmente posible.",
      "El Usuario puede resolver su relación en cualquier momento desinstalando la aplicación y cursando la baja de su perfil si estuviese registrado.",
    ])
  );

  // 12. Legislación aplicable y fuero judicial
  sections.push(
    buildSection("12. LEY APLICABLE Y RESOLUCIÓN DE CONFLICTOS", [
      `Los presentes Términos se regirán e interpretarán con arreglo a las leyes sustantivas de ${
        state.country || "la jurisdicción del titular"
      }.`,
      "En caso de discrepancia o litigio, las partes intentarán resolver de buena fe y de forma amistosa la controversia. En su defecto, las partes se someten a la competencia de los juzgados y tribunales que resulten territorialmente competentes conforme a las normas procesales y de protección a consumidores aplicables.",
    ])
  );

  // 13. Contacto
  sections.push(
    buildSection("13. ATENCIÓN AL CLIENTE Y COMUNICACIONES", [
      state.contactEmail
        ? `Para cualquier comunicación, reclamación o consulta respecto a estos Términos, el Usuario puede dirigirse al correo: ${state.contactEmail}.`
        : "Para cualquier cuestión sobre estos términos, utiliza los canales habituales habilitados en la plataforma.",
    ])
  );

  return sections.join("\n\n");
}
