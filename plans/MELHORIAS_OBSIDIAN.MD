# MELHORIAS — Plano cruzado vault Obsidian × MVP TEA

> Plano de aprimoramento da 1ª entrega do MVP TEA, derivado da leitura do vault `Autorizador` (Obsidian) e cruzado com o estado atual da branch `main`.
> **Data**: 2026-04-28
> **Escopo**: Terapias Especiais (CID F84.x), piloto Athena Saúde, produto white-label.
> **Modo**: planejamento — execução individual por seção, com instruções precisas.

---

## Princípios usados como peneira

- **TEA-only** — F84.x, RN 539/2022. Demais categorias (OPME, Onco, Internação, Cirurgia, Home Care, SADT, Exames) fora.
- **White-label** (ADR-007) — operadora é parâmetro, nunca constante. "A IA analisa, o cliente decide."
- **Pequenos ajustes que movem a agulha**, sem refactor radical.
- **Não mexer no que está OK** — checklist, async OCR, manual reprocess flow, ChecklistFullModal a11y, notificação simplificada para TEA, routing RF-004.
- **RN 566/2022** — IA nunca nega clinicamente; auto-decisão só em aprovação e Tier 1.
- **Decisões fora do MVP** — pendenciar pedido, devolutiva e encaminhamento para junta médica **não fazem parte do MVP**. Ficam para 2ª etapa. Mocks e textos atuais que mencionem essas ações devem ser limpos.

---

## Sumário

| Bloco | Conteúdo | Esforço |
|---|---|---|
| **A** | Executar agora — 4 ações cirúrgicas | ~3h |
| **B** | Defer — próxima rodada (com motivo) | — |
| **C** | Não tocar — já aderente ao vault | — |
| **D** | Risco-monitor | — |

> ⚠️ **Cuidado total** — Cada ação preserva o que está funcionando. Validate (`npm run validate`) é obrigatório antes de qualquer commit. Trabalhar em branch isolada por bloco. Sem `--no-verify`. Sem amend de commits anteriores.

---

# A. EXECUTAR AGORA

## A1. Higiene white-label (descoplar de Athena)

**Origem no vault**: ADR-007 (whitelabel-cliente-decide), `Arvo Auth` overview ("A IA analisa, o cliente decide"), princípio fundamental do produto.

**Achados no código** (cross-ref):

| Arquivo | Linha(s) | Conteúdo problemático |
|---|---|---|
| `src/modules/new-request/hooks/useNewRequestForm.ts` | 24 | `operadora: 'Athena Saúde'` — default hardcoded do form |
| `src/data/pedidos.ts` | 1941, 2020, 2086, 2152, 2231, 2296, 2362, 2428, 2494, 2571, 2656, 2740, 2813, 2902, 2999 | `plan: 'Athena Saúde — <produto>'` — 15 mocks |
| `src/data/usuarios.ts` | 42, 52, 62, 72, 82, 92, 102, 112 | 8 emails `*@athena.com.br` |
| `src/app/(main)/meu-perfil/page.tsx` | 118 | `value="ana.santos@athena.com.br"` hardcoded |

**Por que executar**: produto não é exclusivo Athena. Demos para Elosaúde / Unimed / outras viram contra-exemplo se o mock vazar marca. Custo zero comportamental, alto retorno narrativo.

**Instruções de execução**:

1. **Form default** — `useNewRequestForm.ts:24`:
   - Trocar `operadora: 'Athena Saúde'` → `operadora: ''`.
   - Verificar se algum consumidor depende do valor não-vazio (StepBeneficiary). Se exibir como "—" ou placeholder, OK.

2. **Plan strings em pedidos.ts** (15 ocorrências):
   - `'Athena Saúde — Premium Familiar'` → `'Premium Familiar'`
   - `'Athena Saúde — Essencial Plus'` → `'Essencial Plus'`
   - `'Athena Saúde — Premium'` → `'Premium'`
   - `'Athena Saúde — Essencial'` → `'Essencial'`
   - Operação: `replace_all` por string exata. Plan name = nome do produto, não da operadora.

3. **Emails em usuarios.ts** (8 entries):
   - Trocar domínio `@athena.com.br` → `@operadora.exemplo.br` (genérico) ou usar nomenclatura coerente com `operadora` field do user.
   - Manter os nomes próprios — só mudar domínio.

