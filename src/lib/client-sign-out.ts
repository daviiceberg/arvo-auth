'use client';

/**
 * Best-effort: call arvo-auth token blacklist, then Auth0 end-session.
 * If NEXT_PUBLIC_API_BASE_URL is unset, only Auth0 logout runs.
 * See arvo-auth: POST /api/operator/auth/logout (Bearer access token).
 */
export async function signOutWithBackendThenAuth0(): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    window.location.assign('/auth/logout');
    return;
  }
  try {
    const tokenRes = await fetch('/auth/access-token', { credentials: 'include' });
    if (tokenRes.ok) {
      const data = (await tokenRes.json()) as { token?: string; error?: unknown };
      if (typeof data.token === 'string' && data.token.length > 0) {
        const url = `${apiBase.replace(/\/$/, '')}/api/operator/auth/logout`;
        await fetch(url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${data.token}` },
          credentials: 'omit',
        });
      }
    }
  } catch {
    // best-effort; still log out of Auth0
  }
  window.location.assign('/auth/logout');
}
