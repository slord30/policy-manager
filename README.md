# PolicyManager

A small CRM for independent insurance brokers in Peru. A broker can keep clients, policies and insurance carriers in one place and see which policies are about to expire.

This is a school project (WDD430, Team 12). It uses fictional data only.

## Team Members

- Sarah Lord
- Teniece Busenbark
- Segundo Demetrio Alvarez Vilca
- Reese Blignaut

## Tech Stack

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Neon (serverless PostgreSQL) with `@neondatabase/serverless`
- Auth.js v5 (`next-auth` 5 beta) with email and password login. Passwords are hashed with `bcryptjs`.
- Zod for form validation
- ESLint and Prettier
- Deployed on Vercel

## Features

- Sign up, sign in and sign out
- Dashboard with totals, projected commissions and upcoming renewals
- Clients: list, search, create and a client detail page
- Policies: create a policy by choosing a client and a carrier
- Renewals: policies that are about to expire
- Carriers: Pacífico, Rímac, Mapfre and La Positiva

## Getting Started

1. Clone the repo and run `npm install`.
2. Create a `.env.local` file in the project root with these variables:
   - `DATABASE_URL`: your Neon connection string (the code also accepts `POSTGRES_URL`)
   - An Auth.js secret (see the Auth.js documentation for the exact variable name)
3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

Other scripts: `npm run build`, `npm run start` and `npm run lint`.

Never commit your `.env.local` file.

## API Notes

- The only API route is `/api/auth/[...nextauth]`, which handles login with Auth.js.
- Clients, policies, carriers and the dashboard use Next.js Server Actions (`actions.ts` inside each folder in `src/app`). They run on the server, get the signed-in broker from `src/lib/broker`, and read and write the Neon database through `src/lib/db.ts`.
- Forms are validated with Zod.
- There are no custom REST API routes yet.

## Known Issues and Future Work

- In the policies list, Line of Business shows "—" and Term only shows the end date.
- There are no automated tests yet.
- Data goes through Server Actions, not REST routes. REST routes could be added later.
- A client portal is planned for a future version.

## Security and future work

This is currently a school project using fictional records. Before using it with real insurance or client information, review and strengthen authentication, authorization, data handling, deployment settings, and applicable security requirements. The current carrier catalog is shared across broker accounts, so its management permissions also need review before real-world use.

A future version may add a client sign-in portal so clients can securely view their own profile and policies without contacting their broker for every routine question. That would require its own identity, authorization, privacy, and security review.

## Vercel deployment

https://policy-manager-chi.vercel.app/

## Accessing Demonstration Data

broker login: demo.broker@example.com password: password