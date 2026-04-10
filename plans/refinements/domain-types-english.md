> **STATUS: DONE** — Resolvido na sessão de 08/04/2026

# Renomear propriedades de tipos de domínio para inglês

> **Princípio:** Não negociamos qualidade. Todo código em inglês.

## Contexto

As interfaces de domínio (`Pedido`, `Ajuste`, `HistoricoEntry`, `SystemUser`, etc.) têm todas as propriedades em português. Isso foi herdado do projeto original feito via vibe coding. Enquanto renomeamos variáveis locais e hooks, a **fonte** (as interfaces em `src/types/`) permaneceu em português, criando uma inconsistência: o dev escreve `request.iaSugestao` em vez de `request.iaSuggestion`.

## Impacto

- `src/types/pedido.ts` — 20+ interfaces/types com ~80 propriedades em português
- `src/types/usuario.ts` — 4 interfaces com ~15 propriedades
- `src/types/notificacao.ts` — 2 interfaces com ~7 propriedades
- `src/data/pedidos.ts` — ~2.300 linhas de mock data usando essas propriedades
- `src/data/usuarios.ts` — ~140 linhas
- `src/data/notificacoes.ts` — ~75 linhas
- Todos os 6 módulos + pages não componentizadas + shared components que acessam `.propriedade`
- **Estimativa: 100+ arquivos, ~500 edições**

## Mapeamento de renomeações

### Interface Pedido (src/types/pedido.ts)

| Antes (PT)                    | Depois (EN)                       |
| ----------------------------- | --------------------------------- |
| `beneficiario`                | `beneficiary`                     |
| `beneficiario.nome`           | `beneficiary.name`                |
| `beneficiario.carteirinha`    | `beneficiary.cardNumber`          |
| `beneficiario.cpf`            | `beneficiary.cpf` (sigla, mantém) |
| `beneficiario.dataNascimento` | `beneficiary.birthDate`           |
| `beneficiario.idade`          | `beneficiary.age`                 |
| `beneficiario.sexo`           | `beneficiary.sex`                 |
| `beneficiario.plano`          | `beneficiary.plan`                |
| `beneficiario.carencia`       | `beneficiary.waitingPeriod`       |
| `prestador`                   | `provider`                        |
| `prestador.hospital`          | `provider.hospital`               |
| `prestador.medico`            | `provider.doctor`                 |
| `prestador.crm`               | `provider.crm` (sigla, mantém)    |
| `prestador.especialidade`     | `provider.specialty`              |
| `origem`                      | `origin`                          |
| `procedimentos`               | `procedures`                      |
| `alertas`                     | `alerts`                          |
| `iaSugestao`                  | `iaSuggestion`                    |
| `iaJustificativa`             | `iaJustification`                 |
| `iaChecklist`                 | `iaChecklist` (já inglês)         |
| `observacoes`                 | `observations`                    |
| `documentos`                  | `documents`                       |
| `pendenciaMotivos`            | `pendencyReasons`                 |
| `pendenciaResponsavel`        | `pendencyResponsible`             |
| `pendenciaData`               | `pendencyDate`                    |
| `subStatus`                   | `subStatus` (já inglês)           |
| `juntaParecer`                | `boardOpinion`                    |
| `juntaRecomendacao`           | `boardRecommendation`             |
| `etapaAutorizacao`            | `authorizationStage`              |
| `ajustes`                     | `adjustments`                     |
| `lockOperador`                | `operatorLock`                    |
| `liminar`                     | `injunction`                      |
| `cidsSecundarios`             | `secondaryCids`                   |
| `dataProtocolo`               | `protocolDate`                    |
| `tempoFila`                   | `queueTime`                       |
| `slaTexto`                    | `slaText`                         |
| `tipoGuia`                    | `guideType`                       |
| `categoria`                   | `category`                        |
| `nivelAuditoria`              | `auditLevel`                      |
| `prioridade`                  | `priority`                        |

### Interface Procedimento

