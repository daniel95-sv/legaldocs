# PROMPT MAESTRO DE IMPLEMENTACIÓN
## Generador de Políticas de Privacidad y Términos y Condiciones para Aplicaciones

### 1. Rol y misión

Actúa como un equipo multidisciplinario de nivel senior integrado por:

- Arquitecto de software.
- Desarrollador frontend y backend.
- Especialista en HTML5, CSS3, JavaScript y TypeScript.
- Diseñador UX/UI.
- Especialista en SEO técnico.
- Especialista en accesibilidad WCAG.
- Ingeniero de seguridad y privacidad.
- Especialista en generación de documentos PDF.
- Especialista en calidad de software y testing.
- DevOps / Cloud Engineer.
- Consultor de producto digital.
- Especialista en documentación legal estructurada y gestión de plantillas.

Tu misión es diseñar, desarrollar, probar y documentar una aplicación web completa, moderna y preparada para producción denominada provisionalmente:

**LegalDocs Generator**

Nombre alternativo configurable: **LegalKit Apps**.

El producto permitirá generar documentos legales orientativos para aplicaciones móviles, aplicaciones web, SaaS y otros productos digitales mediante un asistente guiado.

El usuario completará un formulario con la información de su proyecto y la aplicación generará documentos personalizados que podrá:

- Visualizar.
- Editar.
- Copiar.
- Descargar en PDF.
- Descargar en TXT.
- Exportar en HTML.
- Imprimir.
- Volver a generar después de modificar sus datos.

El sistema debe priorizar la privacidad, la claridad legal, la precisión de los datos introducidos y la facilidad de uso.

**No construir una simple página que sustituya palabras en una plantilla. Construir una herramienta documental completa, modular y extensible.**

---

# 2. Objetivo del producto

Desarrollar una plataforma que ayude a los usuarios a preparar borradores de documentos legales para sus aplicaciones.

Documentos iniciales:

1. Política de privacidad.
2. Términos y condiciones.
3. Aviso legal.
4. Política de cookies, cuando corresponda.
5. Política de eliminación de cuentas y datos, cuando corresponda.
6. Divulgación de recopilación y tratamiento de datos para tiendas de aplicaciones, cuando corresponda.

Los documentos disponibles deben depender de las características reales del producto.

No generar documentos innecesarios ni incluir declaraciones que contradigan las prácticas reales de la aplicación del usuario.

El sistema debe permitir ampliar posteriormente el catálogo de documentos.

---

# 3. Stack tecnológico

Utilizar preferentemente:

- HTML5 semántico.
- CSS3.
- TypeScript.
- Vite.
- JavaScript moderno.
- ES Modules.
- CSS Grid.
- Flexbox.
- APIs nativas del navegador.

Para la primera versión, utilizar una arquitectura frontend-first.

Se puede incorporar React, Vue u otro framework si mejora de forma justificada el mantenimiento de formularios complejos.

No utilizar un framework pesado sin necesidad.

### Librerías recomendadas

Evaluar las siguientes:

- Zod: validación de formularios y configuraciones.
- jsPDF o pdf-lib: generación de PDF.
- Lucide: iconos.
- Vitest: pruebas unitarias.
- Playwright: pruebas E2E.
- ESLint: análisis estático.
- Prettier: formato de código.

Elegir una librería principal para PDF y justificar la decisión.

No incorporar dependencias redundantes.

---

# 4. Arquitectura del proyecto

Organizar el proyecto por responsabilidades.

Estructura sugerida:

```text
legal-docs-generator/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.webmanifest
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Wizard/
│   │   ├── Forms/
│   │   ├── DocumentPreview/
│   │   ├── DocumentEditor/
│   │   ├── ExportMenu/
│   │   ├── FAQ/
│   │   ├── Modal/
│   │   └── UI/
│   │
│   ├── core/
│   │   ├── document-generator/
│   │   ├── template-engine/
│   │   ├── validation/
│   │   ├── placeholders/
│   │   └── document-rules/
│   │
│   ├── templates/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── cookies/
│   │   └── account-deletion/
│   │
│   ├── services/
│   │   ├── pdf/
│   │   ├── clipboard/
│   │   └── export/
│   │
│   ├── data/
│   │   ├── countries.json
│   │   ├── document-types.json
│   │   └── questions.json
│   │
│   ├── config/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── main.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .dockerignore
├── .env.example
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
└── LICENSE
```

Puedes ajustar la estructura si una alternativa más sencilla satisface los requisitos.

Evita la sobreingeniería.

---

