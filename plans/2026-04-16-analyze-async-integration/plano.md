# Integração com `POST /api/solicitations/analyze` assíncrono

> **Sessão:** 2026-04-16
> **Branch:** `mvp` (sem commit nesta sessão — acumular na árvore de trabalho)
> **Task back vinculada:** [NEW-897](https://linear.app/arvosaude/issue/NEW-897)
> **Princípio:** preparar o front para o novo contrato assíncrono do back, sem tocar no layout. A integração real só entra em carga quando o back estiver em sandbox.

---

## 1. Objetivo

O back vai responder `202 Accepted` em poucos milissegundos no `POST /api/solicitations/analyze`, retornando apenas `{ extraction_id, status: "processing" }`. A extração OCR roda em background no servidor. O front precisa:

1. Deixar de simular o upload com `setTimeout` e passar a enviar o arquivo de verdade via multipart.
2. Montar a camada de serviços (hoje inexistente) seguindo o padrão **Service Layer** documentado em `AGENTS.mode.prototype.md` — com swap transparente entre implementação `fake` (enquanto back ainda não tem deploy) e `api` real.
3. Manter o contrato de UI preservado: estados `idle / loading / done` do `StepUpload` continuam iguais; apenas o que dispara a transição muda.

Quando o back chegar em sandbox, 1 variável de ambiente troca o fake pela implementação real, sem mexer em componente.

---

## 2. Por que cada peça existe

### 2.1 `axios` em vez de `fetch`

- Interceptor de request para injetar `Authorization: Bearer <jwt>` quando auth entrar em produção
- Interceptor de response para normalizar erros (4xx com body JSON → `Error` tipado com `code`/`message`)
- `onUploadProgress` nativo → progresso real de upload multipart, substitui o fake de `setTimeout`
- `AbortController` integrado via `signal` → permite cancelar upload no cleanup do React Query

### 2.2 React Query (`@tanstack/react-query`) em vez de `useState` puro

- Cache centralizado: se o usuário sair e voltar pro `/nova-solicitacao`, o estado do upload em andamento sobrevive
- `useMutation` com retry configurável → lidamos com blips de rede sem código manual
- DevTools opcional em dev → inspeção de estado sem log
- Convenção de `queryKeys` centralizada → evita strings espalhadas por hooks

### 2.3 Service Layer (`src/services/extractions/`)

Exatamente o padrão prescrito em `AGENTS.mode.prototype.md`:

```
extractions.types.ts       Contratos (request/response) derivados do Swagger do back
extractions.service.ts     Barrel — o ÚNICO import dos consumidores (hooks/pages)
extractions.api.ts         Implementação real (axios)
extractions.fake.ts        Implementação fake com delay realista
extractions.fake-data.ts   Seed de resposta mockada
```

A regra vale: **consumidores só importam do `.service.ts`**. A decisão fake vs real é feita ali dentro via `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`. Substituir fake por real não toca em nenhum componente nem hook.

### 2.4 Zero GCS no front

Arquitetura confirmada:

```
Front ──multipart──▶ Back Arvo ──upload──▶ GCS
                              └─sign URL──▶ Extractor (Cloud Run)
```

O front **nunca** fala com `storage.googleapis.com`. Nem SDK do Google Cloud, nem Firebase Storage. O tracking futuro via Firebase usa Firestore ou Realtime Database — não Storage.

---

## 3. Faseamento

### Fase 0 — infra HTTP e React Query (zero mudança visual)

- `npm install axios @tanstack/react-query`
- `src/core/api/client.ts` — instância axios com `baseURL` (`NEXT_PUBLIC_API_URL`), timeout 30s, placeholder de interceptor de auth
- `src/core/api/query-keys.ts` — factory de chaves: `queryKeys.extractions.byId(id)` etc.
- `src/core/providers/QueryProvider.tsx` — `QueryClientProvider` configurado
- `src/core/providers/Providers.tsx` — passa a envolver filhos com `QueryProvider` dentro de `ThemeProvider`
- `.env.local.example` — documenta `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`
- Nenhum componente renderiza nada novo, nenhum pixel muda

### Fase 1 — service layer de extractions

- `src/services/extractions/extractions.types.ts`
  - `UploadExtractionInput { file: File, extractionId?: string }`
  - `UploadExtractionResponse { extractionId: string, status: "processing" }`
  - `ExtractionError { code: "validation" | "size" | "storage" | "timeout" | "unknown", message: string }`
- `extractions.api.ts` — multipart via `FormData`, retorna payload tipado, propaga progresso via callback opcional
- `extractions.fake.ts` — simula 150ms de delay + resolve com `{ extractionId: uuid, status: "processing" }`. Permite simular erros via ENV (`NEXT_PUBLIC_FAKE_EXTRACTIONS_ERROR`) para testar fluxo de falha no front sem subir back
- `extractions.service.ts` — barrel, escolhe implementação por `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`
- `extractions.fake-data.ts` — seed

### Fase 2 — reescrever `useUploadStep`

- Remove milestones fake (`setTimeout` com 180ms)
- `useMutation` chamando `extractionsService.upload(...)`
- `uploadProgress` derivado do `onUploadProgress` real (0 → 100 durante envio)
- Após resposta 202:
  - **Hoje (sem Firebase):** mantém estado `loading` indeterminado com timeout arbitrário de 45s, depois avança para o próximo step
  - **Futuro (com Firebase):** listener atualiza pra `done` quando OCR concluir
- Estado `error` ainda não existe visualmente; registrar como ponto a discutir com o time antes de implementar
- `StepUpload.tsx` **não muda uma linha** — apenas a fonte do `uploadProgress` e do avanço de estado muda

### Fase 3 — validação

- `npm run typecheck` verde
- `npm run lint:strict` verde
- `npm run build` verde
- Verificação visual no browser: `npm run dev` + `/nova-solicitacao` → drop zone continua idêntica, fluxo mockado roda como hoje (com fake ligado)

---

## 4. Decisões de contrato

| Campo                        | Tipo                                                | Fonte                                               |
| ---------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `extraction_id` (form field) | UUID v4 gerado no front                             | Mantém compatibilidade com idempotência server-side |
| `file` (form field)          | `File` (PDF, JPG, PNG)                              | Mesmo input atual                                   |
| Response success (202)       | `{ data: { extraction_id, status: "processing" } }` | Derivado do `web.NewResponse` do back               |
| Response erro (4xx/5xx)      | `{ error: "<mensagem>" }`                           | Mantido do back                                     |

O `extraction_id` continua **gerado pelo cliente** (conforme código atual do back: se vier inválido, back gera). Front vai gerar com `crypto.randomUUID()` e enviar.

---

## 5. O que fica fora

- **Firebase listener** — task separada; sem ela, o front cai num timeout arbitrário depois do 202
- **Estado visual de erro no dropzone** — layout atual não tem slot; discutir com o time antes de adicionar
- **`POST /api/solicitations` de verdade** — `StepReview.submit` continua mock até Firebase entrar (sem saber quando extraction concluiu, não faz sentido criar solicitação)
- **Autenticação real** — interceptor de `Authorization` fica como placeholder; task separada
- **Retry policy específica** — usa defaults do React Query (3 tentativas, backoff exponencial)

---

## 6. Critérios de aceite desta sessão

1. Não aparece nenhum `@google-cloud/*` nem SDK Firebase Storage no `package.json`
2. `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=true` mantém o fluxo funcionando identicamente ao `main` atual do ponto de vista visual
3. Alternar para `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false` (após deploy do back em sandbox) passa a chamar o back real sem nenhuma outra mudança de código
4. `npm run validate` passa limpo (typecheck + lint:strict + format:check)
5. Verificação visual manual no browser confirma zero regressão visual
6. Zero commit nesta sessão — tudo acumula em working tree da branch `mvp`

---

## 7. Dependências e próximos passos

- Quando o back deployar em sandbox: trocar flag, smoke real, abrir PR do back (NEW-897)
- Task Firebase: listener de status da extraction para resolver a UX do "processing" indefinido
- Task `POST /solicitations` integrado: só faz sentido depois do Firebase
- Task de estado visual de erro no dropzone: discutir com o time (hoje o layout não acomoda)

---

## 8. Referências

- [`arvo-auth/docs/rfc/NEW-897-analyze-fire-and-forget.md`](../../../arvo-auth/docs/rfc/NEW-897-analyze-fire-and-forget.md) — RFC do back
- `AGENTS.mode.prototype.md` — padrão de service layer
- `CLAUDE.md` — convenções de código do repo front
