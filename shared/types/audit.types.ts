/**
 * Audit trail type definitions.
 * See CONSTITUTION.md R-060, R-061, R-062.
 * See IDENTITY.md Section 5 for minimum identity unit.
 *
 * Audit log entries are immutable records of mutations.
 * They MUST NOT be writable by the actor who triggered the event (R-062).
 */

import type { AuthActorType } from "./domain.types";
import type { EntityId, ISODateTimeUTC } from "./common.types";

/**
 * Resource types that produce audit log entries per R-060.
 * Mutations to these entities MUST be logged.
 */
export type AuditResourceType =
  | "Order"
  | "Payment"
  | "Settlement"
  | "User"
  | "Merchant"
  | "Store"
  | "Dispute"
  | "SupportTicket";

/**
 * Minimum viable audit log entry per IDENTITY.md Section 5 and R-061.
 *
 * Every mutation to Orders, Payments, Settlements, Users, and Merchants
 * MUST produce an entry with these fields.
 */
export interface AuditLogEntry {
  /** Unique identifier for this audit entry */
  id: EntityId;

  /** Unique identifier of the actor who initiated the mutation */
  actorId: EntityId;

  /** Actor type from canonical AUTH_ACTOR_TYPES */
  actorType: AuthActorType;

  /** Verb describing the mutation (e.g., 'order.confirmed', 'payment.refunded') */
  action: string;

  /** Entity type being mutated */
  resourceType: AuditResourceType;

  /** Unique identifier of the entity being mutated */
  resourceId: EntityId;

  /** UTC ISO 8601 timestamp of the mutation (DATE.md compliance) */
  timestampUtc: ISODateTimeUTC;

  /** Snapshot of the entity before the mutation (optional for creates) */
  beforeState?: Record<string, unknown>;

  /** Snapshot of the entity after the mutation */
  afterState: Record<string, unknown>;
}