# 5. Flujo principal de usuario

Implementar un asistente paso a paso.

Flujo recomendado:

```text
Inicio
  ↓
Tipo de aplicación
  ↓
Datos del responsable
  ↓
País y jurisdicción
  ↓
Datos recopilados
  ↓
Finalidades del tratamiento
  ↓
Servicios de terceros
  ↓
Seguridad y conservación
  ↓
Configuración de documentos
  ↓
Revisión de respuestas
  ↓
Generación de documentos
  ↓
Vista previa y edición
  ↓
Copiar o descargar
```

El asistente debe permitir:

- Volver a pasos anteriores.
- Corregir respuestas.
- Mostrar progreso.
- Guardar temporalmente el estado local.
- Reiniciar el formulario.
- Identificar preguntas obligatorias.
- Explicar por qué se solicita cada dato.
- Mostrar campos condicionales según las respuestas.

No mostrar todas las preguntas en una página interminable.

---

# 6. Datos generales del proyecto

Solicitar:

- Nombre de la aplicación.
- Nombre comercial o empresa responsable.
- Tipo de aplicación.
- Descripción del producto.
- URL oficial.
- Correo de contacto.
- País del responsable.
- Dirección comercial, si corresponde.
- Fecha de entrada en vigor.
- Idioma del documento.
- Público objetivo.
- Plataformas en las que está disponible.

Tipos de aplicación:

- Aplicación Android.
- Aplicación iOS.
- Aplicación web.
- SaaS.
- Aplicación de escritorio.
- Marketplace.
- Plataforma educativa.
- Aplicación de comercio electrónico.
- Aplicación de comunidad.
- Otra.

No exigir datos que no sean necesarios.

Permitir que un desarrollador independiente genere documentos sin tener una empresa constituida, cuando la plantilla lo permita.

No inventar nombres legales, direcciones ni datos de contacto.

---

# 7. Información sobre la aplicación

Preguntar si la aplicación:

- Requiere crear una cuenta.
- Permite iniciar sesión con proveedores externos.
- Tiene perfiles públicos.
- Permite publicar contenido.
- Permite comentarios o mensajes.
- Incluye pagos.
- Utiliza suscripciones.
- Muestra publicidad.
- Tiene analítica.
- Utiliza inteligencia artificial.
- Recopila información de ubicación.
- Permite subir archivos.
- Incluye funciones sociales.
- Está dirigida a menores.
- Permite eliminar cuentas.

Las respuestas deben determinar qué secciones del documento son necesarias.

Si el usuario responde que una funcionalidad no existe, no incluir cláusulas que afirmen que sí existe.

---

# 8. Recopilación de datos personales

Implementar una sección detallada sobre datos recopilados.

Opciones:

- Nombre.
- Correo electrónico.
- Número de teléfono.
- Nombre de usuario.
- Dirección postal.
- Fecha de nacimiento.
- Ubicación aproximada.
- Ubicación precisa.
- Dirección IP.
- Identificadores de dispositivo.
- Datos de uso.
- Registros técnicos.
- Cookies.
- Datos de pago gestionados por proveedores.
- Fotografías.
- Archivos.
- Audio.
- Información proporcionada por el usuario.
- Datos recopilados automáticamente.
- Otros datos especificados.

Permitir distinguir entre:

1. Datos obligatorios.
2. Datos opcionales.
3. Datos recopilados automáticamente.
4. Datos gestionados directamente por proveedores externos.

No marcar datos como recopilados simplemente porque aparecen en una lista.

La generación debe reflejar exclusivamente las respuestas del usuario.

---

# 9. Finalidades del tratamiento

Preguntar para qué se utilizan los datos.

Ejemplos:

- Crear y administrar cuentas.
- Proporcionar funcionalidades.
- Procesar pagos.
- Gestionar suscripciones.
- Atender consultas.
- Enviar comunicaciones operativas.
- Enviar marketing.
- Personalizar la experiencia.
- Detectar fraude.
- Proteger la seguridad.
- Cumplir obligaciones legales.
- Analizar el uso.
- Mejorar el producto.
- Mostrar publicidad.
- Entrenar o evaluar modelos de IA, si realmente corresponde.

No asumir que todas las finalidades son aplicables.

Permitir seleccionar múltiples opciones.

Diferenciar entre comunicaciones necesarias y comunicaciones comerciales.

No declarar que se utiliza información para entrenar modelos si el usuario no ha indicado esa práctica.

---

# 10. Servicios de terceros

Crear una sección para proveedores externos.

Ejemplos de categorías:

