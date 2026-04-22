# Integração com `POST /api/solicitations/analyze` assíncrono

> **Sessão:** 2026-04-16 a 2026-04-22
> **Branch:** `feat/NEW-897-async-analyze-integration`
> **Pull Request:** [#20](https://github.com/arvo-health/arvo-auth-frontend/pull/20)
> **Tasks Linear vinculadas:** [NEW-897](https://linear.app/arvosaude/issue/NEW-897) (back) e [NEW-898](https://linear.app/arvosaude/issue/NEW-898) (front)
> **Princípio:** preparar o front para o contrato assíncrono do back sem alterar o layout do dropzone. O comportamento real entra em carga quando o back está rodando e a flag `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false` é ativada.

Este documento é retrospectivo. Reflete o que foi entregue no PR #20, não o rascunho inicial da sessão.

---

## 1. Objetivo

O back respondeu ao chamado da NEW-897 tornando o `POST /api/solicitations/analyze` fire-and-forget: retorna `202 Accepted` em milissegundos com `{ extraction_id, status: "processing" }`, e a extração OCR roda em goroutine de background. O front precisou:

1. Deixar de simular o upload via `setTimeout` e passar a enviar o arquivo real por multipart.
2. Montar a camada de serviços, até então inexistente, seguindo o padrão Service Layer documentado em `AGENTS.mode.prototype.md`, com swap transparente entre implementação fake e real via variável de ambiente.
3. Adicionar polling em `GET /api/solicitations/extractions/:id` (rota criada na NEW-898) para acompanhar a conclusão da extração enquanto a listener do Firebase não existe.
4. Evoluir os estados do dropzone para refletir a nova realidade temporal sem tocar no visual.

---

## 2. Decisões técnicas

### 2.1 axios em vez de fetch

O axios foi escolhido por três razões operacionais:

- Interceptor de request injeta `Authorization: Bearer <jwt>` lendo `localStorage['dev_jwt']`, com interceptor de response que limpa o token em caso de 401.
- `onUploadProgress` nativo alimenta o `uploadProgress` real, substituindo o fake de `setTimeout` com milestones fictícios.
- `AbortController` via `signal` propaga cancelamento tanto no upload quanto no polling, permitindo cleanup determinístico.

### 2.2 React Query (`@tanstack/react-query`)

Ganho imediato: `useMutation` encapsula o upload com retry configurado, evitando reimplementar retry manual. Ganho médio prazo: cache e invalidação ficam disponíveis quando outras telas precisarem.

Valores customizados em `QueryProvider.tsx` (saem do default da lib):

- `queries.retry: 2` (padrão da lib é 3)
- `queries.staleTime: 60_000`
- `queries.refetchOnWindowFocus: false`
- `mutations.retry: 1`

Motivo da redução: a rede local e do sandbox são estáveis; retry alto demais mascararia erros reais durante o desenvolvimento e testes.

### 2.3 Service Layer

Seguindo estritamente `AGENTS.mode.prototype.md`:

```
src/services/extractions/
  extractions.types.ts       Contratos (input/output) do serviço
  extractions.service.ts     Barrel, único import dos consumidores
  extractions.api.ts         Implementação real (axios)
  extractions.fake.ts        Implementação fake com timer
  extractions.fake-data.ts   Constantes de seed
```

Regra rigorosa: consumidores só importam de `.service.ts`. A decisão entre fake e real acontece ali dentro, com a flag `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`. Substituir fake por real não toca em nenhum componente, hook ou página.

A flag tem default seguro: quando a variável não está definida, o valor resolve para fake. Motivação: um checkout fresco do repositório funciona sem precisar subir o back localmente.

### 2.4 Zero GCS no front

Arquitetura confirmada e mantida:

```
Front → (multipart) → Back Arvo → (upload) → GCS
                                → (signed URL) → Extractor (Cloud Run)
```

O front nunca fala com `storage.googleapis.com`. Nem SDK do Google Cloud, nem Firebase Storage. O tracking futuro via Firebase usará Firestore ou Realtime Database, não Storage.

### 2.5 Mapeamento wire vs público

O back responde snake_case (`extraction_id`, `patient_name`, `procedures_count`). Os tipos públicos do front são camelCase. Para evitar o bug silencioso de `data.data.extraction_id` retornar `undefined` em runtime (TypeScript não valida runtime), cada função que consome o backend define uma interface "wire" interna e faz mapeamento explícito campo a campo antes de retornar. Regra registrada em memória da sessão.

### 2.6 Estados temporais do upload

O plano inicial previa três estados (`idle`, `loading`, `done`). A implementação precisou de quatro para representar honestamente a realidade assíncrona:

| Estado      | Significado                                               | Sinal visual                                         |
| ----------- | --------------------------------------------------------- | ---------------------------------------------------- |
| `idle`      | Dropzone aceita arquivo                                   | Ícone de upload, texto convidativo                   |
| `uploading` | Bytes subindo para o back                                 | Spinner determinado com `uploadProgress` de 0 a 100  |
| `waiting`   | Back respondeu 202 e está processando em background       | Spinner indeterminado com "Aguardando processamento" |
| `processed` | Back concluiu a extração e persistiu em `ocr_extractions` | Check verde, botão "Próxima Etapa" habilitado        |

Transições terminais:

- `uploading` para `waiting`: resposta 202 recebida.
- `waiting` para `processed`: polling recebe 200.
- Qualquer estado para `idle`: erro terminal, timeout do polling, ou usuário clica em reset. Snackbar vermelho comunica a falha.

### 2.7 Feedback de erro via Snackbar

O plano inicial marcou "estado visual de erro no dropzone" como ponto a discutir com o time antes de implementar. Durante a implementação decidiu-se por uma solução que não altera o layout do dropzone: reaproveitar o padrão de `Snackbar` do MUI já usado em `AnalysisPage`, orquestrado em `NewRequestPage`. Resultado: erro comunicado sem pixel novo no dropzone, ganho de consistência com outros módulos.

### 2.8 Acessibilidade do dropzone

O plano inicial dizia "StepUpload.tsx não muda uma linha". Na prática, trocamos o `<Box onClick>` por `<Box component="label" htmlFor="step-upload-file">` com um `<input type="file">` em posição visually-hidden (sr-only). Razões:

- Ativação por teclado (Enter, Espaço) passa a funcionar nativamente, sem JS extra.
- Leitores de tela anunciam "escolher arquivo, botão".
- Em dispositivos móveis, tap no label aciona o picker nativo do sistema operacional.

O visual permanece idêntico ao original. O DOM ganhou um input e a semântica HTML foi corrigida.

---

## 3. Implementação

### 3.1 Infra HTTP e React Query

Arquivos criados:

- `src/core/api/client.ts`: instância axios com `baseURL` vindo de `NEXT_PUBLIC_API_URL`, timeout de 30s, interceptors de request (injeta JWT de `localStorage['dev_jwt']`) e response (limpa o token em 401).
- `src/core/api/query-keys.ts`: factory centralizada de chaves React Query. Hoje cobre só `extractions.byId(id)`, cresce conforme necessário.
- `src/core/providers/QueryProvider.tsx`: `QueryClientProvider` com os valores de retry descritos em 2.2, instanciado via `useState(() => new QueryClient(...))` para respeitar o padrão do Next App Router.

`src/core/providers/Providers.tsx` foi editado para envolver os filhos com `QueryProvider` dentro do `ThemeProvider`.

Criamos `.env.local.example` com os dois envs (`NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS`). **Ponto em aberto:** o `.gitignore` do projeto tem regra `.env*` que bloqueia o arquivo. Follow-up registrado na seção 8.

### 3.2 Service layer de extractions

Contratos em `extractions.types.ts`:

```ts
interface UploadExtractionInput {
  file: File;
  extractionId?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

interface UploadExtractionResponse {
  extractionId: string;
  status: 'processing';
}

interface WatchStatusHandlers {
  onProcessed: () => void;
  onFailed: (message: string) => void;
}

type Unsubscribe = () => void;

interface ExtractionsService {
  upload(input: UploadExtractionInput): Promise<UploadExtractionResponse>;
  watchStatus(extractionId: string, handlers: WatchStatusHandlers): Unsubscribe;
}
```

Implementações:

- `extractions.fake.ts`: upload simula progresso em 8 ticks ao longo de `FAKE_TOTAL_UPLOAD_MS = 1_200` ms. `watchStatus` resolve `onProcessed` após delay aleatório entre `FAKE_PROCESSING_DELAY_MIN_MS = 2_000` e `FAKE_PROCESSING_DELAY_MAX_MS = 4_000`. Cleanup via `setTimeout`/`clearTimeout`.
- `extractions.api.ts`: upload real via `FormData` + `apiClient.post` com `onUploadProgress` ligado ao callback do input. Retorna o mapeamento explícito `{ extractionId, status }` a partir da wire `{ extraction_id, status }`. `watchStatus` faz polling a cada `POLL_INTERVAL_MS = 5_000` ms, com timeout total `POLL_MAX_DURATION_MS = 180_000` ms (3 minutos). Usa `AbortController` para cancelamento; 404 é tratado como "ainda processando" e continua pollando; qualquer outro erro é terminal.
- `extractions.service.ts`: decide implementação com `USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_EXTRACTIONS !== 'false'` (fake é default seguro).

### 3.3 `useUploadStep` reescrito

O hook ganhou os 4 estados descritos em 2.6 e trocou o fake por `useMutation`. Pontos importantes:

- `handleFileSelected(file, callbacks)` aceita callbacks de `onProcessed` e `onFailed` para desacoplar UI (snackbar, navegação) da ViewModel.
- `onSuccess` do upload transita para `waiting` e dispara `extractionsService.watchStatus`, armazenando a função de unsubscribe em ref.
- `resetUpload` e o cleanup do `useEffect` chamam o unsubscribe para cancelar o polling corretamente em todos os caminhos.
- Falhas tanto do upload quanto do watchStatus resetam para `idle`, limpam o progress e chamam `callbacks.onFailed(message)` com a mensagem traduzida.

### 3.4 `StepUpload` acessível

Mudanças pontuais:

- Wrapper virou `<Box component="label" htmlFor="step-upload-file">`.
- Input file adicionado no DOM com estilo visually-hidden (posicionamento absoluto, `clip-path: inset(50%)`, etc).
- Drop handler tolerante (ignora drop quando estado não é `idle`).
- Input recebe `disabled={!isIdle}` para bloquear ativação por picker quando já há upload em curso.
- Adicionados branches visuais para `uploading`, `waiting` e `processed`, respeitando o layout original (mesmas bordas, espaçamentos, cores do tema).

### 3.5 `NewRequestPage`

- `SnackbarState` adicionado em `../types/index.ts` (padrão do módulo, alinhado ao de `modules/analysis/types`).
- Estado e helpers locais (`showSnackbar`, `closeSnackbar`).
- Botão "Próxima Etapa" passou a ser renderizado também no step 0 quando `uploadState === 'processed'`. Nos outros estados do step 0, permanece oculto (não faz sentido avançar sem um documento processado).
- Callbacks passados para `useUploadStep`: `onProcessed` fica vazio (o visual já comunica, não precisa avançar nem notificar); `onFailed` mostra snackbar vermelho com a mensagem de erro.

### 3.6 Ajustes pós-review

Três iterações rolaram depois da primeira versão funcional:

1. **Bug de mapeamento wire (commit do PR inicial)**: o `upload()` retornava `data.data` sem mapear snake para camel. Em runtime, `response.extractionId` era `undefined` e o polling batia em `GET /extractions/undefined` respondendo 400. Correção: tipar wire internamente e retornar objeto camelCase explícito. Registrado em memória como regra geral.

2. **Timeout do polling (commit `7eacf55`)**: adicionado `POLL_MAX_DURATION_MS = 180_000` no `watchStatus` real. Quando o extractor externo retorna 500 (como aconteceu no smoke real), o GET ficaria 404 para sempre e o dropzone travaria em "Aguardando processamento". O timeout dispara `onFailed` com mensagem em pt-BR, reseta para `idle` e mostra snackbar.

3. **Merge com `main`**: a branch `mvp` foi mergeada na `main` durante a sessão, e ficaram 5 commits novos na `main` que a branch desta task não tinha. Fizemos `git merge origin/main` limpo (sem conflitos; áreas intersecaram mas em linhas distintas). Commit de merge preservado no PR.

---

## 4. Contrato de integração

| Campo                             | Tipo                                                                                               | Origem                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `extraction_id` form field (POST) | UUID v4 gerado via `crypto.randomUUID()` no front                                                  | Idempotência server-side (back regenera se vier inválido)                            |
| `file` form field (POST)          | `File` (PDF, JPG, PNG, até 10MB)                                                                   | Input nativo                                                                         |
| Response 202 (POST)               | `{ data: { extraction_id, status: "processing" } }`                                                | `web.NewResponse` do back                                                            |
| Request do polling (GET)          | `/api/solicitations/extractions/:id` com `Authorization: Bearer`                                   | Rota criada na NEW-898                                                               |
| Response 200 (GET)                | `{ data: { extraction_id, status: "processed", patient_name, physician_name, procedures_count } }` | UC `GetExtractionUseCase` do back                                                    |
| Response 404 (GET)                | `{ error: "extraction not found or still processing" }`                                            | Extraction ainda não persistida ou tenant diferente (isolamento por 404 intencional) |
| Response 4xx/5xx                  | `{ error: "<mensagem>" }`                                                                          | Formato mantido do back                                                              |

---

## 5. O que ficou fora desta entrega

Itens explicitamente não incluídos, com a razão:

- **Listener do Firebase**: trará os eventos de progresso em tempo real e torna o polling REST redundante. Task futura. Substituirá o `watchStatus` da implementação real sem mudar o contrato da `ExtractionsService`.
- **Máquina de estado no banco (`status` e `error_reason` em `ocr_extractions`)**: conversado com o time e cobre junto com o Firebase (o listener empurra os estados para o front, o back passa a gravar a transição). Não faz sentido abrir task separada antes do Firebase.
- **`POST /api/solicitations` real no StepReview**: continua mockado. Só faz sentido quando o Firebase trouxer os dados da extração, permitindo pré-preenchimento do formulário.
- **Fluxo de login real**: o interceptor lê JWT de `localStorage['dev_jwt']`. Para desenvolvimento local, o dev gera o token via `POST /api/login` ou `go run ./tools/gen-token` no repo do back e cola no DevTools. Task de autenticação real é separada e não bloqueia esta entrega.
- **`.env.local.example` commitado**: o `.gitignore` do projeto bloqueia pelo pattern `.env*`. Follow-up registrado na seção 8.
- **Testes automatizados do service layer**: seguindo o padrão do projeto no momento (que não tem Vitest configurado), validações ficaram no typecheck, lint:strict, build e smoke manual.

---

## 6. Critérios de aceite atendidos

1. Nenhum SDK `@google-cloud/*` ou Firebase Storage no `package.json`. ✓
2. Com `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS` ausente ou diferente de "false", o fluxo funciona 100% offline usando a implementação fake. ✓
3. Com `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false`, o front bate no back real sem mudar uma linha de componente, hook ou página. ✓
4. `npm run validate` (typecheck + lint:strict + format:check) passa limpo. ✓
5. `npm run build` gera bundle sem erro; zero regressão de build. ✓
6. Smoke fim-a-fim local validado: upload retornou 202, polling retornou 404 até o background concluir, transição para `processed`, botão "Próxima Etapa" habilitado. ✓
7. Cenário degradado validado: extractor externo retornando 500 cai no timeout de 3 min, reseta o dropzone com snackbar de erro, processo não trava. ✓
8. Layout visual do dropzone preservado em todos os estados (verificado no browser). ✓

---

## 7. Comentários de review integrados

Em code review, dois pontos foram levantados e respondidos:

1. **"Frontend cai no vão da esteira?"** (em `analyze_handler.go`): sim, enquanto não houver fonte definitiva de status (Firebase listener ou máquina de estado em banco), o 404 empacota "em processamento" e "falhou" na mesma resposta. Contenção vigente é o timeout de 3 min do polling. Solução definitiva virá com o Firebase e não justifica task separada hoje.

2. **"not found or in progress?"** (em `get_extraction_handler.go`): mesma raiz. Mensagem ajustada para "extraction not found or still processing" no back. Mesma resposta do item 1 sobre solução definitiva.

3. **Inconsistências deste documento vs PR**: plano original tinha divergências em retry, estados, comportamento pós-202 e snackbar. Este rewrite resolve.

---

## 8. Follow-ups

Acionáveis, ordenados por dependência:

1. **Task Firebase listener** (bloqueia vários itens abaixo): substitui o polling REST, traz status push em tempo real, habilita máquina de estado sem precisar de endpoint de consulta.
2. **Task `POST /solicitations` real**: depende do Firebase para trazer os dados de OCR do back e pré-preencher o formulário.
3. **Task autenticação real**: substitui o JWT manual em `localStorage['dev_jwt']` por fluxo de login completo com refresh token.
4. **Exceção para `.env*.example` no `.gitignore`**: tarefa operacional pequena, permite commitar templates sem `.env.local`.
5. **Vitest + Testing Library**: o projeto ainda não tem camada de testes unitários no front. Quando entrar, o service layer de extractions é bom candidato a primeiro alvo (lógica pura, fácil de mockar axios).
6. **Enriquecer copy do estado `waiting`**: quando o Firebase trouxer estágios nomeados (ex: "lendo documento", "extraindo procedimentos"), atualizar os subtítulos do dropzone para refletir o estágio atual em vez do genérico "Aguardando processamento".

---

## 9. Referências

- [`arvo-auth/docs/rfc/NEW-897-analyze-fire-and-forget.md`](../../../arvo-auth/docs/rfc/NEW-897-analyze-fire-and-forget.md): RFC do back, inclui alternativas descartadas e decisões de timeout.
- `AGENTS.mode.prototype.md`: padrão Service Layer seguido nesta entrega.
- `CLAUDE.md` do repo: convenções de código (naming, imports, logger, complexidade).
- PR back [#303](https://github.com/arvo-health/arvo-auth/pull/303): implementação do 202 + endpoint de extraction.
- PR front [#20](https://github.com/arvo-health/arvo-auth-frontend/pull/20): esta entrega.
