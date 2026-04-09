## Prototyping Architecture

When operating in **Prototyping Mode**, Claude must follow the architecture below to ensure that fake services are structured, isolated, and trivially replaceable by real API calls.

### Core Principle: Same Interface, Swappable Implementation

All data access — real or fake — flows through the **same service interface**. The consuming components (pages, hooks, stores) never import fake data directly. They always call a service function that, under the hood, either hits the real API or returns fake data.

### Directory Structure

```
src/
  services/
    {domain}/
      {domain}.service.ts        # ← Service interface (the ONLY import consumers use)
      {domain}.types.ts           # ← Shared TypeScript types (request/response contracts)
      {domain}.api.ts             # ← Real API calls (axios/fetch to backend)
      {domain}.fake.ts            # ← Fake implementation (same interface, static data)
      {domain}.fake-data.ts       # ← Fake data constants (realistic, typed)
```

### How It Works

**1. Types (`{domain}.types.ts`)**
Define the request and response types as if the real API already existed. Claude should design these types following REST conventions consistent with the existing Swagger patterns.

```typescript
// services/permissions/permissions.types.ts
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreatePermissionRequest {
  name: string;
  description: string;
  module: string;
}
export interface PermissionListResponse {
  data: Permission[];
  total: number;
  page: number;
  pageSize: number;
}
```

**2. Fake Data (`{domain}.fake-data.ts`)**
Realistic seed data, fully typed. This file is the ONLY place where hardcoded data lives.

```typescript
// services/permissions/permissions.fake-data.ts
import { Permission } from './permissions.types';
export const FAKE_PERMISSIONS: Permission[] = [
  {
    id: 'perm-001',
    name: 'manage_users',
    description: 'Permite gerenciar usuários do sistema',
    module: 'users',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  // ... more realistic entries
];
```

**3. Fake Implementation (`{domain}.fake.ts`)**
Implements the same interface as the real API module, but using the fake data. Must simulate realistic behavior: delays, pagination, error states.

```typescript
// services/permissions/permissions.fake.ts
import { FAKE_PERMISSIONS } from './permissions.fake-data';
import type {
  Permission,
  CreatePermissionRequest,
  PermissionListResponse,
} from './permissions.types';
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));
let fakeStore = [...FAKE_PERMISSIONS];
export async function listPermissions(page = 1, pageSize = 10): Promise<PermissionListResponse> {
  await delay();
  const start = (page - 1) * pageSize;
  return {
    data: fakeStore.slice(start, start + pageSize),
    total: fakeStore.length,
    page,
    pageSize,
  };
}
export async function createPermission(req: CreatePermissionRequest): Promise<Permission> {
  await delay();
  const newPerm: Permission = {
    id: `perm-${Date.now()}`,
    ...req,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  fakeStore.push(newPerm);
  return newPerm;
}
```

**4. Real API (`{domain}.api.ts`)**
Created only when the real endpoint exists. Same function signatures.

```typescript
// services/permissions/permissions.api.ts
import { api } from '@/lib/api'; // project's axios/fetch instance
import type {
  Permission,
  CreatePermissionRequest,
  PermissionListResponse,
} from './permissions.types';
export async function listPermissions(page = 1, pageSize = 10): Promise<PermissionListResponse> {
  const { data } = await api.get('/permissions', { params: { page, pageSize } });
  return data;
}
export async function createPermission(req: CreatePermissionRequest): Promise<Permission> {
  const { data } = await api.post('/permissions', req);
  return data;
}
```

**5. Service Barrel (`{domain}.service.ts`)** [KEY FILE]
This is the **single entry point** that consumers import. It decides which implementation to use based on a feature flag or environment variable.

```typescript
// services/permissions/permissions.service.ts
const USE_FAKE =
  import.meta.env.VITE_USE_FAKE_SERVICES === 'true' ||
  import.meta.env.VITE_FAKE_PERMISSIONS === 'true';
export const permissionsService = USE_FAKE
  ? await import('./permissions.fake')
  : await import('./permissions.api');
// Re-export types for convenience
export type * from './permissions.types';
```

> **Consumers always import from the `.service.ts` file.** They never reference `.fake.ts` or `.api.ts` directly.

### Mandatory Markers

Every fake file must include a header comment marking it as prototype code:

```typescript
/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint POST /api/v1/permissions
 * @tracking-issue (to be created when prototype is approved)
 */
```

### When a Prototype is Approved

Replacing fake with real becomes a simple, contained operation:

1. Backend team implements the endpoint (using the Issue created during prototyping or after approval).
2. Frontend developer creates `{domain}.api.ts` following the real Swagger contract.
3. Change the env var / feature flag → the `.service.ts` barrel automatically switches to the real implementation.
4. Delete `.fake.ts` and `.fake-data.ts`.
5. No changes needed in any consuming component, hook, or page.

### Claude's Obligations in Prototyping Mode

When Claude identifies that Prototyping Mode applies, it must:

1. **State clearly** that the feature will be prototyped with fake services (and why: endpoint not found in Swagger).
2. **Follow the directory structure and patterns above exactly.** No shortcuts, no inline mocks, no hardcoded data in components.
3. **Design realistic types** that mirror existing Swagger patterns (naming conventions, pagination shape, error format).
4. **Include the `@prototype` markers** in every fake file.
5. **Generate a Backend Requirements Summary** at the end of the response, written in **Portuguese-BR**, listing:

- Each endpoint that the real backend will need to implement.
- HTTP method, proposed route, request/response contract.
- Business rules inferred from the prototype.

6. **Ask the user:** _"Deseja que eu crie Issues no repositório do backend (`arvo-auth-api`) para cada endpoint necessário?"_