4. **Perfil hardcode** (`src/app/(main)/meu-perfil/page.tsx:118`):
   - Atual: `value="ana.santos@athena.com.br"`.
   - Trocar por leitura do user logado via Auth0 (`useUser()`) ou, em prototyping, primeiro user do `data/usuarios.ts` (já consistente após passo 3).

**Validação**:
```bash
npm run validate
```
Confirmar zero referências em código:
```bash
grep -rn "Athena Saúde\|@athena.com.br" src/
```
(Deve retornar nada após aplicar.)

**Esforço**: 30–45 min.

**Branch sugerida**: `chore/whitelabel-remove-athena-hardcodes`.
**PR title**: `chore: remove hardcodes Athena para whitelabel limpo` (≤72 chars).

---

## A2. Remover handlers órfãos de pendência e junta médica (código morto)

**Origem da decisão**: usuário (Davi) — "pendenciar um pedido, devolutivas e junta médica NÃO devem ocorrer no MVP. São ações para uma segunda etapa."

**Achados no código** (todas as APIs abaixo **não têm consumidor de UI** — confirmado via grep):

| Arquivo | Linhas | Conteúdo morto |
|---|---|---|
| `src/modules/analysis/hooks/useDialogVisibility.ts` | 8, 9, 18, 19, 28, 29, 41–44 | states `showPendencyDialog`, `showMedicalBoardDialog` + setters + reset |
| `src/modules/analysis/hooks/useDecisionFormFields.ts` | 14–16, 19–20, 39–41, 44–46, 71–81, 96–97 | `pendencyItems`, `pendencyJustification`, `medicalBoardReason`, `medicalBoardObs` + resets |
| `src/modules/analysis/hooks/useDecisionFlow.ts` | 83–87, 89–93, 145–148, 177–184, 194–195 | `confirmPendency()`, `confirmMedicalBoard()` + return fields associados |

**Confirmação de zero consumo**:
- Pasta `src/modules/analysis/components/dialogs/` contém **apenas** `ApprovalDialog`, `DenialDialog`, `PartialApprovalDialog`, `DivergenceDialog`, `AdjustmentApprovalDialog`, `ShortcutsHelpDialog`. Não existe `PendencyDialog.tsx` nem `MedicalBoardDialog.tsx`.
- `grep "showPendencyDialog\|showMedicalBoardDialog"` fora dos hooks internos: **0 hits**.
- `confirmPendency` chama `router.push('/fila?tab=devolutivas&pendenciado=...')` — rota inexistente; `confirmMedicalBoard` só dispara snackbar.

**Por que executar**: API exposta sem consumidor é ruído. Sem remover, qualquer dev futuro poderia plugar um botão e ativar fluxo não-MVP por engano. Limpeza desbloqueia clareza do contrato do hook.

**Instruções de execução** (por arquivo, ordem importa):

1. **`useDecisionFormFields.ts`** — remover:
   - linhas 14–16: states `pendencyItems`, `pendencyJustification`.
   - linhas 19–20: states `medicalBoardReason`, `medicalBoardObs`.
   - linhas 39–41: `resetPendencyFields` callback.
   - linhas 44–46: `resetMedicalBoardFields` callback.
   - linhas 71–81 (entries no return): todas as 6 chaves pendency*/medicalBoard*.
   - linhas 96–97 (entries no return): `resetPendencyFields`, `resetMedicalBoardFields`.

2. **`useDialogVisibility.ts`** — remover:
   - linha 8: `showPendencyDialog` state + setter.
   - linha 9: `showMedicalBoardDialog` state + setter.
   - linhas 18, 19: branches do `isAnyDialogOpen`.
   - linhas 28, 29: branches do reset (`closeAll` ou similar).
   - linhas 41–44: entries no return.

3. **`useDecisionFlow.ts`** — remover:
   - linhas 83–87: função `confirmPendency`.
   - linhas 89–93: função `confirmMedicalBoard`.
   - linhas 145–148: pass-through dos dialog visibility states no return.
   - linhas 177–184: pass-through dos form fields no return.
   - linhas 194–195: handlers no return.

4. **`useRouter` import** em `useDecisionFlow.ts:5` — verificar se ainda é usado após remover linha 86. **Se não**, remover import e a linha 21 `const router = useRouter();`. Se ainda usar em outro lugar (provável que não), manter.

