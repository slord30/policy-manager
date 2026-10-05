# PolicyManager AI Developer Rules & Instructions

You are an expert AI pair programmer assisting Team 03 on the PolicyManager insurance application. Always adhere strictly to the project architecture, naming conventions, and layout constraints detailed below.

## Project Tech Stack & Configuration
- **Framework:** Next.js 15 (App Router environment)
- **Configuration File:** Uses `next.config.ts` (strictly do NOT create or suggest `next.config.js`).
- **Styling Framework:** Tailwind CSS utility configurations.
- **Database Engine:** Vercel Postgres via Neon Serverless PostgreSQL.
- **Database Client:** `@neondatabase/serverless` SDK.
- **Git Primary Branch:** Always assume and utilize `main` as the default development branch.

## Visual Identity & Typography Rules
- **Primary Fonts:** Apply `Google Sans` or clean system default sans-serif families for all text structures.
- **Capitalization Preference:** All system menu items, layout labels, navigation tab routes, and functional button strings MUST be explicitly formatted in **ALL CAPITAL LETTERS** (uppercase string styling).
- **Layout Spacing:** Adhere to deep padding rules, clear card grid separations, and subtle boundaries using a professional gray/slate color spectrum.

## Component Architecture Guidelines
- **Navigation Isolation:** Structurally separate the navigation bar component (`Navbar.tsx`) from the parent layout container or header element wrappers. They must remain completely modular.
- **Font Choices Reasoning:** Prioritize intentional typographic hierarchies grounded in handwriting mechanics and readability layout rules.

## Relational Database Schema Mapping
Always reference these exact PostgreSQL tables and primary relational constraints when building query hooks:
- `broker_accounts` (id, email, created_at, updated_at)
- `carriers` (id, name, created_at, updated_at)
- `clients` (id, broker_id, full_name, email, phone, address, notes, created_at, updated_at)
- `policies` (id, broker_id, client_id, carrier_id, policy_number, line_of_business, effective_date, expiration_date, status, premium, notes, created_at, updated_at)
