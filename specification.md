# PolicyManager Project Specification

## 1. Project Overview

### Title

**PolicyManager: Multi-Carrier Policy Management for Independent Brokers**

### Description

PolicyManager is a web application that gives independent insurance brokers a
single, reliable workspace for managing clients and their insurance policies
across multiple carriers. Brokers can create and maintain client records,
record carrier-specific policy details, quickly review policy information, and
monitor upcoming expiration dates so renewals and follow-up work are not
missed.

The initial release is a responsive web application built with Next.js App
Router, TypeScript, and Tailwind CSS. It must preserve clear ownership of data
by broker account and treat client and policy information as sensitive.

## 2. Purpose and Target Audience

### Purpose

PolicyManager will replace fragmented spreadsheets, carrier portals, and
manual calendar reminders with a focused workflow that helps brokers:

- Maintain an accurate directory of clients.
- Track policies from several insurance companies in one place.
- Compare policy status and key dates without losing carrier context.
- Find policies approaching expiration and prioritize renewal outreach.
- Safely update or remove records while preventing accidental data loss.

### Target Audience

The primary audience is independent insurance brokers and small brokerage
teams who place business with multiple insurance carriers. These users may
manage personal, commercial, property, auto, or other lines of insurance and
need an efficient overview rather than a carrier-specific system.

The first release focuses on the broker role. Administrative roles,
team-wide permissions, carrier integrations, automated document ingestion, and
client self-service are outside the initial scope unless separately specified.

## 3. Product Scope

### In Scope

- Broker account registration and sign-in entry point.
- Authenticated, broker-owned client records.
- Carrier records or carrier names associated with policies.
- Policy creation, viewing, editing, and deletion.
- Policy number, line of business, effective date, expiration date, status,
  premium, and notes.
- A dashboard or list showing upcoming expirations.
- Search and filtering sufficient to find a client, carrier, or policy.
- Validation, authorization, empty states, error states, and confirmation for
  destructive actions.

### Out of Scope for the Initial Release

- Direct synchronization with carrier systems.
- Automatic quoting, binding, or claims processing.
- Payment collection or accounting.
- Document scanning or OCR.
- Client login or client-facing portals.
- Automated email/SMS delivery and calendar integrations.
- Advanced team administration and delegated permissions.

## 4. Domain Model

### Broker Account

Represents the authenticated broker. Every client and policy record MUST be
owned by, or accessible through, an authorized broker account.

### Client

Minimum fields:

- `id`
- `brokerId`
- `fullName`
- `email` (optional but validated when present)
- `phone` (optional)
- `address` (optional)
- `notes` (optional)
- `createdAt`
- `updatedAt`

### Carrier

Represents the insurance company associated with a policy.

Minimum fields:

- `id`
- `name`
- `createdAt`
- `updatedAt`

Carrier names MUST be normalized sufficiently to avoid duplicate records from
minor formatting differences.

### Policy

Minimum fields:

- `id`
- `brokerId`
- `clientId`
- `carrierId`
- `policyNumber`
- `lineOfBusiness`
- `effectiveDate`
- `expirationDate`
- `status` (`active`, `expired`, `cancelled`, or `pending`)
- `premium` (optional, non-negative monetary value)
- `notes` (optional)
- `createdAt`
- `updatedAt`

The expiration date MUST NOT precede the effective date. The system MUST
preserve the association between a policy, its client, and its carrier.

## 5. User Stories and Acceptance Criteria

Priority uses MoSCoW-style labels:

- **P0 - Must have:** required for a usable first release.
- **P1 - Should have:** important for the first release after P0.
- **P2 - Could have:** valuable follow-up capability.

### US-001: Sign Up for an Account (P0)

**As an independent broker, I want to create an account so that I can manage
my own client and policy records securely.**

Acceptance criteria:

1. A visitor can open a sign-up screen from the public entry point.
2. The form requires a valid email address and a password that meets the
   documented password policy.
3. Submitting valid, unique credentials creates one broker account and does
   not expose the password in the response, logs, or UI.
4. Invalid or already-registered credentials show an actionable validation
   message without creating a partial account.
5. After successful registration, the broker is authenticated or is directed
   to sign in, according to the selected authentication provider.
6. An authenticated broker cannot access another broker's clients or policies.

### US-002: Create a Client (P0)

**As an authenticated broker, I want to create a client record so that I can
associate policies with the correct person or organization.**

Acceptance criteria:

1. An authenticated broker can open a client creation form.
2. The form requires a non-empty client name and validates optional contact
   fields when supplied.
3. A valid submission creates one client owned by the authenticated broker and
   shows the saved record.
4. Invalid input prevents creation and identifies the fields requiring
   correction.
5. A failed save does not display the record as successfully created.
6. The new client is available when creating or viewing a policy.