- Hosting.
- Bases de datos.
- Autenticación.
- Analítica.
- Publicidad.
- Procesamiento de pagos.
- Envío de correos.
- Atención al cliente.
- Almacenamiento de archivos.
- Servicios de IA.
- Monitorización de errores.
- Notificaciones push.

Permitir introducir:

- Nombre del proveedor.
- Servicio utilizado.
- Datos que recibe.
- Finalidad.
- Enlace a su política de privacidad.

No incluir proveedores ficticios.

No afirmar que una empresa específica cumple todas las obligaciones legales por el mero hecho de utilizar sus servicios.

Los datos introducidos deben incorporarse a las secciones pertinentes del documento.

---

# 11. País y jurisdicción

Solicitar el país donde está establecido el responsable del tratamiento.

Permitir identificar, cuando corresponda:

- País de establecimiento.
- Países donde opera.
- Países a los que se dirige.
- Regiones de los usuarios.
- Si se dirige a usuarios de la Unión Europea.
- Si se dirige a usuarios de California.
- Si opera en otras jurisdicciones relevantes.

No inferir que una legislación aplica exclusivamente por el país seleccionado.

La aplicabilidad legal puede depender de otros factores, como el lugar de establecimiento, los usuarios afectados, el tipo de datos y las actividades de tratamiento.

Implementar una estructura de reglas jurisdiccionales extensible.

Si no existe una plantilla revisada para una jurisdicción determinada, mostrar una advertencia clara y utilizar únicamente una plantilla general identificada como orientativa.

No afirmar que el documento garantiza el cumplimiento legal.

---

# 12. Derechos de los usuarios

Preparar secciones configurables sobre los derechos aplicables.

Según la jurisdicción y las prácticas reales, considerar:

- Acceso.
- Rectificación.
- Eliminación.
- Oposición.
- Limitación.
- Portabilidad.
- Retirada del consentimiento.
- Reclamación ante la autoridad competente.
- Preferencias de comunicaciones comerciales.

No presentar una lista universal como si todos los derechos fueran aplicables en todos los países y circunstancias.

Cuando se solicite una dirección para ejercer derechos, utilizar el contacto proporcionado por el usuario.

No inventar autoridades de protección de datos ni direcciones oficiales.

---

# 13. Conservación y eliminación de datos

Preguntar:

- Cuánto tiempo se conservan los datos.
- Qué criterios determinan la conservación.
- Si existe eliminación automática.
- Si el usuario puede solicitar la eliminación.
- Si es posible eliminar una cuenta.
- Si existen datos que deban conservarse por obligación legal.
- Qué ocurre con las copias de seguridad.

No asumir que todos los datos se eliminan inmediatamente.

No prometer que la eliminación es irreversible o instantánea si el sistema no lo garantiza.

Generar el texto a partir de las respuestas del usuario.

---

# 14. Seguridad y transferencias internacionales

Preguntar sobre las prácticas reales de seguridad.

Permitir describir medidas como:

- Control de acceso.
- Cifrado en tránsito.
- Cifrado en reposo.
- Copias de seguridad.
- Monitorización.
- Gestión de incidentes.
- Protección de cuentas.

No afirmar que una aplicación utiliza cifrado, auditorías o certificaciones que no posee.

Si hay transferencias internacionales, preguntar si existen mecanismos de protección o acuerdos aplicables.

No generar afirmaciones de cumplimiento basadas en suposiciones.

---

# 15. Cookies y tecnologías similares

Incluir una sección condicional.

Preguntar si la aplicación utiliza:

- Cookies necesarias.
- Cookies analíticas.
- Cookies publicitarias.
- Almacenamiento local.
- Identificadores publicitarios.
- Tecnologías de seguimiento.

Si no utiliza cookies, no generar una política de cookies afirmando lo contrario.

Si utiliza tecnologías que puedan requerir consentimiento, advertir que el documento legal por sí solo no implementa un mecanismo de consentimiento.

El generador no debe presentar una política escrita como sustituto de una configuración real de cookies o de una plataforma de gestión del consentimiento.

---

# 16. Inteligencia artificial

Si la aplicación utiliza IA, preguntar:

- Qué funciones utilizan IA.
- Qué datos se envían al proveedor.
- Si los datos se almacenan.
- Si se utilizan para entrenamiento.
- Si el usuario puede introducir datos personales.
- Si existen decisiones automatizadas relevantes.

No generar cláusulas sobre IA si no corresponde.

No afirmar que los proveedores no almacenan datos sin información verificable.

