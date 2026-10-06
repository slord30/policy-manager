export interface BrokerAccount {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
  updated_at: Date | string;
}

//added password_hash because we will need it for logging in.