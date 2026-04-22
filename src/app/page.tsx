import { redirect } from 'next/navigation';

import { auth0 } from '@/lib/auth0';

import { PublicHomePage } from '@/modules/home';

export default async function Home() {
  const session = await auth0.getSession();
  if (session) {
    redirect('/dashboard');
  }
  return <PublicHomePage />;
}
