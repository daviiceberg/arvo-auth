/**
 * Prevents open redirects: only same-host relative paths or same-origin absolute URLs.
 * Used for returnTo (login/callback) validation.
 */
function isSameOriginHttpUrl(value: string, appBaseUrl: string): boolean {
  if (!/^https?:\/\//i.test(value)) {
    return false;
  }
  try {
    const u = new URL(value);
    const b = new URL(appBaseUrl);
    return u.host === b.host;
  } catch {
    return false;
  }
}

function isSafeRelativePath(v: string): boolean {
  if (!v.startsWith('/')) {
    return false;
  }
  if (v.startsWith('//') || v.includes('://')) {
    return false;
  }
  if (v.includes('..') || v.includes('\0') || v.includes('\r') || v.includes('\n')) {
    return false;
  }
  return true;
}

export function isSafeReturnTo(value: string | null | undefined, appBaseUrl: string): boolean {
  if (!value?.trim()) {
    return true;
  }
  const v = value.trim();
  const lower = v.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return false;
  }
  if (v.startsWith('//')) {
    return false;
  }
  if (isSameOriginHttpUrl(v, appBaseUrl)) {
    return true;
  }
  if (/^https?:\/\//i.test(v)) {
    return false;
  }
  return isSafeRelativePath(v);
}
