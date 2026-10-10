import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function requireBrokerId(): Promise<string> {
  const session = await auth();
  const brokerId = session?.user?.id;

  if (!brokerId) {
    redirect('/sign-in');
  }

  return brokerId;
}
