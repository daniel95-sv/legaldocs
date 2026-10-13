export type AppType =
  | "android"
  | "ios"
  | "web"
  | "saas"
  | "desktop"
  | "marketplace"
  | "education"
  | "ecommerce"
  | "community"
  | "other";

export type AudienceType = "general" | "professionals" | "minors" | "mixed";

export type ResponsibleType = "individual" | "company";

export interface JurisdictionConfig {
  gdpr: boolean;
  ccpa: boolean;
  latam: boolean;
  other: string;
}

export interface AppFeatures {
  accounts: boolean;
  oauth: boolean;
  profiles: boolean;
  ugc: boolean;
  comments: boolean;
  payments: boolean;
  subscriptions: boolean;
  ads: boolean;
  analytics: boolean;
  ai: boolean;
  location: boolean;
  uploads: boolean;
  social: boolean;
  minors: boolean;
  accountDeletion: boolean;
}

export interface ThirdPartyService {
  id: string;
  name: string;
  service: string;
  data: string;
  purpose: string;
  policyUrl: string;
}

export interface TransfersConfig {
  international: boolean;
  mechanisms: string;
}

export interface CookiesConfig {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  localStorage: boolean;
  adIds: boolean;
}

export interface AiConfig {
  functions: string;
  dataSent: string;
  stored: string;
  training: string;
  personalData: boolean;
  automated: boolean;
}

export interface MinorsConfig {
  minAge: string;
  parental: boolean;
  specialContact: string;
}

export type DocumentId =
  | "privacy"
  | "terms"
  | "legal"
  | "cookies"
  | "deletion"
  | "storeDisclosure";

export interface DocumentSelection {
  privacy: boolean;
  terms: boolean;
  legal: boolean;
  cookies: boolean;
  deletion: boolean;
  storeDisclosure: boolean;
  storeDisclosureExtra?: string;
}

export interface LegalDocsState {
  // Step 1: App data
  appName: string;
  appType: AppType | "";
  description: string;
  url: string;
  contactEmail: string;
  effectiveDate: string;
  language: string;
  audience: AudienceType;

  // Step 2: Controller / Responsible
  responsibleType: ResponsibleType;
  responsibleName: string;
  country: string;
  address: string;

  // Step 3: Jurisdictions
  juris: JurisdictionConfig;

  // Step 4: Features
  features: AppFeatures;

  // Step 5: Collected data
  dataCategories: string[];

  // Step 6: Purposes
  purposes: string[];

  // Step 7: Third parties
  thirdParties: ThirdPartyService[];

  // Step 8: Retention and security
  retentionPeriod: string;
  retentionCriteria: string;
  autoDeletion: boolean;
  legalRetention: boolean;
  backupsInfo: string;
  security: string[];

  // Step 9: International transfers
  transfers: TransfersConfig;

  // Step 10: Cookies & tracking
  cookies: CookiesConfig;

  // Step 11: Artificial Intelligence
  ai: AiConfig;

  // Step 12: Minors
  minors: MinorsConfig;

  // Step 13: Selected documents
  docs: DocumentSelection;

  // Generated documents (docId -> edited text)
  generatedDocs: Partial<Record<DocumentId, string>>;
}

export interface CatalogItem {
  v: string;
  label: string;
  hint?: string;
}

export interface DocumentMetadata {
  id: DocumentId;
  label: string;
  filePrefix: string;
  description: string;
  requiredFeatures?: (keyof AppFeatures)[];
  recommendedFor?: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
}
