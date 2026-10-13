# Política de Seguridad y Privacidad

## Modelo de Privacidad por Diseño (Privacy by Design)

**LegalDocs Generator** ha sido diseñado con un enfoque estricto de privacidad local:
1. **Sin transmisión a servidores:** Toda la lógica de validación de formularios, evaluación de reglas y renderizado de plantillas se ejecuta íntegramente en el navegador web del usuario.
2. **Sin persistencia remota:** No existe base de datos ni telemetría que capture las respuestas introducidas en el asistente.
3. **Persistencia local controlada:** El progreso se almacena voluntariamente en el `localStorage` del cliente. El usuario puede purgar todos sus datos locales en cualquier momento mediante el botón "Borrar datos".
4. **Protección XSS y sin `eval()`:** No se evalúa código dinámicamente y todas las entradas de usuario se escapan y normalizan antes de cualquier inserción en el DOM o en exportaciones HTML.

## Notificación de Vulnerabilidades

Si descubres una posible vulnerabilidad de seguridad en esta aplicación o en sus dependencias, por favor no abras una incidencia pública. Reporta la información de forma privada al equipo de desarrollo para coordinar su subsanación.