### US-003: Create a Policy (P0)

**As an authenticated broker, I want to record a policy and its carrier
details so that I have one current source of truth for coverage.**

Acceptance criteria:

1. The broker can select an owned client and an existing carrier, or create a
   carrier entry when the product flow supports it.
2. The form requires policy number, line of business, effective date,
   expiration date, and status.
3. The form rejects an expiration date earlier than the effective date and
   rejects malformed or invalid values.
4. A valid submission creates one policy associated with the selected client,
   carrier, and broker.
5. The saved policy displays the carrier, dates, status, and policy number
   without losing carrier context.
6. The policy appears in the upcoming-expiration view when its expiration
   falls within the configured reminder window.

### US-004: Read Client and Policy Information (P0)

**As an authenticated broker, I want to view my clients and policies so that I
can understand current coverage and decide what needs attention.**

Acceptance criteria:

1. The authenticated dashboard or list shows the broker's clients and useful
   policy summary information.
2. A broker can open a client detail view and see that client's policies,
   carrier names, statuses, effective dates, and expiration dates.
3. A broker can view a policy detail view with all stored fields and clear
   labels for optional or unavailable values.
4. The broker can search or filter by client, carrier, policy status, or
   expiration state.
5. Upcoming expirations are ordered by expiration date and visibly identify
   policies requiring attention.
6. Empty results, loading states, and data-fetch errors are distinguishable
   and provide an appropriate next action.
7. Requests for records not owned by the authenticated broker return a safe
   not-found or forbidden response without revealing whether the record exists.

### US-005: Update a Client or Policy (P0)

**As an authenticated broker, I want to edit client and policy details so that
my records remain accurate when coverage or contact information changes.**

Acceptance criteria:

1. The broker can open an edit flow from a client or policy detail view.
2. The edit form is pre-populated with the current values and preserves
   optional fields unless the broker intentionally changes them.
3. The same validation rules used during creation apply during updates,
   including date ordering and non-negative premium values.
4. A valid update changes only the authorized record and updates its
   `updatedAt` value.
5. After saving, the detail and list views show the updated values.
6. Cancelling or navigating away without saving does not change stored data.
7. A failed update surfaces an error and does not display stale submitted data
   as if it were persisted.

### US-006: Delete a Client or Policy (P1)

**As an authenticated broker, I want to delete obsolete records so that my
workspace remains accurate and manageable.**

Acceptance criteria:

1. Delete is available only to an authenticated broker authorized for the
   record.
2. The UI requires an explicit confirmation before deletion and identifies the
   record being removed.
3. Cancelling confirmation leaves the record unchanged.
4. A confirmed policy deletion removes it from client details, search results,
   and expiration views.
5. Deleting a client either removes its policies according to a documented
   cascade policy or blocks deletion with a clear explanation; it MUST NOT
   silently orphan policies.
6. A successful deletion provides clear confirmation and refreshes the
   relevant list.
7. A failed deletion leaves the record visible and reports the failure without
   claiming success.

### US-007: Review Upcoming Expirations (P0)

**As an authenticated broker, I want to see policies nearing expiration so
that I can contact clients before renewal deadlines.**

Acceptance criteria:

1. The dashboard provides an upcoming-expiration view for active and relevant
   pending policies.
2. Each entry includes client, carrier, policy number, line of business, and
   expiration date.
3. The default reminder window is documented and configurable without changing
   stored policy dates.
4. Entries are sorted from soonest to latest expiration and clearly indicate
   already expired policies when included by the selected filter.
5. Date calculations use an explicit timezone/date convention and do not shift
   a policy by one day due to client locale.
6. A broker can open the related client or policy from an expiration entry.

## 6. API Specification

All endpoints are under `/api`. JSON request and response bodies MUST use
explicit TypeScript-compatible shapes. Protected endpoints require an
authenticated broker session and enforce ownership on every resource lookup.

### Authentication

| Method | Endpoint | Purpose | Priority |
| --- | --- | --- | --- |
| `POST` | `/api/auth/sign-up` | Create a broker account | P0 |
| `POST` | `/api/auth/sign-in` | Authenticate a broker | P0 |
| `POST` | `/api/auth/sign-out` | End the current session | P0 |
| `GET` | `/api/auth/me` | Return the current broker summary | P1 |

`POST /api/auth/sign-up` accepts `{ email, password }` and returns `201
Created` with a safe account summary, or `400` for validation errors and `409`
for an existing account. Authentication implementation details may be
delegated to the selected provider, but the application boundary MUST preserve
these security behaviors.

### Clients

