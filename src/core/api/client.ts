import axios from 'axios';

/**
 * Shared axios client for every service layer module.
 *
 * `baseURL` is read from `NEXT_PUBLIC_API_URL` at build time. Consumers always
 * import this instance via `@/core/api/client` so we have a single point to
 * plug cross-cutting concerns (auth header, telemetry, error normalization).
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  timeout: 30_000,
});

/**
 * Dev-only auth: during development there is no login flow yet, so the JWT is
 * generated out-of-band (see `tools/gen-token` on the backend) and pasted into
 * the browser via DevTools:
 *
 *   localStorage.setItem('dev_jwt', '<token>')
 *
 * The request interceptor below injects this token as `Authorization: Bearer`.
 * The response interceptor clears it on 401 so a rejected credential doesn't
 * keep being sent. When real auth lands, this whole section is replaced by an
 * auth context that manages tokens properly.
 */
const DEV_JWT_STORAGE_KEY = 'dev_jwt';

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = window.localStorage.getItem(DEV_JWT_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      window.localStorage.removeItem(DEV_JWT_STORAGE_KEY);
    }
    throw error;
  },
);
