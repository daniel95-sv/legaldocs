import type { CatalogItem, LegalDocsState } from "@/types";

export const APP_TYPES: CatalogItem[] = [
  { v: "android", label: "Aplicación móvil Android" },
  { v: "ios", label: "Aplicación móvil iOS" },
  { v: "web", label: "Aplicación Web / PWA" },
  { v: "saas", label: "SaaS / Plataforma Cloud" },
  { v: "desktop", label: "Aplicación de Escritorio (Windows / Mac / Linux)" },
  { v: "marketplace", label: "Marketplace / Plataforma Multivendedor" },
  { v: "education", label: "Plataforma Educativa / E-learning" },
  { v: "ecommerce", label: "Comercio Electrónico / Tienda Online" },
  { v: "community", label: "Comunidad / Red Social" },
  { v: "other", label: "Otro tipo de producto digital" },
];

export const DATA_CATEGORIES: CatalogItem[] = [
  { v: "name", label: "Nombre y apellidos", hint: "Identificación de la persona física" },
  { v: "email", label: "Correo electrónico", hint: "Para autenticación, soporte o avisos" },
  { v: "phone", label: "Número de teléfono", hint: "Contacto o autenticación 2FA" },
  { v: "username", label: "Nombre de usuario o alias", hint: "Identificador público o de acceso" },
  { v: "postal", label: "Dirección postal o fiscal", hint: "Envíos o facturación" },
  { v: "birthdate", label: "Fecha de nacimiento / Edad", hint: "Verificación de mayoría de edad o perfil" },
  { v: "location_approx", label: "Ubicación aproximada", hint: "Basada en IP o región" },
  { v: "location_precise", label: "Ubicación precisa (GPS)", hint: "Coordenadas geográficas exactas" },
  { v: "ip", label: "Dirección IP", hint: "Registros de red y seguridad" },
  { v: "device_ids", label: "Identificadores de dispositivo", hint: "IDFA, GAID, UUID o tokens de notificación" },
  { v: "usage", label: "Datos de uso y navegación", hint: "Pantallas visitadas, clics, eventos" },
  { v: "logs", label: "Registros técnicos de errores", hint: "Stack traces y volcados de fallos" },
  { v: "cookies", label: "Cookies y tecnologías similares", hint: "Identificadores de sesión y analítica web" },
  { v: "payment_provider", label: "Datos de pago (vía pasarela externa)", hint: "Tokens procesados por Stripe, PayPal, etc." },
  { v: "photos", label: "Fotografías / Imágenes", hint: "Subidas para perfil o contenido" },
  { v: "files", label: "Archivos y documentos adjuntos", hint: "PDFs, hojas de cálculo, etc." },
  { v: "audio", label: "Grabaciones de audio o voz", hint: "Notas de voz o dictados" },
  { v: "user_content", label: "Contenido generado por el usuario", hint: "Publicaciones, textos, artículos" },
  { v: "auto", label: "Datos técnicos recopilados automáticamente", hint: "Navegador, SO, idioma, resolución" },
  { v: "other", label: "Otros datos específicos", hint: "Especificar en la descripción de la app" },
];

export const PURPOSES: CatalogItem[] = [
  { v: "accounts", label: "Crear y administrar cuentas de usuario", hint: "Operativa básica de registro" },
  { v: "functionality", label: "Proporcionar las funciones clave de la aplicación", hint: "Entrega del servicio principal" },
  { v: "payments", label: "Procesar transacciones y facturación", hint: "Gestión de cobros" },
  { v: "subscriptions", label: "Gestionar suscripciones y renovaciones periódicas", hint: "Planes recurrentes" },
  { v: "support", label: "Atención al cliente y resolución de incidencias", hint: "Soporte técnico" },
  { v: "operational", label: "Envío de comunicaciones operativas y de seguridad", hint: "Alertas de cuenta, cambios de términos" },
  { v: "marketing", label: "Envío de comunicaciones comerciales y newsletters", hint: "Promociones con consentimiento" },
  { v: "personalization", label: "Personalizar la experiencia del usuario", hint: "Preferencias e idioma" },
  { v: "fraud", label: "Prevención de fraude y seguridad del sistema", hint: "Detección de accesos no autorizados" },
  { v: "security", label: "Garantizar la integridad técnica y defensiva del servicio", hint: "Protección de infraestructura" },
  { v: "legal", label: "Cumplimiento de obligaciones legales y regulatorias", hint: "Requerimientos fiscales y normativos" },
  { v: "analytics", label: "Analizar el uso y rendimiento del servicio", hint: "Métricas y comportamiento agregado" },
  { v: "improve", label: "Desarrollo y mejora continua del producto", hint: "Optimización de características" },
  { v: "advertising", label: "Mostrar publicidad contextual o personalizada", hint: "Monetización publicitaria" },
  { v: "ai_training", label: "Entrenamiento o evaluación de modelos de IA", hint: "Solo si se aplica con datos de usuario" },
];

