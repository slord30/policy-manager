// Broker Account Interface
export interface BrokerAccount {
  id: string; // UUID primary key
  email: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Carrier Interface
export interface Carrier {
  id: string; // UUID primary key
  name: 'PROGRESSIVE' | 'GEICO' | 'ALLSTATE' | 'STATE FARM' | string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Client Interface
export interface Client {
  id: string; // UUID primary key
  broker_id: string; // Foreign key linking to BrokerAccount
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

// Policy Interface
export interface Policy {
  id: string; // UUID primary key
  broker_id: string; // Foreign key linking to BrokerAccount
  client_id: string; // Foreign key linking to Client
  carrier_id: string; // Foreign key linking to Carrier
  policy_number: string;
  line_of_business: 'AUTO' | 'HOME' | 'COMMERCIAL' | 'LIFE' | string;
  effective_date: Date | string;
  expiration_date: Date | string;
  status: 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'CANCELED' | string;
  premium: number; // Stored as NUMERIC(12,2) in Postgres, treated as a number in JS
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

// Unified Search Results Interface (Useful for your Search and Filtering task)
export interface SearchFilters {
  q?: string;           // Search text query
  carrier?: string;     // Selected Carrier UUID or string identifier
  status?: string;      // Selected Coverage Status string
  lob?: string;         // Selected Line of Business type string
}