**Validação após cada edit** (sequencial, não em paralelo):
```bash
npm run validate
```

TypeScript com `noUncheckedIndexedAccess` strict pega qualquer consumidor remanescente. Se passar, código realmente morto. Se falhar, **parar e investigar** — algum consumer escondido existe e a remoção precisa ser revisada.

**Smoke test manual** após validate:
- `/analise?id=REQ-2026-04895` — abrir tela. Aprovação, Negação, Aprovação Parcial e Divergência seguem funcionando. Atalhos de teclado idem.
- `/fila` — navegação normal, sem 404.

**Esforço**: 30–45 min.

**Branch sugerida**: `chore/remove-pendency-medical-board-dead-code`.
**PR title**: `chore: remover handlers órfãos de pendência e junta médica` (≤72 chars).

---

## A3. Limpeza de mocks e textos com referência a junta/pendência/devolutiva

**Origem da decisão**: mesma de A2 — fluxos fora do MVP. Mocks e textos visíveis na UI hoje mencionam "Junta Médica" como consequência ou recomendação. Limpar para evitar confusão durante demo.

**Achados no código**:

| Arquivo | Linha(s) | O que tem |
|---|---|---|
| `src/mocks/tea-checklist-catalog.ts` | 52 | entry `JUNTA_MEDICA_INDICADA: 'historico'` no `ID_GROUP_MAP` |
| `src/mocks/tea-checklist-catalog.ts` | 92 | flag `juntaIndicada?: boolean` em `TeaChecklistScenario` |
| `src/mocks/tea-checklist-catalog.ts` | 388–395 | bloco `if (s.juntaIndicada) add(items, { id: 'JUNTA_MEDICA_INDICADA', ... })` |
| `src/data/pedidos.ts` | 1311 | `juntaIndicada: true` em scenario do REQ multi-prestador |
| `src/modules/analysis/constants/consolidated-history-data.ts` | 125 | narrativa "Recomenda-se encaminhamento para Junta Médica..." |
| `src/modules/analysis/constants/consolidated-history-data.ts` | 166 | entry de histórico `motivo: 'Junta Médica: protocolo EIBI validado'` |
| `src/modules/analysis/constants/consolidated-history-data.ts` | 202 | "...quantidades >80/mês requerem validação por Junta Médica" |
| `src/modules/analysis/constants/consolidated-history-data.ts` | 216 | "Quantidades >80/mês → Junta Médica" |
| `src/modules/history/components/ConsolidatedHistorySection.tsx` | 83, 101, 137, 151 | mesmas narrativas duplicadas inline (auditar — pode ser cópia ou caso distinto) |
| `src/modules/analysis/constants/adjustment-reasons.ts` | 12 | opção `'Determinação de junta médica'` em select de motivos |
| `src/modules/analysis/components/AdjustmentFieldCode.tsx` | 42 | helper text "Alteração de código requer respaldo de junta médica ou diretriz ANS." |
| `src/app/docs/page.tsx` | 521, 527, 899, 913 | página de design-system menciona "Junta Médica" + chip cor amber |

**Não tocar** (não é pendência/devolutiva/junta de pedido — outra semântica):
- `src/types/notificacao.ts:8` — comentário declara explicitamente "Fora do MVP: devolutivas, pendências com retorno". Documenta o escopo. **Manter.**
- `src/modules/new-request/components/StepReview.tsx:133` — `d.status === 'enviado' ? d.tamanho : 'Pendente'` é status de **documento** (enviado/pendente), não de pedido. **Manter.**

**Instruções de execução**:

### A3.1 — Catálogo de checklist (`tea-checklist-catalog.ts`)

1. Remover linha 52: entry `JUNTA_MEDICA_INDICADA: 'historico',` do `ID_GROUP_MAP`.
2. Remover linha 92: campo `juntaIndicada?: boolean;` de `TeaChecklistScenario`.
3. Remover bloco linhas 388–395 (`if (s.juntaIndicada) add(items, { ... })`).
4. Verificar se `pushHistorico` ainda compila — função fica menor; os `if`s restantes (`s.altaUtilMes`, `s.quantidadeAcima`, `s.solicitacaoDuplicada`) seguem íntegros.

### A3.2 — Mock pedidos.ts

