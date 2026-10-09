import type { Metadata } from 'next';
import ClientManager from './ClientManager';

export const metadata: Metadata = {
  title: 'Clients | PolicyManager',
  description: 'View and add clients for your insurance brokerage.',
};

export default function ClientsPage() {
  return <ClientManager />;
}