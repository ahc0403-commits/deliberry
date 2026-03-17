// GOVERNANCE: This is the ONLY permitted import boundary into repo-level shared.
// See docs/governance/STRUCTURE.md R-005.
// Do NOT import directly from shared/* in feature/screen files.

export {
  LEGAL_DOCUMENT_TYPES,
  SUPPORT_CHANNELS,
} from "../../../shared/constants/domain.constants";

export type {
  LegalDocumentType,
  SupportChannel,
} from "../../../shared/types/domain.types";
