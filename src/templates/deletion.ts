import type { LegalDocsState } from "@/types";
import {
  buildDocumentHeader,
  buildSection,
  buildBulletList,
} from "@/core/template-engine/engine";

export function generateAccountDeletionPolicy(state: LegalDocsState): string {
  const sections: string[] = [];

  sections.push(
    buildDocumentHeader(state, "Política y Procedimiento de Eliminación de Cuentas y Datos")
  );

  // 1. Finalidad e instrucciones
  const deletionChannels: string[] = [];
  if (state.features.accountDeletion) {
    deletionChannels.push(
      "Directamente desde la aplicación: Accede a Ajustes > Mi Perfil / Seguridad > 'Eliminar mi cuenta' y confirma la acción siguiendo las instrucciones en pantalla."
    );
  }
  if (state.contactEmail) {
    deletionChannels.push(
      `Mediante solicitud por correo electrónico: Escribe a ${state.contactEmail} con el asunto 'Solicitud de Eliminación de Cuenta', indicando el nombre de usuario o correo asociado.`
    );
  }
  if (state.url) {
    deletionChannels.push(
      `Vía formulario web: Visita la sección de soporte o privacidad en ${state.url} para tramitar la baja de forma telemática.`
    );
  }

  sections.push(
    buildSection("1. PROCEDIMIENTO PARA SOLICITAR LA ELIMINACIÓN DE LA CUENTA", [
      `En cumplimiento con los requerimientos de transparencia y con las directrices de publicación en tiendas de aplicaciones móviles (Google Play Store y Apple App Store), ${
        state.responsibleName || "el Responsable"
      } garantiza a todos los usuarios de "${
        state.appName
      }" un procedimiento ágil, gratuito y accesible para solicitar la supresión completa de su perfil y datos asociados.`,
      "Puedes solicitar la baja definitiva de tu cuenta a través de los siguientes canales oficiales:",
      buildBulletList(deletionChannels),
    ])
  );

  // 2. Datos objeto de eliminación
  sections.push(
    buildSection("2. DATOS QUE SE SUPRIMEN DE FORMA PERMANENTE", [
      "Una vez verificada la titularidad de la cuenta y confirmada la solicitud, se procederá al borrado irreversible de los siguientes elementos:",
      buildBulletList([
        "Credenciales de acceso, contraseñas hasheadas y tokens de autenticación vinculados.",
        "Datos identificativos del perfil (nombre, correo electrónico, avatar, biografía, preferencias).",
        state.features.ugc ? "Contenidos, textos, publicaciones o archivos subidos por el usuario." : "",
        state.features.location ? "Historial de geolocalización o registros de ubicación almacenados." : "",
        "Métricas directas de actividad vinculadas a la identidad de tu cuenta.",
      ]),
    ])
  );

  // 3. Datos conservados por imperativo legal
  sections.push(
    buildSection("3. INFORMACIÓN QUE PUEDE CONSERVARSE POR OBLIGACIÓN LEGAL", [
      "No todos los registros pueden eliminarse instantáneamente si concurren obligaciones jurídicas imperativas:",
      buildBulletList([
        state.legalRetention
          ? "Datos de facturación, compras y transacciones: se conservarán bloqueados durante los plazos legalmente fijados por la normativa tributaria y mercantil (generalmente de 4 a 6 años según el país)."
          : "",
        "Registros técnicos de conexión: conservados durante los plazos de ciberseguridad exigibles por la legislación sectorial para esclarecer eventuales delitos telemáticos.",
        state.backupsInfo
          ? `Copias de seguridad del sistema: ${state.backupsInfo.trim()} (los datos en copias de respaldo se sobreescriben cíclicamente sin ser restaurados a entornos productivos).`
          : "Copias de seguridad: Se purgan de manera cíclica en los ciclos de rotación estándar de los centros de datos.",
      ]),
      "Los datos conservados permanecen bajo estricto bloqueo técnico, sin que puedan utilizarse para operaciones comerciales o de tratamiento activo.",
    ])
  );

  // 4. Plazos de respuesta y confirmación
  sections.push(
    buildSection("4. PLAZOS DE EJECUCIÓN Y CONFIRMACIÓN", [
      `Plazo orientativo de tramitación: ${
        state.retentionPeriod || "En un plazo máximo de 30 días hábiles a contar desde la recepción de la solicitud."
      }`,
      "Una vez culminado el proceso de supresión y depuración en bases de datos, el usuario recibirá una notificación confirmatoria a su correo electrónico y su sesión quedará definitivamente inhabilitada.",
    ])
  );

  // 5. Contacto
  sections.push(
    buildSection("5. CONSULTAS O RECLAMACIONES SOBRE BAJAS", [
      state.contactEmail
        ? `Si experimentas cualquier dificultad técnica para eliminar tu cuenta o tienes dudas sobre este procedimiento, ponte en contacto con nuestro equipo de privacidad en: ${state.contactEmail}.`
        : "Para asistencia, utiliza el canal de soporte de la aplicación.",
    ])
  );

  return sections.join("\n\n");
}
