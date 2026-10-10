-- DESTRUCTIVE RESET: this removes the app schema and the four named public
-- business tables, including their data. It intentionally preserves
-- neon_auth and all other public tables. Review before running in Neon.
BEGIN;

DROP SCHEMA IF EXISTS app CASCADE;
DROP TABLE IF EXISTS public.policies CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.carriers CASCADE;
DROP TABLE IF EXISTS public.broker_account CASCADE;
DROP TABLE IF EXISTS public.broker_accounts CASCADE;

CREATE TABLE public.broker_account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX broker_account_email_lower_key
  ON public.broker_account (lower(btrim(email)));

CREATE TABLE public.carriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.broker_account(id) ON DELETE CASCADE,
  full_name varchar(150) NOT NULL,
  email varchar(255),
  phone varchar(50),
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (broker_id, id)
);

CREATE UNIQUE INDEX clients_broker_email_lower_key
  ON public.clients (broker_id, lower(btrim(email)))
  WHERE email IS NOT NULL AND btrim(email) <> '';

CREATE TABLE public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id uuid NOT NULL REFERENCES public.broker_account(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  carrier_id uuid NOT NULL REFERENCES public.carriers(id) ON DELETE RESTRICT,
  policy_number varchar(100) NOT NULL,
  line_of_business varchar(100),
  premium numeric(12, 2) NOT NULL CHECK (premium >= 0),
  status varchar(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED')),
  effective_date date,
  expiration_date date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (broker_id, client_id)
    REFERENCES public.clients(broker_id, id) ON DELETE CASCADE,
  UNIQUE (broker_id, policy_number),
  CHECK (effective_date IS NULL OR expiration_date >= effective_date)
);

CREATE INDEX clients_broker_id_idx ON public.clients (broker_id);
CREATE INDEX policies_broker_id_idx ON public.policies (broker_id);
CREATE INDEX policies_client_id_idx ON public.policies (client_id);
CREATE INDEX policies_carrier_id_idx ON public.policies (carrier_id);

COMMIT;