| Antes           | Depois                   |
| --------------- | ------------------------ |
| `codigo`        | `code`                   |
| `tuss`          | `tuss` (sigla)           |
| `descricao`     | `description`            |
| `qty`           | `qty` (já abreviação EN) |
| `qtyAutorizada` | `authorizedQty`          |
| `dataInicio`    | `startDate`              |
| `dataFim`       | `endDate`                |
| `cid`           | `cid` (sigla)            |
| `nivelAud`      | `auditLevel`             |
| `fabricante`    | `manufacturer`           |
| `valorUnitario` | `unitValue`              |

### Interface Ajuste

| Antes                   | Depois                 |
| ----------------------- | ---------------------- |
| `procedimentoCodigo`    | `procedureCode`        |
| `procedimentoDescricao` | `procedureDescription` |
| `campo`                 | `field`                |
| `valorAnterior`         | `previousValue`        |
| `valorNovo`             | `newValue`             |
| `motivo`                | `reason`               |
| `fundamentacao`         | `justification`        |
| `operador`              | `operator`             |
| `perfil`                | `profile`              |

### Interface HistoricoEntry

| Antes                     | Depois               |
| ------------------------- | -------------------- |
| `beneficiario`            | `beneficiary`        |
| `carteirinha`             | `cardNumber`         |
| `plano`                   | `plan`               |
| `procedimento`            | `procedure`          |
| `medicoSolicitante`       | `requestingDoctor`   |
| `dataProtocolo`           | `protocolDate`       |
| `dataDecisao`             | `decisionDate`       |
| `acao`                    | `action`             |
| `analista`                | `analyst`            |
| `motivoDecisao`           | `decisionReason`     |
| `textoLivre`              | `freeText`           |
| `divergencia`             | `divergence`         |
| `divergenciaMotivo`       | `divergenceReason`   |
| `tempoAnaliseMin`         | `analysisTimeMin`    |
| `procedimentosDetalhados` | `detailedProcedures` |

### Interface SystemUser

| Antes                                  | Depois                           |
| -------------------------------------- | -------------------------------- |
| `nome`                                 | `name`                           |
| `ultimoAcesso`                         | `lastAccess`                     |
| `criadoEm`                             | `createdAt`                      |
| `permissions.podeAprovar`              | `permissions.canApprove`         |
| `permissions.podeNegar`                | `permissions.canDeny`            |
| `permissions.podeVisualizarRelatorios` | `permissions.canViewReports`     |
| `permissions.podeCriarUsuarios`        | `permissions.canCreateUsers`     |
| `permissions.podeVisualizarHistorico`  | `permissions.canViewHistory`     |
| `permissions.podeConfigurarSistema`    | `permissions.canConfigureSystem` |

### Types/Enums (NÃO renomear valores, só nomes de tipo)

| Antes                 | Depois             | Nota         |
| --------------------- | ------------------ | ------------ |
| `StatusGuia`          | `GuideStatus`      | Nome do type |
| `TipoGuia`            | `GuideType`        | Nome do type |
| `OrigemPedido`        | `RequestOrigin`    | Nome do type |
| `NivelAuditoria`      | `AuditLevel`       | Nome do type |
| `IASugestao`          | `IASuggestion`     | Nome do type |
| `Categoria`           | `Category`         | Nome do type |
| `DecisaoAcao`         | `DecisionAction`   | Nome do type |
| `DecisaoOrigem`       | `DecisionOrigin`   | Nome do type |
| `StatusProcessamento` | `ProcessingStatus` | Nome do type |

**IMPORTANTE:** Os VALORES dos types permanecem em português porque são termos médicos brasileiros renderizados na UI:

- `'Em Análise'`, `'Aprovado'`, `'Negado'` — ficam como estão
- `'Internação'`, `'Oncologia'`, `'OPME'` — ficam como estão
- `'Eleitiva'`, `'Urgente'`, `'Emergência'` — ficam como estão

## Estratégia de execução

1. Renomear interfaces e types em `src/types/`
2. Atualizar mock data em `src/data/`
3. Atualizar shared constants (os Record keys mudam com os nomes de tipo)
4. Atualizar shared components (props que referenciam os tipos)
5. Atualizar cada módulo
6. Atualizar pages não componentizadas
7. Build + validação visual

## Risco

Alto — 100+ arquivos. Recomendação: fazer numa sessão dedicada, com build check após cada batch de arquivos.