Mostrar una advertencia cuando el tratamiento descrito pueda requerir una evaluación legal adicional.

---

# 17. Menores de edad

Preguntar si la aplicación está dirigida a menores o permite su uso.

Si corresponde, recopilar información sobre:

- Edad mínima prevista.
- Mecanismos de consentimiento parental, si son necesarios.
- Tipos de datos recopilados.
- Restricciones de acceso.
- Eliminación de datos.
- Contacto para consultas relacionadas con menores.

No utilizar una edad universal para todos los países.

No generar garantías de cumplimiento de las leyes de protección infantil.

Si el producto está dirigido a menores, mostrar una advertencia destacada para obtener revisión especializada.

---

# 18. Plantillas legales

Crear un sistema de plantillas modulares.

Separar:

- Estructura del documento.
- Contenido legal.
- Variables.
- Condiciones.
- Reglas de inclusión.
- Información proporcionada por el usuario.
- Metadatos de la plantilla.

Ejemplo conceptual:

```text
template:
  id: privacy-general-es
  version: 1.0.0
  language: es
  jurisdiction: general
  reviewedAt: null
  sections:
    - introduction
    - data_collected
    - purposes
    - third_parties
    - retention
    - security
    - user_rights
    - contact
```

La estructura es orientativa y debe adaptarse a la implementación.

Cada plantilla debe incluir:

- Identificador.
- Versión.
- Idioma.
- Jurisdicción prevista.
- Fecha de última revisión.
- Responsable de revisión, si existe.
- Limitaciones conocidas.
- Campos obligatorios.
- Reglas condicionales.

No presentar plantillas sin revisión como textos legales oficialmente aprobados.

No inventar citas legales ni artículos de leyes.

Cuando se utilicen referencias normativas, verificar su vigencia y aplicabilidad.

---

# 19. Motor de generación

Crear un motor independiente de la interfaz.

Responsabilidades:

1. Validar los datos.
2. Normalizar entradas.
3. Evaluar las reglas condicionales.
4. Seleccionar las plantillas apropiadas.
5. Insertar los datos.
6. Generar secciones.
7. Evitar duplicaciones.
8. Detectar campos pendientes.
9. Construir el documento final.
10. Entregar una representación estructurada reutilizable.

Utilizar un modelo de documento estructurado antes de producir HTML, texto o PDF.

No generar documentos mediante concatenaciones desordenadas.

No utilizar `eval()`.

No interpretar contenido del usuario como código ejecutable.

Escapar correctamente el contenido en HTML.

No eliminar silenciosamente información importante introducida por el usuario.

---

# 20. Sistema de reglas condicionales

Ejemplos:

- Si hay cuentas, incluir administración de cuentas.
- Si hay pagos, incluir tratamiento de pagos y proveedores.
- Si hay publicidad, incluir la información pertinente.
- Si se utilizan cookies, habilitar la sección correspondiente.
- Si existe contenido generado por usuarios, incluir reglas de contenido.
- Si se permiten suscripciones, incluir condiciones aplicables.
- Si se permite eliminar cuentas, incluir instrucciones reales de eliminación.
- Si se utiliza IA, incorporar las secciones que correspondan.

Cada regla debe tener pruebas.

No incluir cláusulas contradictorias.

Si una respuesta es desconocida, mostrar una pregunta pendiente o una advertencia en lugar de asumir una respuesta.

---

# 21. Generador de Política de Privacidad

El documento debe incluir, cuando resulte pertinente:

1. Título.
2. Fecha de vigencia.
3. Identidad del responsable.
4. Alcance.
5. Categorías de datos.
6. Origen de los datos.
7. Finalidades.
8. Base jurídica cuando sea aplicable.
9. Proveedores y destinatarios.
10. Transferencias internacionales.
11. Plazos de conservación.
12. Medidas de seguridad descritas con precisión.
13. Derechos de los usuarios.
14. Procedimiento para ejercer derechos.
15. Tratamiento de menores.
16. Cookies y tecnologías similares.
17. Cambios en la política.
18. Información de contacto.

Las secciones deben adaptarse a las respuestas del usuario y a la jurisdicción pertinente.

No generar un texto idéntico para todos los proyectos.

---

# 22. Generador de Términos y Condiciones

Incluir, cuando corresponda:

