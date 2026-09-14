# PolicyManager Constitution

## Status

- **Version:** 1.0.0
- **Ratified:** 2026-09-13
- **Last amended:** 2026-09-13

## Mission

PolicyManager is a web application for independent insurance brokers who work
with multiple carriers. It helps brokers manage clients and their policies,
capture policy details from different insurance companies, and monitor
upcoming expiration dates so that renewals and client service are timely and
reliable.

All product and engineering decisions must improve the accuracy, clarity, and
day-to-day efficiency of policy management. Features must not obscure the
source or status of policy information.

## Governing Principles

### I. Broker-Centered, Actionable Workflows

The primary user is an independent broker managing relationships across
multiple carriers. User flows MUST make the most important work easy to find:
reviewing a client, understanding current coverage, identifying missing
details, and acting on upcoming expirations. Interfaces SHOULD favor clear
status, useful defaults, and progressive disclosure over unnecessary
complexity.

### II. Policy Data Integrity and Traceability

Policy data MUST be represented with explicit, typed fields and predictable
validation. Carrier-specific details MUST remain attributable to the correct
carrier and policy. The system MUST distinguish unknown, unavailable, and
intentionally empty values rather than silently inventing or overwriting
information. Changes to consequential policy details SHOULD be auditable when
the supporting data model permits it.

Dates, expiration status, and renewal-related calculations MUST use explicit
time-zone and date semantics. Expiration alerts MUST be deterministic,
reviewable, and resistant to off-by-one-day errors.

### III. Type-Safe TypeScript by Default

All application code MUST use TypeScript with strict compiler checking.
Implementations MUST NOT use `any`, including implicit escape hatches that
weaken type safety. Unknown external data MUST be narrowed through validation,
type guards, or schema-safe parsing before it enters application logic.

Types SHOULD model domain concepts directly (for example, client, carrier,
policy, coverage, and expiration state) and be reused across server actions,
components, and tests. Type assertions MUST be avoided unless the invariant
is established at the boundary and documented by the surrounding code.

### IV. Next.js App Router Conventions

The application MUST use Next.js App Router and file-based routing. Routes,
layouts, loading states, error boundaries, and metadata MUST follow the
`src/app` route hierarchy and Next.js conventions.

Components MUST be server components by default. A component may use the
`"use client"` directive only when it requires browser APIs, local state,
effects, event handlers, or a client-only library. Server components MUST
handle data access and secure operations where practical; client components
MUST receive the smallest serializable data needed for interaction and MUST
NOT expose secrets or privileged credentials.

Mutations and data access MUST have explicit, testable boundaries (such as
server actions or route handlers). Loading, empty, validation, permission, and
error states are part of the feature and MUST be designed alongside the
success state.

### V. Tailwind-First, Consistent UI

Styling MUST use Tailwind CSS utility classes and existing design patterns.
Custom CSS MUST be avoided unless Tailwind utilities cannot express the
required behavior or a shared primitive genuinely benefits from it. New
custom CSS MUST be scoped, justified, and kept in the appropriate global or
component layer.

Class names SHOULD communicate layout, hierarchy, state, and responsive
behavior consistently. Repeated UI patterns SHOULD be extracted into reusable
components rather than copied with divergent styling. Interfaces MUST remain
usable on supported screen sizes and preserve accessible focus, contrast, and
semantic structure.

### VI. Tests Protect Business-Critical Behavior

Every feature MUST include tests appropriate to its risk and boundaries.
Tests MUST cover policy and expiration calculations, validation, data
transformations, and other domain rules with focused unit tests. User-critical
flows such as creating or editing a policy, viewing carrier details, and
reviewing upcoming expirations SHOULD have integration or end-to-end coverage
when the surrounding test infrastructure supports it.

Tests MUST verify meaningful behavior rather than implementation details.
Bug fixes MUST add a regression test when practical. A change is not complete
until the relevant existing checks pass, including linting, type checking, and
the narrowest applicable test suite.

### VII. Secure and Respectful Handling of Client Information

Client and policy information MUST be treated as sensitive business data.
Access control, server-side authorization, input validation, and safe error
messages MUST be considered at every data boundary. Secrets MUST remain in
environment configuration and MUST NOT be committed, logged, or sent to the
client.

The application MUST fail visibly and safely. Errors SHOULD be surfaced
through the established UI or logging path; broad catches, silent fallbacks,
and success-shaped responses for failed operations are prohibited.

### VIII. Maintainable, Collaborative Delivery

Changes MUST be focused, reviewable, and consistent with existing patterns.
Contributors MUST search for reusable helpers and components before adding
duplicates, avoid unrelated refactors, and update directly related
documentation when behavior or conventions change.

Pull requests MUST explain the user or technical problem, summarize the
solution, identify testing performed, and call out migrations, configuration,
or data-model impacts. Reviewers SHOULD prioritize correctness, data safety,
accessibility, and maintainability over stylistic preference. Work MUST be
integrated only after required checks pass and unresolved review concerns are
addressed.

## Naming and Repository Standards

- Use `PascalCase` for React components, classes, and exported type
  definitions; use `camelCase` for variables, functions, and object fields.
- Use `kebab-case` for route segments and file names unless a framework or
  existing convention requires otherwise.
- Name domain types and functions for the business concept they represent;
  avoid vague names such as `data`, `item`, or `helper` when a precise name is
  available.
- Keep route-specific components and logic close to their route. Put shared
  primitives and domain utilities in clearly named shared modules.
- Use descriptive test names that state the behavior and relevant condition.

## Definition of Done

A change is ready when:

1. It satisfies the requested user behavior and preserves existing behavior
   outside its scope.
2. TypeScript strict checking passes without `any` or avoidable assertions.
3. Relevant validation, loading, empty, error, authorization, and responsive
   states are handled.
4. Appropriate tests are added or updated and pass.
5. Existing lint and build checks pass when applicable.
6. Sensitive data and secrets are handled safely.
7. Documentation and pull request details are updated when directly related.

## Governance

This constitution is the highest-level engineering guidance for PolicyManager.
If another document conflicts with it, contributors MUST raise the conflict
for resolution rather than silently choosing an exception.

Amendments MUST:

1. Describe the motivation and affected principles.
2. Update the version and amendment date.
3. Explain any migration or compatibility impact.
4. Be reviewed by the team before adoption.

Version changes follow semantic intent: MAJOR for removing or redefining a
principle, MINOR for adding a principle or materially expanding guidance, and
PATCH for clarifications that do not change obligations.