5. `src/data/pedidos.ts:1311` — remover entry `juntaIndicada: true` do scenario do checklist.
6. Conferir nas linhas próximas (`iaJustification`, `observations`, narrativas livres do mesmo pedido) se há texto mencionando junta médica. Reescrever para destacar outra característica TEA-real (alta utilização, divergência de protocolo, etc.) sem citar junta. Confirmar que o `iaSuggestion` segue compatível com o conjunto atual (`'Aprovar' | 'Negar'`).

### A3.3 — Histórico consolidado em constants (`consolidated-history-data.ts`)

7. Linha 125 — narrativa: substituir "Recomenda-se encaminhamento para Junta Médica dada a quantidade solicitada." por "Quantidade solicitada acima do protocolo padrão da operadora — sinaliza necessidade de análise atenta do plano terapêutico." (sem mencionar junta).
8. Linha 166 — entry de histórico com `motivo: 'Junta Médica: protocolo EIBI validado'` → trocar por `motivo: 'Aprovado: protocolo EIBI validado conforme RN 539/2022'`. Validar `action` da entry — se for `'Aprovado'`, OK; se for outra coisa que não exista no `DecisionAction` enum, ajustar.
9. Linha 202 — "...requerem validação por Junta Médica segundo regra operacional." → "...requerem análise reforçada do plano terapêutico segundo regra operacional."
10. Linha 216 — "Quantidades >80/mês → Junta Médica." → "Quantidades >80/mês → revisão clínica detalhada." (ou remover essa linha se for só observação extra).

### A3.4 — Histórico inline (`ConsolidatedHistorySection.tsx`)

11. Linhas 83, 101, 137, 151 — auditar primeiro: pode ser duplicação literal de `consolidated-history-data.ts` (caso histórico do mesmo paciente apresentado em outro contexto) ou narrativa distinta. Aplicar a mesma reescrita do A3.3 (mesmo cuidado de não falar em junta).

### A3.5 — Motivos de ajuste

12. `src/modules/analysis/constants/adjustment-reasons.ts:12` — remover entry `'Determinação de junta médica'`. Conferir que UI do select (`AdjustmentDrawer`) continua funcionando com as opções restantes (não há fallback que dependa do índice fixo).

### A3.6 — Helper text de ajuste de código

13. `src/modules/analysis/components/AdjustmentFieldCode.tsx:42` — texto atual: "Alteração de código requer respaldo de junta médica ou diretriz ANS. Certifique-se de...". Reescrever sem junta: "Alteração de código requer respaldo de diretriz ANS ou protocolo da operadora. Certifique-se de...". Manter o resto da frase intacto.

### A3.7 — Design system docs (`src/app/docs/page.tsx`)

14. Linha 521: usage "Texto em alertas, chips de status pendente/OPME/Urgente/Junta Médica" → simplificar para o que TEA usa (ex: "Texto em alertas e chips de status").
15. Linha 527: usage "Junta Médica, sub-status de junta, origem App, chips Eleitiva" → reescrever sem junta (ex: "origem App, chips Eleitiva").
16. Linha 899: chip de exemplo `label="Junta Médica"` — remover esse chip do array de exemplos.
17. Linha 913: entry no objeto de cores `'Junta Médica': { bg: 'rgba(245,158,11,0.12)', color: '#b45309' }` — remover. Conferir se o tipo do objeto não vira inválido (TS pode reclamar se for `Record<IASuggestion, ...>` strict — neste caso, ajustar tipo do objeto para refletir `IASuggestion` sem `'Junta Médica'`).

**Ordem de execução**: começar por A3.1 e A3.2 (mocks-source) → A3.3 → A3.4 → A3.5 → A3.6 → A3.7. Validate após cada subitem.

**Validação após cada subitem**:
```bash
npm run validate
grep -rn -E "junta médica|Junta Médica|juntaIndicada|JUNTA_MEDICA_INDICADA|pendenciado=" src/ | grep -v "notificacao.ts"
```
Esperado: só o comentário `notificacao.ts:8` (que declara "Fora do MVP") deve restar, mais nada visível na UI.

