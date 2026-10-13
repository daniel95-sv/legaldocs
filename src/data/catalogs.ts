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

export interface PreconfiguredProvider {
  id: string;
  name: string;
  category: string;
  service: string;
  data: string;
  purpose: string;
  policyUrl: string;
}

export const PRECONFIGURED_PROVIDERS: PreconfiguredProvider[] = [
  {
    id: "google-analytics",
    name: "Google Analytics (GA4)",
    category: "Analítica",
    service: "Medición y análisis estadístico del uso de la app",
    data: "Identificadores de dispositivo, IP anonimizada, eventos de uso",
    purpose: "Analizar el rendimiento y la interacción de los usuarios",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Pagos",
    service: "Pasarela y procesamiento seguro de pagos",
    data: "Tokens de pago, datos de facturación, correo electrónico",
    purpose: "Procesar transacciones, compras y cobro de suscripciones",
    policyUrl: "https://stripe.com/privacy",
  },
  {
    id: "firebase",
    name: "Google Firebase",
    category: "Backend / Auth",
    service: "Autenticación, base de datos y alojamiento backend",
    data: "Credenciales de usuario, registros de conexión, identificadores",
    purpose: "Gestionar el inicio de sesión y sincronización en tiempo real",
    policyUrl: "https://firebase.google.com/support/privacy",
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Backend / Auth",
    service: "Base de datos PostgreSQL y gestión de autenticación",
    data: "Correo electrónico, identificador de usuario, registros de sesión",
    purpose: "Almacenamiento cloud y gestión de cuentas de usuario",
    policyUrl: "https://supabase.com/privacy",
  },
  {
    id: "admob",
    name: "Google AdMob",
    category: "Publicidad",
    service: "Red de publicidad programática móvil",
    data: "Identificadores publicitarios (IDFA/GAID), datos de dispositivo",
    purpose: "Mostrar anuncios personalizados y medición publicitaria",
    policyUrl: "https://policies.google.com/technologies/ads",
  },
  {
    id: "aws",
    name: "Amazon Web Services (AWS)",
    category: "Hosting",
    service: "Alojamiento en la nube y almacenamiento de archivos (S3)",
    data: "Archivos de la aplicación, bases de datos, registros de red",
    purpose: "Infraestructura cloud y almacenamiento seguro de datos",
    policyUrl: "https://aws.amazon.com/privacy",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    category: "Seguridad / CDN",
    service: "Red de distribución de contenidos (CDN) y protección DNS/WAF",
    data: "Dirección IP, registros de tráfico HTTP, metadatos de conexión",
    purpose: "Garantizar la velocidad, disponibilidad y defensa contra ataques DDoS",
    policyUrl: "https://www.cloudflare.com/privacypolicy",
  },
  {
    id: "revenuecat",
    name: "RevenueCat",
    category: "Suscripciones",
    service: "Gestión de compras in-app y suscripciones móviles",
    data: "ID de usuario anónimo, recibos de compra de App Store / Google Play",
    purpose: "Validar recibos y gestionar el estado de suscripciones activas",
    policyUrl: "https://www.revenuecat.com/privacy",
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "Monitoreo",
    service: "Monitorización de rendimiento y reporte de caídas técnicas",
    data: "Stack traces de errores, versión de la app, modelo de dispositivo",
    purpose: "Detectar y subsanar fallos de software en tiempo real",
    policyUrl: "https://sentry.io/privacy",
  },
  {
    id: "openai",
    name: "OpenAI API",
    category: "Inteligencia Artificial",
    service: "Modelos de procesamiento de lenguaje natural y generación de contenido",
    data: "Prompts del usuario, consultas de texto, metadatos de sesión",
    purpose: "Procesar y responder peticiones asistidas por IA",
    policyUrl: "https://openai.com/privacy",
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "Pagos",
    service: "Pasarela de pagos electrónicos",
    data: "Identificador de transacción, correo, importe",
    purpose: "Procesamiento de pagos y transferencias seguras",
    policyUrl: "https://www.paypal.com/webapps/mpp/ua/privacy-full",
  },
  {
    id: "onesignal",
    name: "OneSignal",
    category: "Notificaciones",
    service: "Envío y gestión de notificaciones push",
    data: "Tokens de notificación del dispositivo, idioma, zona horaria",
    purpose: "Enviar avisos operativos y comunicaciones importantes a los usuarios",
    policyUrl: "https://onesignal.com/privacy_policy",
  },
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

export const DEMO_INITIAL_STATE: LegalDocsState = {
  appName: "NovaAI Studio",
  appType: "saas",
  description: "Plataforma SaaS de productividad y análisis automatizado de documentos con asistencia de inteligencia artificial generativa, gestión de suscripciones y facturación.",
  url: "https://nova-ai.example.com",
  contactEmail: "privacidad@nova-ai.example.com",
  effectiveDate: new Date().toISOString().slice(0, 10),
  language: "es",
  audience: "general",

  responsibleType: "company",
  responsibleName: "Nova Digital Innovations S.L.",
  country: "España",
  address: "Paseo de la Castellana 180, 28046 Madrid, España",

  juris: {
    gdpr: true,
    ccpa: true,
    latam: true,
    other: "",
  },

  features: {
    accounts: true,
    oauth: true,
    profiles: true,
    ugc: true,
    comments: false,
    payments: true,
    subscriptions: true,
    ads: false,
    analytics: true,
    ai: true,
    location: false,
    uploads: true,
    social: false,
    minors: false,
    accountDeletion: true,
  },

  dataCategories: [
    "name",
    "email",
    "username",
    "ip",
    "usage",
    "logs",
    "cookies",
    "payment_provider",
    "files",
    "user_content",
    "auto",
  ],
  purposes: [
    "accounts",
    "functionality",
    "payments",
    "subscriptions",
    "support",
    "operational",
    "security",
    "fraud",
    "analytics",
    "improve",
    "legal",
  ],
  thirdParties: [
    {
      id: "stripe",
      name: "Stripe Payments Europe, Ltd.",
      service: "Pasarela y procesamiento seguro de suscripciones",
      data: "Tokens de pago, información de facturación, correo electrónico",
      purpose: "Procesar transacciones comerciales y renovaciones periódicas",
      policyUrl: "https://stripe.com/privacy",
    },
    {
      id: "openai",
      name: "OpenAI, LLC",
      service: "API de procesamiento de lenguaje natural y modelos generativos",
      data: "Prompts de texto y consultas proporcionadas voluntariamente",
      purpose: "Ejecutar las funcionalidades de generación y resumen asistido",
      policyUrl: "https://openai.com/privacy",
    },
    {
      id: "supabase",
      name: "Supabase Inc.",
      service: "Infraestructura cloud y gestión de sesiones",
      data: "Identificadores de usuario, hash de contraseñas, registros técnicos",
      purpose: "Alojamiento de cuentas y autenticación segura",
      policyUrl: "https://supabase.com/privacy",
    },
    {
      id: "cloudflare",
      name: "Cloudflare, Inc.",
      service: "Red de distribución de contenidos, DNS y protección DDoS",
      data: "Dirección IP, cabeceras HTTP de petición",
      purpose: "Garantizar disponibilidad técnica y mitigar ataques cibernéticos",
      policyUrl: "https://www.cloudflare.com/privacypolicy/",
    },
  ],

  retentionPeriod: "Durante la vigencia de la cuenta de usuario y hasta 5 años tras la baja contractual por obligaciones fiscales y de prevención de blanqueo.",
  retentionCriteria: "Los datos se suprimen o anonimizan periódicamente una vez expirados los plazos legales de prescripción aplicables.",
  autoDeletion: false,
  legalRetention: true,
  backupsInfo: "Las copias de seguridad de la infraestructura se conservan cifradas y se rotan cada 30 días.",
  security: ["tls", "at_rest", "access", "backups", "monitoring", "incidents", "account_protection"],

  transfers: {
    international: true,
    mechanisms: "Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea y Marco de Privacidad de Datos UE-EE.UU. (Data Privacy Framework).",
  },

  cookies: {
    necessary: true,
    analytics: true,
    advertising: false,
    localStorage: true,
    adIds: false,
  },

  ai: {
    functions: "Análisis y generación de borradores de texto mediante modelos de lenguaje natural.",
    dataSent: "Consultas de texto introducidas explícitamente por el usuario para su procesamiento.",
    stored: "Los datos se procesan en tránsito y no se conservan permanentemente por el proveedor más allá de la ventana técnica de seguridad de 30 días.",
    training: "Garantizamos mediante acuerdo API empresarial que los datos del usuario NO se utilizan para reentrenar ni ajustar modelos fundacionales.",
    personalData: true,
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
    legal: true,
    cookies: true,
    deletion: true,
    storeDisclosure: true,
    storeDisclosureExtra: "Incluye integración de suscripciones Stripe y API OpenAI sin entrenamiento sobre datos privados.",
  },

  generatedDocs: {},
};

