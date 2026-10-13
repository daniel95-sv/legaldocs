import type { LegalDocsState, DocumentId } from "@/types";
import { generatePrivacyPolicy } from "@/templates/privacy";
import { generateTermsAndConditions } from "@/templates/terms";
import { generateLegalNotice } from "@/templates/legal";
import { generateCookiesPolicy } from "@/templates/cookies";
import { generateAccountDeletionPolicy } from "@/templates/deletion";
import { generateStoreDisclosure } from "@/templates/store-disclosure";

export function generateAllDocuments(
  state: LegalDocsState
): Partial<Record<DocumentId, string>> {
  const docs: Partial<Record<DocumentId, string>> = {};

  if (state.docs.privacy) {
    docs.privacy = generatePrivacyPolicy(state);
  }

  if (state.docs.terms) {
    docs.terms = generateTermsAndConditions(state);
  }

  if (state.docs.legal) {
    docs.legal = generateLegalNotice(state);
  }

  if (state.docs.cookies) {
    docs.cookies = generateCookiesPolicy(state);
  }

  if (state.docs.deletion) {
    docs.deletion = generateAccountDeletionPolicy(state);
  }

  if (state.docs.storeDisclosure) {
    docs.storeDisclosure = generateStoreDisclosure(state);
  }

  return docs;
}