**Smoke test manual** após todos os subitens:
- `/analise?id=REQ-2026-04895` (e o pedido alterado em A3.2) — abrir tela, abrir checklist completo, abrir AdjustmentDrawer, conferir helper text. Sem texto sobre junta.
- `/historico/<id>` — abrir um pedido com histórico consolidado, verificar narrativa.
- `/docs` (página interna design system) — chips e tabelas sem entry "Junta Médica".

**Importante (não fazer)**:
- ❌ Não remover textos sobre `'Junta Médica'` no comentário de `notificacao.ts:8` (é doc explícita do escopo).
- ❌ Não remover o status `'Pendente'` em `StepReview.tsx:133` (semântica de documento, não pedido).
- ❌ Não remover a regra/RN 539/2022 — manter referência regulatória, só tirar a consequência "junta".
- ❌ Não tocar em `useDecisionFlow.ts` aqui — A2 já cuida.
- ❌ Não criar dialogs novos. Não adicionar status novos. Não estender `IASuggestion` com `'Junta Médica'`.

**Esforço**: ~1h30min (~9 subitens de edição cuidadosa + smoke test).

**Branch sugerida**: `chore/clean-mocks-junta-medica-references`.
**PR title**: `chore: limpar mocks e textos com menção a junta médica` (≤72 chars).

---

## A4. Auditar regra de cor SLA

**Origem no vault**: `conceitos/SLA-acoes-decisao.md` — regra canônica:

| Cor | Critério |
|---|---|
| Verde | `> NOW + 2 dias` |
| Amarelo | `NOW + 0..2 dias` |
| Vermelho | `> deadline` (violado) |

**Instruções de execução**:

1. **Auditar**:
   - Ler `src/shared/constants/sla-colors.ts` para confirmar mapeamento `SLAStatus → cor`.
   - Buscar onde `slaStatus` é derivado a partir de `slaDeadlineHours` ou `slaText`. Provavelmente fixed-value nos mocks (`src/data/pedidos.ts`) — sem cálculo dinâmico no MVP.
   - Confirmar valores dos mocks: `slaText` ("96h restantes", "32h restantes", etc.) deve casar com `slaStatus` (`ok`, `warning`, `violated`).

2. **Se já bate** com a regra do vault: **não mexer**. Audit termina aqui.

3. **Se diverge**: ajuste único na constante de cor (ou nos mocks). Cuidado para não inverter convenções já em uso na UI (revisar `SLAChip`).

**Validação**: visual no Dashboard + Fila — distribuição de cores plausível nos mocks (verde maioria, alguns amarelos, raro vermelho — coerente com cenário operacional).

**Esforço**: 15 min auditoria; +30 min se houver correção.

**Branch sugerida** (caso correção): `fix/sla-color-thresholds`.
**PR title**: `fix: ajustar thresholds de cor do SLA conforme RN 623`.

---

# B. DEFER — próxima rodada

> Esta lista existe para **registrar e justificar postergação** — não é instrução de execução agora.

