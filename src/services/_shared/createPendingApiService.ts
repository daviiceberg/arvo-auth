/**
 * Defensive stub for service barrels in Prototyping Mode while real `.api.ts` is pending.
 *
 * When `USE_FAKE=false` and no real implementation exists, this Proxy is the
 * resolved service — module load does NOT crash. Any method call rejects with
 * a descriptive Error pointing to what is missing.
 *
 * Replaces the previous broken pattern `USE_FAKE ? fake : fake` where flipping
 * the env var had no effect because both branches resolved to fake.
 *
 * Usage in a service barrel:
 *
 * ```ts
 * import { createPendingApiService } from '@/services/_shared/createPendingApiService';
 *
 * const oncologyApiPending = createPendingApiService<OncologyService>(
 *   'oncologyService',
 *   'NEXT_PUBLIC_USE_FAKE_ONCOLOGY',
 * );
 *
 * export const oncologyService: OncologyService = USE_FAKE
 *   ? oncologyFake
 *   : oncologyApiPending;
 * ```
 *
 * To replace with the real implementation later: create `<domain>.api.ts`,
 * import it, and swap `oncologyApiPending` for the real export.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T is required at the call site to type the returned Proxy as the service interface
export function createPendingApiService<T extends object>(serviceName: string, envVar: string): T {
  const proxy: T = new Proxy({} as T, {
    get(_target, prop) {
      // Avoid the proxy looking like a thenable when consumers do `await service`.
      if (prop === 'then') return undefined;
      return () =>
        Promise.reject(
          new Error(
            `${serviceName}: real API implementation pending. ` +
              `Create the corresponding .api.ts file and update the barrel, ` +
              `or set ${envVar}=true to use the fake implementation.`,
          ),
        );
    },
  });
  return proxy;
}