export const SECURITY_MEASURES: CatalogItem[] = [
  { v: "access", label: "Control de acceso restrictivo y principio de mínimo privilegio", hint: "Solo personal autorizado" },
  { v: "tls", label: "Cifrado en tránsito mediante protocolos seguros (HTTPS / TLS 1.3)", hint: "Protección de datos en red" },
  { v: "at_rest", label: "Cifrado de datos en reposo (AES-256 en bases de datos y discos)", hint: "Protección en almacenamiento" },
  { v: "backups", label: "Copias de seguridad periódicas y redundantes", hint: "Garantía de continuidad y recuperación" },
  { v: "monitoring", label: "Monitorización continua de sistemas y auditoría de accesos", hint: "Detección temprana de anomalías" },
  { v: "incidents", label: "Protocolo formal de respuesta y gestión de incidentes de seguridad", hint: "Procedimiento ante brechas" },
  { v: "account_protection", label: "Mecanismos de protección de cuentas (hashing robusto de claves y 2FA opcional)", hint: "Argon2 / Bcrypt y doble factor" },
];

export const COOKIES_CATEGORIES: CatalogItem[] = [
  { v: "necessary", label: "Cookies técnicas y estrictamente necesarias", hint: "Esenciales para autenticación, carrito y seguridad" },
  { v: "analytics", label: "Cookies de análisis y rendimiento", hint: "Miden visitas y fuentes de tráfico de forma anónima" },
  { v: "advertising", label: "Cookies publicitarias y de seguimiento", hint: "Muestran anuncios orientados según perfiles" },
  { v: "localStorage", label: "Almacenamiento local del navegador (localStorage / sessionStorage)", hint: "Guardan configuraciones del cliente (ej. modo oscuro)" },
  { v: "adIds", label: "Identificadores publicitarios móviles (IDFA / GAID)", hint: "Usados en tiendas de aplicaciones para atribución" },
];

export const DEFAULT_INITIAL_STATE: LegalDocsState = {
  appName: "",
  appType: "",
  description: "",
  url: "",
  contactEmail: "",
  effectiveDate: new Date().toISOString().slice(0, 10),
  language: "es",
  audience: "general",

  responsibleType: "individual",
  responsibleName: "",
  country: "España",
  address: "",

  juris: {
    gdpr: true,
    ccpa: false,
    latam: false,
    other: "",
  },

  features: {
    accounts: false,
    oauth: false,
    profiles: false,
    ugc: false,
    comments: false,
    payments: false,
    subscriptions: false,
    ads: false,
    analytics: false,
    ai: false,
    location: false,
    uploads: false,
    social: false,
    minors: false,
    accountDeletion: false,
  },

  dataCategories: [],
  purposes: [],
  thirdParties: [],

  retentionPeriod: "Durante el tiempo que el usuario mantenga su cuenta activa o sea necesario para prestar el servicio.",
  retentionCriteria: "Los datos se suprimen o anonimizan una vez finalizada la relación y transcurridos los plazos legales de prescripción.",
  autoDeletion: false,
  legalRetention: true,
  backupsInfo: "Las copias de seguridad se purgan de forma cíclica en un plazo máximo de 30 a 90 días.",
  security: ["tls", "access", "backups"],

  transfers: {
    international: false,
    mechanisms: "Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea o decisiones de adecuación aplicables.",
  },

  cookies: {
    necessary: false,
    analytics: false,
    advertising: false,
    localStorage: true,
    adIds: false,
  },

  ai: {
    functions: "",
    dataSent: "",
    stored: "No se almacenan datos personales persistentes en el proveedor de IA.",
    training: "Los datos del usuario NO se utilizan para entrenar los modelos del proveedor de IA.",
    personalData: false,
    automated: false,
  },

  minors: {
    minAge: "16",
    parental: false,
    specialContact: "",
  },

  docs: {
    privacy: true,
    terms: true,
    legal: false,
    cookies: false,
    deletion: false,
    storeDisclosure: false,
    storeDisclosureExtra: "",
  },

  generatedDocs: {},
};