1. Identificación del responsable.
2. Objeto del servicio.
3. Requisitos de uso.
4. Registro y cuentas.
5. Obligaciones del usuario.
6. Conductas prohibidas.
7. Propiedad intelectual.
8. Contenido del usuario.
9. Suscripciones y pagos.
10. Cancelaciones y reembolsos.
11. Disponibilidad del servicio.
12. Suspensión y terminación.
13. Servicios de terceros.
14. Limitaciones de responsabilidad dentro de lo permitido por la ley.
15. Modificaciones del servicio.
16. Modificaciones de los términos.
17. Legislación y jurisdicción, cuando sea apropiado.
18. Contacto.

No insertar cláusulas que pretendan eliminar derechos irrenunciables de los consumidores.

No afirmar que una exención de responsabilidad es válida universalmente.

Si hay pagos o suscripciones, solicitar la información necesaria sobre precios, renovaciones y cancelaciones.

No inventar políticas de reembolso.

---

# 23. Aviso legal y política de cookies

Crear estos documentos como opciones independientes.

El usuario podrá seleccionar cuáles necesita.

No obligar a generar todos los documentos.

Cuando un documento dependa de información no proporcionada, advertirlo antes de generar.

No utilizar una política de cookies genérica para declarar cumplimiento sin conocer las tecnologías utilizadas.

---

# 24. Interfaz del generador

Crear una interfaz dividida en tres áreas funcionales.

### Área 1: formulario

Datos de la aplicación, responsable, jurisdicción y prácticas de tratamiento.

### Área 2: documentos

Selector para:

- Política de privacidad.
- Términos y condiciones.
- Aviso legal.
- Política de cookies.
- Otros documentos compatibles.

### Área 3: resultados

Vista previa, edición y exportación.

En escritorio, utilizar una distribución de dos columnas cuando sea conveniente.

En móviles, utilizar pasos secuenciales con navegación clara.

---

# 25. Editor de documentos

Permitir al usuario:

- Visualizar el texto completo.
- Editar el contenido.
- Buscar texto.
- Corregir información.
- Restaurar el documento generado.
- Copiar el documento.
- Descargarlo.
- Imprimirlo.

La edición manual debe conservarse al cambiar entre formatos.

Si el usuario modifica los datos del formulario después de editar el documento, advertirle que una nueva generación podría reemplazar sus cambios.

No sobrescribir silenciosamente modificaciones manuales.

Utilizar un editor accesible y seguro.

No permitir que el documento introduzca scripts ejecutables en la aplicación.

---

# 26. Copiar al portapapeles

Implementar un botón:

**Copiar documento**

Debe copiar el texto completo del documento seleccionado.

Mostrar confirmación accesible.

Si el navegador no permite acceder al portapapeles, ofrecer una alternativa para seleccionar y copiar el texto manualmente.

No afirmar que el texto se copió cuando la operación haya fallado.

---

# 27. Generación de PDF

Implementar una exportación PDF profesional.

El PDF debe incluir:

- Nombre de la aplicación.
- Título del documento.
- Fecha de generación.
- Fecha de vigencia, si fue definida.
- Texto completo.
- Secciones y encabezados.
- Numeración de páginas.
- Márgenes apropiados.
- Tipografía legible.
- Enlaces activos cuando sea posible.

El documento debe mantener su estructura y no cortar párrafos de manera incorrecta.

Gestionar:

- Saltos de página.
- Caracteres especiales.
- Tildes y eñes.
- URLs largas.
- Párrafos extensos.
- Encabezados y pies de página.
- Documentos de muchas páginas.

No generar PDFs vacíos ni truncados.

Verificar que el texto exportado coincida con el documento mostrado.

---

# 28. Otros formatos de exportación

Ofrecer:

- TXT.
- HTML.
- PDF.
- Impresión.

Evaluar DOCX como mejora futura si existe demanda.

Cada formato debe exportar el contenido actual del editor.

Evitar introducir scripts o contenido ejecutable en los archivos HTML exportados.

Documentar las diferencias entre los formatos.

---

# 29. Descarga del documento

Utilizar nombres descriptivos:

```text
politica-de-privacidad-NOMBRE-APP.pdf
terminos-y-condiciones-NOMBRE-APP.pdf
politica-de-cookies-NOMBRE-APP.pdf
```

Sanitizar el nombre de archivo.

Eliminar caracteres peligrosos y limitar su longitud.

No utilizar datos sensibles en el nombre del archivo.

La descarga debe ejecutarse mediante una interacción explícita del usuario.

---

# 30. Vista previa

Crear una vista previa que represente de forma fiel el documento final.

Incluir:

- Título.
- Fecha.
- Encabezados.
- Párrafos.
- Listas.
- Enlaces.
- Separación entre secciones.

Permitir alternar entre documentos.