| Item | Origem vault | Por que defer agora |
|---|---|---|
| **Pendenciar pedido** completo (status, fila tab, regra de retorno) | RF-011, `fluxo-pendencia-devolutiva.md` | Fora do MVP por decisão explícita do produto. 2ª etapa. |
| **Devolutiva** completa (docs solicitados, deadline 3/7/15d, SLA suspenso, agressive notification 3x WhatsApp) | RF-011, Athena discovery | Fora do MVP. 2ª etapa. |
| **Junta Médica** (dialog, ata/parecer, plataforma terceira) | RF-011, `conceitos/junta-medica.md` | Fora do MVP. Plataforma 3ª externa. 2ª etapa. |
| **RBAC `solicitations:decide`** + permissões granulares | RF-009, `papeis-usuario.md` | Auth0 já fornece user; gating UI completo é refactor amplo, não bloqueia demo. |
| **Salvar Rascunho** no wizard new-request | RF-014 | Estado complexo, não é golden-path. |
| **Firebase realtime** sync de status | RF-016, ADR-018 | Polling REST atual cobre demo. Bloqueia outras tasks no SRS. |
| **YAML config multi-tenant** (`/config/<OPERADORA_ID>/*.yaml`) | RF-015, ADR-017 | Precisa backend. A1 já remove pior caso de hardcode. |
| **DUT top-30 TEA** populadas | RF-006 | `src/types/dut.ts` é shape vazio. Conteúdo demanda VE médico. |
| **Pacote como unidade atômica** (impedir `authorizedQty` parcial em pacote) | `conceitos/pacote-codigos.md`, discovery Talita 2026-04-10 | Edge case — apenas REQ-2026-04895 usa pacote nos mocks. |
| **PendencyBanner / InjunctionBanner / SimultaneousGuidesAlert** | CLAUDE.md component map | TEA raramente tem injunction/multi-guide; não bloqueia. (PendencyBanner cai junto com fluxo de pendência.) |
| **Categoria expansion** (OPME, Onco, etc) | ADR-005 | Explicitamente fora do MVP. |
| **Histórico com sessões mensais agregadas + autorizações prévias BQ** | RF-007 | `consolidatedHistory` atual cobre piloto. |
| **CID divergence UI banner dedicado** | `arquitetura-CID-TEA.md` | Types já têm `cidDivergence`/`cidConfidence`/`cidSource`; UI atual mostra via checklist `CID_DIVERGENCIA_PRESTADOR_LAUDO`. Funcional. |
| **`synthesis_outcome.structured_facets`** formal (narrative_plain, key_document_dates, protocol_adherence, judicial_context) | `pipelines-IA.md` | `iaJustification: string` cobre informalmente. Refactor estrutural não-urgente. |
| **Token único beneficiário, hash cross-produto** | OQ-012, H-004 | Decisões ainda abertas no vault — esperar. |
| **Multi-prestador comportamento por cliente** | OQ-014 | Cada operadora trata diferente; YAML config destrava. |

---

# C. NÃO TOCAR — já aderente ao vault

