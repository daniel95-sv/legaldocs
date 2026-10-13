# Registro de Cambios (Changelog)

Todas las novedades y cambios notables en este proyecto se documentan en este archivo.

## [1.0.0] - 2026-10-13

### Añadido
- Asistente guiado por pasos (Wizard) con validación en tiempo real.
- Motor de plantillas modulares para 6 tipos de documentos:
  - Política de Privacidad
  - Términos y Condiciones
  - Aviso Legal
  - Política de Cookies y Tecnologías Similares
  - Política de Eliminación de Cuentas y Datos
  - Divulgación de Seguridad de Datos para Tiendas de Aplicaciones (Google Play / App Store)
- Sistema de reglas condicionales y recomendaciones jurídicas orientativas.
- Exportación profesional en PDF con numeración de páginas y formato multilínea.
- Exportación directa en TXT y HTML semántico sanitizado.
- Función de copia al portapapeles con confirmación y alternativa de respaldo.
- Editor integrado en tiempo real para personalizar borradores antes de exportar.
- Soporte para tema claro y tema oscuro con detección de preferencias del sistema.
- Persistencia local en `localStorage` con botón para purga total de datos.
- Configuración para despliegue estático en Cloudflare Pages (`_headers`, `_routes.json`).
- Contenedorización con Docker multi-stage y Docker Compose.
- Pipeline de integración continua (CI) en GitHub Actions.
- Suite completa de pruebas unitarias con Vitest.
