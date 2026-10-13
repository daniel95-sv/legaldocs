import { z } from "zod";
import type { LegalDocsState, ValidationIssue, ValidationResult } from "@/types";

export const AppStepSchema = z.object({
  appName: z
    .string()
    .trim()
    .min(2, "El nombre de la aplicación debe tener al menos 2 caracteres.")
    .max(100, "El nombre de la aplicación no puede superar 100 caracteres."),
  appType: z.string().min(1, "Debes seleccionar el tipo de aplicación."),
  contactEmail: z
    .string()
    .trim()
    .email("Introduce una dirección de correo electrónico válida.")
    .or(z.literal("")),
  url: z
    .string()
    .trim()
    .refine(
      (v) => !v || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v),
      "La URL debe ser válida y comenzar con http:// o https://"
    )
    .optional(),
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha de vigencia debe tener formato AAAA-MM-DD."),
});

export const ResponsibleStepSchema = z.object({
  responsibleName: z
    .string()
    .trim()
    .min(2, "Indica el nombre del responsable o razón social de la empresa.")
    .max(150, "El nombre del responsable no puede superar 150 caracteres."),
  country: z.string().trim().min(2, "Debes indicar el país del responsable."),
});

export const DataStepSchema = z.object({
  dataCategories: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos una categoría de datos recopilados."),
});

export const PurposesStepSchema = z.object({
  purposes: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos una finalidad para el tratamiento de datos."),
});

export const RetentionStepSchema = z.object({
  retentionPeriod: z
    .string()
    .trim()
    .min(5, "Indica el periodo o criterio de conservación de datos."),
});

export const DocumentsStepSchema = z.object({
  docs: z.record(z.boolean()).refine(
    (docs) => Object.values(docs).some(Boolean),
    "Debes seleccionar al menos un documento para generar."
  ),
});

export function validateStep(stepId: string, state: LegalDocsState): ValidationResult {
  const issues: ValidationIssue[] = [];

  switch (stepId) {
    case "app": {
      const res = AppStepSchema.safeParse({
        appName: state.appName,
        appType: state.appType,
        contactEmail: state.contactEmail,
        url: state.url,
        effectiveDate: state.effectiveDate,
      });
      if (!res.success) {
        res.error.issues.forEach((err) => {
          issues.push({ field: String(err.path[0]), message: err.message });
        });
      }
      break;
    }

    case "resp": {
      const res = ResponsibleStepSchema.safeParse({
        responsibleName: state.responsibleName,
        country: state.country,
      });
      if (!res.success) {
        res.error.issues.forEach((err) => {
          issues.push({ field: String(err.path[0]), message: err.message });
        });
      }
      break;
    }

    case "data": {
      const res = DataStepSchema.safeParse({
        dataCategories: state.dataCategories,
      });
      if (!res.success) {
        res.error.issues.forEach((err) => {
          issues.push({ field: "dataCategories", message: err.message });
        });
      }
      break;
    }

    case "purp": {
      const res = PurposesStepSchema.safeParse({
        purposes: state.purposes,
      });
      if (!res.success) {
        res.error.issues.forEach((err) => {
          issues.push({ field: "purposes", message: err.message });
        });
      }
      break;
    }

    case "ret": {
      const res = RetentionStepSchema.safeParse({
        retentionPeriod: state.retentionPeriod,
      });
      if (!res.success) {
        res.error.issues.forEach((err) => {
          issues.push({ field: "retentionPeriod", message: err.message });
        });
      }
      break;
    }

    case "docs": {
      const selected = Object.values(state.docs).some(Boolean);
      if (!selected) {
        issues.push({
          field: "docs",
          message: "Selecciona al menos un documento legal para generar.",
        });
      }
      break;
    }

    case "ai": {
      if (state.features.ai && !state.ai.functions.trim()) {
        issues.push({
          field: "ai.functions",
          message: "Describe brevemente las funciones de IA de la aplicación.",
        });
      }
      break;
    }

    case "minors": {
      if (state.features.minors && !state.minors.minAge.trim()) {
        issues.push({
          field: "minors.minAge",
          message: "Indica la edad mínima prevista para el uso de la app.",
        });
      }
      break;
    }

    default:
      break;
  }

  return {
    valid: issues.length === 0,
    errors: issues,
  };
}

export function validateAllForGeneration(state: LegalDocsState): ValidationResult {
  const allErrors: ValidationIssue[] = [];

  ["app", "resp", "data", "purp", "ret", "docs"].forEach((s) => {
    const res = validateStep(s, state);
    if (!res.valid) {
      allErrors.push(...res.errors);
    }
  });

  if (state.features.ai) {
    const res = validateStep("ai", state);
    if (!res.valid) allErrors.push(...res.errors);
  }

  if (state.features.minors) {
    const res = validateStep("minors", state);
    if (!res.valid) allErrors.push(...res.errors);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}