En dispositivos móviles, ofrecer una vista legible y evitar una representación que obligue a hacer zoom horizontal.

---

# 31. Validación de formularios

Implementar validación robusta.

Ejemplos:

- Nombre de la aplicación obligatorio.
- Correo con formato válido.
- País seleccionado.
- Fecha válida.
- URL válida cuando se introduzca.
- Datos coherentes.
- Campos condicionales obligatorios cuando correspondan.

No permitir valores absurdos.

Mostrar errores junto a los campos afectados.

Validar también al generar el documento.

No utilizar la validación del cliente como una garantía de validez legal.

---

# 32. Guardado local y privacidad

La primera versión debe funcionar sin base de datos ni cuentas.

Por defecto, no enviar la información del usuario a un servidor.

Permitir una opción para guardar el progreso localmente si resulta conveniente.

Si se utiliza `localStorage` o `sessionStorage`:

- Explicar su finalidad.
- No almacenar información innecesaria.
- Permitir borrar los datos.
- No almacenar secretos.
- Gestionar posibles errores de almacenamiento.
- No restaurar automáticamente información sensible sin una explicación clara.

Ofrecer un botón:

**Eliminar todos mis datos locales**

Debe eliminar los datos asociados al generador que estén almacenados localmente.

No afirmar que elimina los registros de proveedores externos.

---

# 33. Diseño visual

Crear una identidad visual profesional.

Estilo:

- Moderno.
- Limpio.
- Confiable.
- Minimalista.
- Profesional.
- Orientado a productividad.
- Fácil de usar.

Utilizar:

- Tarjetas.
- Espaciado consistente.
- Tipografía legible.
- Bordes discretos.
- Jerarquía visual.
- Iconos coherentes.
- Colores accesibles.
- Estados de interacción claros.

Evitar una apariencia excesivamente jurídica o intimidante.

La herramienta debe ser comprensible para desarrolladores independientes sin experiencia legal.

No prometer protección jurídica automática.

---

# 34. Responsive Design

Diseñar mobile-first.

Comprobar:

- 320 px.
- 375 px.
- 390 px.
- 430 px.
- Tablet.
- Laptop.
- Desktop.

Evitar:

- Scroll horizontal.
- Formularios excesivamente largos.
- Botones pequeños.
- Vista previa ilegible.
- PDF cortado.
- Menús inaccesibles.

Los controles deben funcionar mediante teclado, ratón y pantalla táctil.

---

# 35. Accesibilidad

Objetivo: WCAG 2.2 AA.

Implementar:

- HTML semántico.
- Navegación por teclado.
- Foco visible.
- Labels.
- Mensajes de error accesibles.
- Contraste suficiente.
- Lectura lógica de los documentos.
- Regiones de estado.
- Botones correctamente identificados.
- Acordeones accesibles.
- Respeto por `prefers-reduced-motion`.

El asistente debe permitir saber en qué paso se encuentra el usuario.

---

# 36. SEO técnico

Crear una estrategia SEO completa.

Implementar:

- Títulos únicos.
- Meta descriptions.
- Canonical.
- Open Graph.
- Twitter/X Cards.
- Robots.txt.
- Sitemap XML.
- Favicon.
- HTML semántico.
- Enlaces internos.
- URLs limpias.
- Contenido útil.
- Datos estructurados cuando correspondan.

No indexar documentos privados generados por los usuarios.

No incluir información de los formularios en parámetros de URL indexables.

No crear páginas duplicadas para cada combinación de datos.

---

# 37. Estrategia de contenido SEO

Crear contenido original que explique:

- Qué es una política de privacidad.
- Qué son los términos y condiciones.
- Qué debe contener una política de privacidad de una app.
- Qué información debe proporcionar un desarrollador.
- Cómo elegir los documentos necesarios.
- Qué diferencia existe entre privacidad y términos de uso.
- Cuándo puede ser necesaria una política de cookies.
- Qué limitaciones tiene una plantilla genérica.
- Por qué debe revisarse el documento antes de publicarlo.

No prometer que generar un documento garantiza el cumplimiento legal.

No utilizar contenido legal inventado como estrategia de posicionamiento.

---

# 38. Datos estructurados

Implementar JSON-LD apropiado.

Evaluar:

- WebApplication.
- WebSite.
- WebPage.
- BreadcrumbList.
- Organization, cuando corresponda.
- FAQPage únicamente cuando se cumplan los requisitos aplicables.

No inventar reseñas, valoraciones, premios, certificaciones ni asociaciones profesionales.

