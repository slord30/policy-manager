-- Run after reset_public_schema.sql. This creates a demo broker if needed,
-- then seeds sample clients, carriers, and policies. Re-running skips rows
-- already present for this broker.
BEGIN;

DO $$
DECLARE
  broker_uuid uuid;
BEGIN
  INSERT INTO public.broker_account (email, password_hash)
  SELECT
    'demo.broker@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.broker_account
    WHERE lower(btrim(email)) = 'demo.broker@example.com'
  );

  SELECT id INTO broker_uuid
  FROM public.broker_account
  WHERE lower(btrim(email)) = 'demo.broker@example.com'
  LIMIT 1;

  IF broker_uuid IS NULL THEN
    RAISE EXCEPTION 'Could not create or find the demo broker account.';
  END IF;

  INSERT INTO public.clients (
    broker_id,
    full_name,
    email,
    phone,
    created_at
  )
  SELECT
    broker_uuid,
    seed.full_name,
    seed.email,
    seed.phone,
    seed.created_at
  FROM (VALUES
    ('John Doe', 'john@example.com', '555-0192', '2026-10-08 21:50:00.189093+00'::timestamptz),
    ('Jane Smith', 'jane@example.com', '555-0144', '2026-10-08 21:50:00.189093+00'::timestamptz),
    ('Robert Johnson', 'robert@example.com', '555-0177', '2026-10-08 21:50:00.189093+00'::timestamptz)
  ) AS seed(full_name, email, phone, created_at)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.clients AS existing
    WHERE existing.broker_id = broker_uuid
      AND lower(btrim(existing.email)) = lower(btrim(seed.email))
  );

  INSERT INTO public.carriers (name, created_at)
  SELECT seed.name, seed.created_at
  FROM (VALUES
    ('Pacífico', '2026-10-08 21:50:09.226935+00'::timestamptz),
    ('Rímac', '2026-10-08 21:50:09.226935+00'::timestamptz),
    ('Mapfre', '2026-10-08 21:50:09.226935+00'::timestamptz),
    ('La Positiva', '2026-10-08 21:50:09.226935+00'::timestamptz)
  ) AS seed(name, created_at)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.carriers AS existing
    WHERE lower(btrim(existing.name)) = lower(btrim(seed.name))
  );

  INSERT INTO public.policies (
    broker_id,
    client_id,
    carrier_id,
    policy_number,
    premium,
    status,
    expiration_date,
    created_at
  )
  SELECT
    broker_uuid,
    client.id,
    carrier.id,
    seed.policy_number,
    seed.premium,
    seed.status,
    seed.expiration_date,
    seed.created_at
  FROM (VALUES
    ('john@example.com', 'Pacífico', 'PAC-90823', 1200.00::numeric, 'ACTIVE', '2026-10-15'::date, '2026-10-08 21:50:14.002782+00'::timestamptz),
    ('jane@example.com', 'Rímac', 'RIM-44129', 4500.00::numeric, 'ACTIVE', '2026-10-22'::date, '2026-10-08 21:50:14.002782+00'::timestamptz),
    ('robert@example.com', 'Mapfre', 'MAP-77301', 950.00::numeric, 'ACTIVE', '2026-10-28'::date, '2026-10-08 21:50:14.002782+00'::timestamptz),
    ('john@example.com', 'La Positiva', 'POS-11024', 2100.00::numeric, 'ACTIVE', '2026-12-15'::date, '2026-10-08 21:50:14.002782+00'::timestamptz)
  ) AS seed(client_email, carrier_name, policy_number, premium, status, expiration_date, created_at)
  JOIN public.clients AS client
    ON client.broker_id = broker_uuid
   AND lower(btrim(client.email)) = lower(btrim(seed.client_email))
  JOIN public.carriers AS carrier
    ON lower(btrim(carrier.name)) = lower(btrim(seed.carrier_name))
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.policies AS existing
    WHERE existing.broker_id = broker_uuid
      AND existing.policy_number = seed.policy_number
  );
END $$;

COMMIT;
