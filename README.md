# LegalDocs Generator ⚖️

**LegalDocs Generator** es una aplicación web moderna, accesible y modular orientada a desarrolladores, creadores independientes, startups y equipos de producto digital para generar borradores estructurados de **Políticas de Privacidad**, **Términos y Condiciones**, **Avisos Legales**, **Políticas de Cookies**, **Eliminación de Cuentas** y **Fichas de Seguridad para Tiendas de Apps** (Google Play Store y Apple App Store).

---

## 🚀 Características Principales

- 🛡️ **Privacidad por diseño (100% cliente):** Ningún dato introducido se transmite a servidores ni servicios de terceros. Todo el procesamiento se realiza en la memoria local del navegador.
- ⚡ **Motor de reglas condicionales:** No sustituye simplemente variables; analiza las funciones declaradas (IA, pagos, menores, suscripciones, cookies, cuentas) para incorporar exclusivamente las cláusulas y avisos pertinentes.
- 📄 **6 Documentos legales configurables:**
  1. **Política de Privacidad** (adaptable a RGPD, CCPA y Latinoamérica).
  2. **Términos y Condiciones de Uso**.
  3. **Aviso Legal** (LSSI-CE y normativa de comercio electrónico).
  4. **Política de Cookies y Tecnologías Similares**.
  5. **Política de Eliminación de Cuentas y Datos** (requisito de Google Play y Apple).
  6. **Divulgación de Seguridad de Datos para Tiendas** (Data Safety / Nutritional Labels).
- ✏️ **Editor interactivo en tiempo real:** Modifica, revisa y amplía los borradores antes de descargarlos.
- 📥 **Exportación multiformato profesional:**
  - **PDF:** Numeración de páginas ("Página X de Y"), encabezados dinámicos, saltos de línea inteligentes y codificación correcta de caracteres españoles (á, é, í, ó, ú, ñ).
  - **HTML:** Código semántico limpio con hoja de estilos de impresión y sin scripts ejecutables.
  - **TXT:** Archivo plano UTF-8.
  - **Copiar al portapapeles** con confirmación y respaldo.
  - **Impresión directa** (`@media print`).
- 🌗 **Modo Oscuro y Claro:** Detección automática de preferencia del sistema y guardado local.
- ♿ **Accesibilidad WCAG 2.2 AA:** Estructura semántica, contraste optimizado, navegación por teclado y soporte para `prefers-reduced-motion`.
- ☁️ **Cloudflare Pages & Docker ready:** Encabezados de seguridad CSP, compresión Gzip y contenedor multi-stage Nginx listos para producción.

---

## 🛠️ Stack Tecnológico

- **Frontend Core:** TypeScript, HTML5 semántico, CSS3 moderno (Variables CSS, Grid, Flexbox).
- **Bundler & Dev Server:** [Vite](https://vitejs.dev/)
- **Validación de Datos:** [Zod](https://zod.dev/)
- **Generación de PDF:** [jsPDF](https://github.com/parallax/jsPDF)
- **Testing:** [Vitest](https://vitest.dev/)
- **Contenedores:** Docker (Node Alpine + Nginx Alpine)
- **CI/CD:** GitHub Actions

---

## 📂 Arquitectura del Proyecto

```text
LegalDoc/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de integración continua
├── public/
│   ├── favicon.svg              # Icono vectorial de la app
│   ├── manifest.webmanifest     # Manifiesto PWA
│   ├── robots.txt               # Directivas para buscadores
│   ├── sitemap.xml              # Mapa del sitio
│   ├── _headers                 # Cabeceras de seguridad Cloudflare Pages
│   └── _routes.json             # Enrutamiento Cloudflare Pages
├── src/
│   ├── components/
│   │   └── WizardSteps.ts       # Pasos interactivos del asistente y editor
│   ├── core/
│   │   ├── document-generator/  # Orquestador maestro de documentos
│   │   ├── document-rules/      # Motor de evaluación de reglas
│   │   ├── template-engine/     # Formateo determinista y sanitización
│   │   └── validation/          # Esquemas de validación Zod
│   ├── data/
│   │   ├── catalogs.ts          # Diccionarios de datos y estado inicial
│   │   ├── countries.json       # Catálogo de países
│   │   └── document-types.json  # Metadatos de documentos
│   ├── services/
│   │   ├── clipboard/           # Copia al portapapeles con fallback
│   │   ├── export/              # Descarga de TXT y HTML
│   │   ├── pdf/                 # Generación y paginación en PDF
│   │   └── storage/             # Gestión segura de localStorage
│   ├── styles/
│   │   └── main.css             # Sistema de diseño, temas y print CSS
│   ├── types/
│   │   └── index.ts             # Tipos e interfaces TypeScript
│   └── main.ts                  # Punto de entrada y controlador de la UI
├── tests/
│   └── unit/                    # Suite de pruebas unitarias
├── Dockerfile                   # Construcción multi-stage de producción
├── docker-compose.yml           # Orquestación con Docker Compose
├── nginx.conf                   # Configuración de Nginx y caché
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de TypeScript
└── vite.config.ts               # Configuración de Vite y Vitest
```

---

## 💻 Instalación y Uso Local

### Requisitos previos
- Node.js (versión 20 o superior recomendada).
- npm (versión 10 o superior).

### Pasos de ejecución:

1. **Clonar e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:5173`.

3. **Verificación de tipos TypeScript:**
   ```bash
   npm run typecheck
   ```

4. **Ejecutar pruebas unitarias:**
   ```bash
   npm test
   ```

5. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos estáticos optimizados se generarán en la carpeta `dist/`.

---

## 🐳 Despliegue con Docker

Para compilar y ejecutar la aplicación dentro de un contenedor Nginx optimizado:

```bash
# Con Docker Compose
docker compose up --build

# O directamente con Docker
docker build -t legaldocs-generator .
docker run -p 8080:80 legaldocs-generator
```

Accede a la aplicación en `http://localhost:8080`.

---

## ☁️ Despliegue en Cloudflare Pages

La aplicación está preparada para su despliegue estático continuo en **Cloudflare Pages**:
- **URL de producción:** [https://legaldocs-generator.pages.dev](https://legaldocs-generator.pages.dev)
- **Project name:** `legaldocs-generator`
- **Framework Preset:** `Vite` o `None`.
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- Los archivos `public/_headers` y `public/_routes.json` aplican automáticamente las cabeceras HTTP de seguridad (Content-Security-Policy, X-Frame-Options, etc.).

---

## ⚖️ Descargo de Responsabilidad Legal (Disclaimer)

> [!WARNING]
> Los documentos generados por esta herramienta son **borradores informativos de carácter orientativo** basados en los datos facilitados por el usuario y en plantillas estructuradas. **No constituyen asesoramiento jurídico profesional ni garantizan el cumplimiento pleno de la legislación aplicable en cada jurisdicción.** Antes de publicar o incorporar estos documentos en tus aplicaciones o sitios web, revisa detenidamente que describen con veracidad tus prácticas técnicas y considera consultar a un abogado especializado.

---

## 📄 Licencia

Este proyecto está distribuido bajo la [Licencia MIT](LICENSE).
