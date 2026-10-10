import type { Metadata } from 'next';
import PolicyManager from './PolicyManager';

export const metadata: Metadata = {
  title: 'Policies | PolicyManager',
  description: 'View and create insurance policies for your clients.',
};

export default function PoliciesPage() {
  return <PolicyManager />;
}