| Item | Vault ref | Observação |
|---|---|---|
| Catálogo checklist (após A3.1, MVP usa 31 itens / 7 grupos — `JUNTA_MEDICA_INDICADA` removido) | `conceitos/checklist-tea.md` | Aderente em todos os outros itens. |
| Regra "texto reflete status" | ADR-012 | Memória `feedback-checklist-ux-textos.md` mantém. |
| Service layer `services/extractions/` | ADR-010 + ADR-011 | Fake/real swap, dropzone 4 estados. |
| Manual reprocess pós-upload de doc | ADR-019 | `ReprocessPromptModal` isola "decisão ≠ reprocessamento". |
| Notificações TEA simplificadas (sem auto-decision) | RF-004, comentário em `notificacao.ts:11` | Removidos `processamento_auto_aprovado`/`auto_negado`. Comentário linha 8 documenta MVP exclusões. |
| Routing metadata `queued_for_human_review` + `rf004_event_type_tea_queue_only` | RF-004 | Coerente com SRS. |
| Auth0 + middleware route guard | ADR-008 fork TEA | Colega entregou em PR #22. Bypass abandonado (PRs #23/#26 fechadas). |
| Categoria única + `CategoryChip` removido | ADR-008 | Fork limpo. |
| Header DashboardPage "Gestão Inteligente de Pedidos - Terapias Especiais" | — | Neutro, white-label-safe. |
| ChecklistFullModal a11y (DialogTitle não-aninhado) | — | Fix entregue (PR #24). |
| KPI strip + Top denial reasons no Dashboard | — | Já entregue. |
| Domain types (`GuideStatus`, `IASuggestion`, `DecisionAction`) atuais | `dominio-tipos.md` | TEA-MVP propositalmente reduzido vs. full — `'Pendente'`, `'Devolutiva'`, `'Junta Médica'` ficam para 2ª etapa. **Não adicionar.** |

---

# D. Risco-monitor (vault levanta; codebase OK por enquanto)

| Risco | Vault | Status | Ação |
|---|---|---|---|
| **R-010 fork-divergência** TEA vs full | `riscos/R-010-MVP-TEA-fork-divergencia.md` | Ativo | Mitigação atual (PRODUCT.md/AGENTS.md sincronizados) suficiente. Monitorar drift trimestral. |
| **R-006 RN-566 IA clínica** | `riscos/R-006-RN-566-IA-clinica.md` | Mitigado | Codebase respeita. Não regredir em features futuras. |
| **R-009 tenant leakage** | `riscos/R-009-tenant-leakage.md` | Mitigado | Backend; front não viola hoje (mocks per-tenant unitário). |

---

# Próximos passos sugeridos (ordem de execução)

1. ✅ Aprovar escopo A1–A4 (este plano).
2. Executar **A1** (whitelabel hygiene) — PR isolado, baixo risco.
3. Executar **A2** (remover handlers órfãos) — PR isolado, validate strict pega regressão.
4. Executar **A3** (limpar mocks/textos) — PR isolado, smoke test manual obrigatório.
5. Executar **A4** (audit SLA) — possível no-op.
6. Re-priorizar **B** com base no feedback do piloto Athena após demo.

**Total esforço A1–A4**: ~3h–3h30min. Zero refactor estrutural, zero feature de fluxo nova, alto valor para narrativa white-label + coerência de domínio + limpeza de scope-creep.

---

## Convenções por execução (por PR)

- **Branch**: `type/scope-short-desc` (inglês) — ex: `chore/whitelabel-remove-athena-hardcodes`.
- **Commit**: Conventional Commits, header ≤72 chars, lowercase subject.
- **PR title**: PT-BR, ≤70 chars.
- **PR body**: PT-BR. Sections: Resumo → Mudanças → Screenshots (se aplicável) → Ticket (último).
- **Validate**: `npm run validate` deve passar antes de cada commit.
- **Hooks**: nunca `--no-verify`. Se hook falhar, investigar causa raiz.
- **Git policy do projeto**: nunca `git add/commit/push` sem solicitação explícita do usuário (regra dura — AGENTS.md).

---

## Salvaguardas durante a execução

- **Cada PR é isolado e auto-contido** — A1, A2, A3, A4 não dependem entre si na ordem; mas A2 e A3 são complementares (A2 limpa hooks, A3 limpa mocks/textos). Recomendado fazer **A2 antes de A3** para que typecheck strict pegue qualquer link residual após remoção dos handlers.
- **Validate é gate** — se `npm run validate` falhar após uma edição, **parar imediatamente** e investigar. Não acumular erros.
- **Smoke test manual obrigatório** após A2 e A3 — abrir tela `/analise`, `/fila`, `/historico`, `/dashboard`, `/nova-solicitacao` e clicar nas ações principais. Confirmar zero quebra.
- **Revertibilidade** — cada commit em conventional commits permite revert cirúrgico se algo der errado.
- **Sem amend** — sempre criar commit novo. Hooks do projeto não permitem `--no-verify`.

---

## Referências cruzadas (vault)

### MOCs
- `00-Index.md` — orientação geral
- `Arvo Auth.md` — overview executivo
- `mocs/moc-MVP-TEA.md` — trilha CID F84
- `mocs/moc-frontend.md` — arquitetura frontend

### ADRs centrais
- ADR-005 — MVP em Terapias Especiais
- ADR-007 — Whitelabel: IA analisa, cliente decide
- ADR-008 — Fork MVP TEA
- ADR-010 — Service Layer fake/real
- ADR-011 — Análise OCR fire-and-forget (202)
- ADR-012 — Checklist: texto reflete status
- ADR-019 — Decisão humana ≠ reprocessamento IA

### Conceitos-chave
- `wizard-TEA.md` — 6 etapas
- `checklist-tea.md` — 32 itens / 7 grupos (após A3.1, MVP usa 31 — `JUNTA_MEDICA_INDICADA` fica para 2ª etapa)
- `arquitetura-CID-TEA.md` — CID resolution pipeline
- `TS-terapias-especiais.md` — escopo MVP
- `SLA-acoes-decisao.md` — referência canônica de cores SLA (decisões "Devolutiva" e "Junta Médica" fora do MVP)
- `pipelines-IA.md` — 5 estágios
- `papeis-usuario.md` — Gestor / Autorizador / Auditor
- `RFs-SRS-26Q2.md` — 16 requisitos funcionais (RF-011 fora do MVP-1 nas ações de Devolutiva/Junta)
- `dominio-tipos.md` — types canônicos do frontend (versão TEA-MVP é subset proposital)

### Discoveries diretas
- `discoveries/2026-03-24-leonardo-grigoletto-athena.md` — fluxo TS Athena (97% manual; 3x WhatsApp + junta = fora MVP)
- `discoveries/2026-04-20-davi-machado.md` — validação MVP TEA

### Riscos
- R-006 RN-566 (mitigado)
- R-009 tenant leakage (mitigado)
- R-010 fork divergência (ativo, monitorar)
