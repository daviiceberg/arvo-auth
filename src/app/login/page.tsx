import { redirect } from 'next/navigation';

/** Legacy path; v4 Auth0 routes live under /auth/*. */
export default function LoginPage() {
  redirect('/auth/login');
}