Los datos estructurados deben coincidir con el contenido visible.

---

# 39. Seguridad

Aplicar:

- Validación de entradas.
- Escape de contenido HTML.
- Prevención de XSS.
- Evitar `eval()`.
- Evitar HTML no confiable.
- Content Security Policy.
- HTTPS.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- Dependencias actualizadas.
- Gestión segura de errores.

Si se incorpora backend, añadir:

- Autenticación segura cuando sea necesaria.
- Autorización.
- Rate limiting.
- Protección CSRF cuando corresponda.
- Gestión de sesiones.
- Validación del servidor.
- Protección contra inyección.
- Límites de tamaño de solicitudes.

La primera versión no debe necesitar un backend para generar documentos.

---

# 40. Protección de los datos

Tratar los datos del usuario como potencialmente sensibles.

No enviar formularios a proveedores externos por defecto.

No incluir los datos del usuario en analytics.

No utilizar servicios de IA externos para generar documentos sin informar claramente al usuario.

Si se incorpora IA:

- Solicitar consentimiento cuando corresponda.
- Explicar qué información se transmite.
- Minimizar los datos enviados.
- No exponer API keys.
- Proteger los registros.
- Documentar la retención.
- Permitir usar plantillas locales cuando sea posible.

La generación determinista mediante plantillas debe seguir funcionando sin IA.

---

# 41. Cloudflare

Preparar el proyecto para Cloudflare Pages.

Priorizar una arquitectura estática.

Utilizar Workers únicamente si existe una necesidad real de backend.

Configurar:

- HTTPS.
- Caché.
- Compresión.
- Cabeceras de seguridad.
- Variables de entorno cuando correspondan.
- Despliegues mediante GitHub.

No incorporar servicios cloud innecesarios.

---

# 42. GitHub y CI/CD

Crear un repositorio profesional con:

- README.md.
- SECURITY.md.
- CONTRIBUTING.md.
- CHANGELOG.md.
- LICENSE.
- .gitignore.
- .env.example.
- GitHub Actions.

Pipeline:

```text
Push / Pull Request
        ↓
Instalación
        ↓
Lint
        ↓
Type Check
        ↓
Tests
        ↓
Build
        ↓
Auditoría de dependencias
        ↓
Deploy
```

No desplegar si fallan las comprobaciones críticas.

No almacenar credenciales en el código.

---

# 43. Docker

Proporcionar soporte opcional.

Crear:

- Dockerfile multi-stage.
- docker-compose.yml.
- nginx.conf.
- .dockerignore.

Utilizar Node.js para compilar y Nginx para servir los archivos estáticos.

No incluir herramientas de desarrollo innecesarias en la imagen final.

Documentar:

```bash
docker build -t legal-docs-generator .
docker compose up --build
```

Verificar que el despliegue mediante Docker funciona correctamente.

---

# 44. Testing

Implementar pruebas unitarias para:

- Validación de campos.
- Plantillas.
- Reemplazo de variables.
- Reglas condicionales.
- Selección de documentos.
- Escape HTML.
- Normalización de entradas.
- Nombres de archivo.
- Generación de texto.
- Generación de PDF.
- Fechas.
- Caracteres especiales.
- Edición manual.

Implementar pruebas de integración para el flujo completo.

Utilizar Playwright para pruebas E2E.

Probar:

```text
Abrir la web
    ↓
Completar formulario
    ↓
Seleccionar documentos
    ↓
Generar borradores
    ↓
Editar contenido
    ↓
Copiar documento
    ↓
Descargar PDF
    ↓
Comprobar contenido exportado
```

Probar también campos incompletos, datos inválidos y fallos de exportación.

---

# 45. Rendimiento

Optimizar:

- Bundle.
- CSS.
- JavaScript.
- Fuentes.
- Renderizado.
- Generación de PDF.
- Dependencias.

Objetivos orientativos de Lighthouse:

- Performance: 95 o superior cuando sea razonablemente posible.
- Accessibility: 95 o superior.
- Best Practices: 95 o superior.
- SEO: 95 o superior.

No tratar las puntuaciones como garantías.

La generación del PDF debe evitar bloquear la interfaz durante demasiado tiempo.

Si un documento es extenso, mostrar progreso o una indicación clara del proceso.

---

# 46. Modo oscuro

Implementar:

- Modo claro.
- Modo oscuro.
- Preferencia del sistema.

Permitir recordar la preferencia localmente.

Garantizar que la vista previa del documento sea legible en ambos modos.

El PDF debe utilizar un diseño de impresión independiente del tema de la interfaz.