| Method | Endpoint | Purpose | Priority |
| --- | --- | --- | --- |
| `GET` | `/api/clients` | List owned clients; support search and pagination | P0 |
| `POST` | `/api/clients` | Create a client | P0 |
| `GET` | `/api/clients/:clientId` | Read one client and policy summary | P0 |
| `PATCH` | `/api/clients/:clientId` | Update a client | P0 |
| `DELETE` | `/api/clients/:clientId` | Delete a client per cascade policy | P1 |

`GET /api/clients` SHOULD support query parameters such as `q`, `page`, and
`pageSize`. List responses SHOULD include pagination metadata and MUST NOT
return records belonging to another broker.

### Carriers

| Method | Endpoint | Purpose | Priority |
| --- | --- | --- | --- |
| `GET` | `/api/carriers` | List available carriers for the broker | P0 |
| `POST` | `/api/carriers` | Create or register a carrier name | P1 |
| `GET` | `/api/carriers/:carrierId` | Read carrier details and policy count | P1 |

Carrier creation MUST normalize and de-duplicate names within the applicable
broker or shared catalog boundary.

### Policies

| Method | Endpoint | Purpose | Priority |
| --- | --- | --- | --- |
| `GET` | `/api/policies` | List owned policies with filters | P0 |
| `POST` | `/api/policies` | Create a policy | P0 |
| `GET` | `/api/policies/:policyId` | Read one policy | P0 |
| `PATCH` | `/api/policies/:policyId` | Update a policy | P0 |
| `DELETE` | `/api/policies/:policyId` | Delete a policy | P1 |

Supported filters SHOULD include `clientId`, `carrierId`, `status`,
`expiresBefore`, `expiresAfter`, `q`, `page`, and `pageSize`. Policy create
and update operations MUST validate referenced client and carrier ownership or
availability before persisting changes.

### Expirations

| Method | Endpoint | Purpose | Priority |
| --- | --- | --- | --- |
| `GET` | `/api/policies/expiring` | List policies in the reminder window | P0 |

`GET /api/policies/expiring` SHOULD accept `withinDays` and optional status
filters. Results MUST include stable policy identifiers and the client and
carrier display context required to navigate to the related record.

### Response and Error Conventions

- `200 OK` for successful reads and updates.
- `201 Created` for successful resource creation.
- `204 No Content` for successful deletion without a response body.
- `400 Bad Request` for malformed or invalid input.
- `401 Unauthorized` when authentication is required but absent.
- `403 Forbidden` when the session is authenticated but lacks permission.
- `404 Not Found` when the resource is unavailable to the caller; do not leak
  ownership information.
- `409 Conflict` for uniqueness or state conflicts.
- `500 Internal Server Error` only for unexpected failures, with a safe client
  message and server-side diagnostics.

Error bodies SHOULD use a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Expiration date must be on or after the effective date.",
    "fields": {
      "expirationDate": "Invalid date range."
    }
  }
}
```

## 7. Implementation Priority

### Phase 1: Foundation and Authentication (P0)

1. Confirm persistence and authentication boundaries.
2. Establish typed domain models, validation, error conventions, and ownership
   checks.
3. Implement sign-up, sign-in, sign-out, and protected application shell.
4. Add focused tests for authentication validation and authorization.

### Phase 2: Client and Carrier Records (P0)

1. Implement client create and list/read workflows.
2. Implement carrier lookup and normalization.
3. Add empty, loading, validation, and error states.
4. Add unit and integration coverage for ownership and validation.

### Phase 3: Policy CRUD (P0)

1. Implement policy create, read, and update.
2. Add date, status, premium, and relationship validation.
3. Implement searchable and filterable policy views.
4. Add regression coverage for date boundaries and cross-account access.

### Phase 4: Expiration Monitoring (P0)

1. Implement the expiring-policy endpoint and dashboard view.
2. Define and document the default reminder window and date convention.
3. Add sorting, status filters, navigation to related records, and boundary
   tests.

### Phase 5: Safe Deletion and Usability (P1)

1. Implement policy deletion and the documented client deletion behavior.
2. Add confirmation flows and failure handling.
3. Improve responsive layout, accessibility, and reusable Tailwind patterns.
4. Add integration or end-to-end coverage for the critical CRUD journey.

### Phase 6: Follow-Up Enhancements (P2)

Potential later work includes team roles, carrier integrations, document
attachments, reminders, calendar exports, and client-facing access. Each
enhancement requires a separate specification covering permissions, data
retention, and operational impact.

## 8. Non-Functional Requirements

- Use strict TypeScript and no `any`, consistent with the constitution.
- Use Next.js App Router and server components by default.
- Use Tailwind utility classes before custom CSS.
- Protect all client and policy data with authentication and server-side
  authorization.
- Provide accessible labels, keyboard navigation, visible focus, and
  meaningful error messages.
- Keep expiration calculations deterministic and timezone-safe.
- Avoid silent failures and return consistent API errors.
- Ensure the initial UI is usable on desktop and mobile screen sizes.
