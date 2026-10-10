# Team Update Notes

Working notes for the team update. This file is local and has not been pushed.

## Schema decision

- Neon Auth keeps its identity and session records in the separate `neon_auth` schema.
- The insurance tables do not need to live in `app` to stay out of `neon_auth`. `app` and `public` are both schemas in the same database; the schema name alone is not an access-control boundary.
- The database export showed overlapping business tables in `public` and `app`, with differences such as UUID IDs versus integer IDs and different column names. Keeping both versions made it unclear which records the app should use.
- The working direction is one canonical set of business tables in `public`: `broker_account`, `clients`, `carriers`, and `policies`. Keep `neon_auth` intact.
- PR #40's dashboard reads from `app.*`, so it needs to be aligned with the chosen `public.*` tables before it is usable with this schema.

## Local changes prepared

- Added `db/reset_public_schema.sql` to recreate the four business tables in `public` and remove the duplicate `app` schema. It preserves `neon_auth`.
- Added `db/seed_demo_data.sql` for the fictional demo broker, three clients, four carriers, and four policies. It preserves the source values while generating new UUIDs and leaving the unavailable effective date and line of business empty.
- Updated local authentication and client/policy detail-page code to use the `public` table names and UUID IDs.
- Added README notes about reviewing security before real-world use, the shared carrier catalog, and the possibility of a future client sign-in portal.
- Connected client and policy creation to `public.*` tables, with broker ownership checks.
- Added client and policy edit/delete controls, list search and policy status filtering, renewal list, and carrier catalog management.
- Client deletion cascades to the client's policies according to the schema; the interface confirms this before deletion. Carrier deletion is blocked while any policy uses it.

## PR review notes

- PR #41 includes the detail-page commits from PR #36. Closing #36 would close the duplicate PR, but the commits remain in #41. No PR has been closed by this work.
- PR #37 and PR #43 have client/policy creation UI, but they do not persist new records to the database.
- PR #40 and the `feature-env-config-sl` branch both contain database-dashboard work against `app.*`; their dashboard changes overlap and should be reviewed together.
- Authentication/database code still needs a final review against the selected schema before merging.

## Current state

- No GitHub PRs have been merged or closed by this work.
- Nothing has been pushed to GitHub.
- Neither SQL script has been run against Neon.
- All code and documentation changes are in the local checkout only.

## Follow-up checklist

- Review every route/page and make sure it has appropriate page-specific metadata, including a title and description where applicable.
- Update PR #41's client and policy detail pages to read the route `id` parameter and load the matching client or policy record (and the client's associated policies).
- Before any real-world use, decide who can manage the globally shared carrier catalog and complete the security review described in README.