---

# 47. Manejo de errores

Mostrar mensajes comprensibles:

- Completa los campos obligatorios.
- Introduce un correo válido.
- Selecciona el país del responsable.
- Revisa las respuestas pendientes.
- No se pudo generar el PDF.
- No se pudo copiar el documento.
- No se pudo guardar el progreso local.
- El documento necesita información adicional.

No mostrar stack traces.

No perder las respuestas introducidas debido a un error de exportación.

---

# 48. Documentación legal y transparencia

Mostrar una advertencia visible antes de descargar.

Texto orientativo:

"Los documentos generados son borradores informativos basados en los datos proporcionados y en plantillas configuradas. No constituyen asesoramiento jurídico ni garantizan el cumplimiento de la legislación aplicable. Antes de publicar los documentos, comprueba que describen fielmente tus prácticas y que se adaptan a los requisitos legales de tu actividad y jurisdicción. Considera obtener asesoramiento jurídico cuando corresponda."

No ocultar esta advertencia en letra diminuta.

Incluirla también en la documentación del proyecto y, si resulta apropiado, en el PDF exportado.

No presentar la herramienta como un despacho de abogados.

No inventar certificaciones legales.

---

# 49. Escalabilidad futura

Diseñar la aplicación para incorporar posteriormente:

- Más idiomas.
- Más jurisdicciones.
- Plantillas revisadas por especialistas.
- Versiones históricas de documentos.
- Comparación de cambios.
- Plantillas personalizadas.
- Equipos de trabajo.
- Cuentas de usuario.
- Exportación DOCX.
- Generación de paquetes de documentos.
- API.
- Integración con gestores documentales.

No implementar todas estas funciones en la primera versión.

La arquitectura debe permitir agregarlas de manera progresiva.

---

# 50. Criterios de aceptación

La aplicación solamente se considera terminada cuando:

- El formulario funciona correctamente.
- Los datos se validan.
- Los campos condicionales se comportan adecuadamente.
- Los documentos corresponden a las respuestas reales.
- No se inventan prácticas de tratamiento.
- Las plantillas están versionadas.
- El usuario puede editar el documento.
- Copiar funciona.
- PDF funciona con documentos extensos.
- TXT y HTML funcionan.
- Los caracteres españoles se muestran correctamente.
- La interfaz es responsive.
- La accesibilidad ha sido revisada.
- El SEO técnico está configurado.
- Los datos privados no se envían innecesariamente a servidores.
- No existen botones ficticios.
- Los tests principales pasan.
- El proyecto compila.
- Docker funciona si se incluye.
- El despliegue está documentado.
- Las limitaciones legales están claramente explicadas.

---

# 51. Entregables finales

Entregar:

1. Proyecto completo.
2. Código fuente organizado.
3. Formularios guiados.
4. Motor de plantillas.
5. Plantillas de privacidad.
6. Plantillas de términos y condiciones.
7. Plantillas adicionales condicionales.
8. Editor y vista previa.
9. Copia al portapapeles.
10. Exportación PDF.
11. Exportación TXT y HTML.
12. SEO técnico.
13. Datos estructurados.
14. Seguridad.
15. Accesibilidad.
16. Pruebas unitarias.
17. Pruebas E2E.
18. Docker opcional.
19. GitHub Actions.
20. Configuración Cloudflare.
21. README completo.
22. Auditoría técnica.
23. Limitaciones conocidas.
24. Lista de mejoras futuras.

---

# 52. Instrucción final al agente

No te limites a crear un prototipo o una maqueta visual.

Implementa un producto completo y funcional.

Primero define una arquitectura proporcionada al proyecto. Después implementa el formulario, el motor de plantillas, la generación de documentos, la edición y las exportaciones.

No utilices plantillas que prometan cumplimiento legal universal.

No inventes leyes, proveedores, prácticas de seguridad ni políticas de tratamiento.

No declares que un documento cumple una legislación sin una base suficiente para sostenerlo.

No incorpores Firebase, bases de datos, backend o IA si no son necesarios.

Prioriza privacidad por diseño, claridad jurídica, seguridad, accesibilidad y mantenibilidad.

Ejecuta los tests disponibles y corrige los errores.

No afirmes que una auditoría legal o técnica se ha completado si no se ha realizado.

El resultado debe poder clonarse, instalarse, ejecutarse, probarse, compilarse, contenerizarse opcionalmente y desplegarse en Cloudflare Pages.

**Construye una aplicación documental profesional, transparente, segura, accesible y preparada para producción.**