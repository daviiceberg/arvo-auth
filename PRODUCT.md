# Arvo Auth — Product Domain Context

> This file provides domain knowledge for AI-assisted development. It answers "what" and "why" so that CLAUDE.md can focus on "how".

## Identity

Arvo Auth é uma plataforma de **infraestrutura de autorização** para operadoras de saúde brasileiras. Produto **white-label** multi-operadora que cobre o espectro completo de pedidos de autorização — de terapias ambulatoriais a procedimentos hospitalares críticos e OPME.

A entrega evoluiu por milestones e hoje suporta nove categorias clínicas distintas, cada uma com regras administrativas, fluxos de SLA e validações próprias.

**Core principle:** "A Arvo gera a análise (ponto de vista) — a operadora decide a consequência (decisão/automação)." The AI produces structured analysis; the operator configures what happens as a result.

## What problem it solves

Authorization analysts at operators spend 80%+ of their time on mechanical cross-referencing: checking eligibility, carência, delinquency, provider credentials, clinical history, SLA deadlines — across multiple disconnected systems. Arvo Auth consolidates this into a single workspace where AI pre-processes and triages, so human cognition is reserved for clinical judgment only.

## Regulatory context

- **ANS (Agência Nacional de Saúde Suplementar):** The federal regulator. All decisions must comply with ANS normatives.
- **TISS (Troca de Informações em Saúde Suplementar):** The mandatory data exchange standard. Defines field requirements that vary by request type.
- **TUSS (Terminologia Unificada da Saúde Suplementar):** The standardized procedure code table. Operators may use proprietary package codes that must map back to TUSS.
- **RN 566/2022:** Prohibits AI from autonomously denying requests on clinical grounds. Administrative denials (missing documents, invalid CRM, ineligibility) are permitted. Define prazos de realização (constraint que pode encurtar o prazo de resposta).
- **RN 623/2024:** Substitui RN 395/2016 desde 01/07/2025. Define prazos de resposta ao beneficiário (Art. 12) e IGR (Índice de Garantia de Atendimento). Prazo de resposta nunca pode exceder o prazo de realização — RN 566 atua como constraint.
- **RN 539/2022:** Governs Terapias Especiais for CID F84.x (autism spectrum). Mandates unlimited therapy sessions — no quantity caps.
- **RN 483/2022:** NIP (Notificação de Intermediação Preliminar) — quando beneficiário reclama à ANS, dispara prazo regulatório curto. Pedidos com NIP aberta sobem na fila.
- **Lei 9.656/98 art. 35-C:** Cobertura obrigatória de urgência/emergência. Carência máxima 24h. Manchester vermelho/laranja → atendimento não pode ser interrompido; sistema auto-aprova com registro retroativo para auditoria.
- **SLA rules:** ANS-mandated response deadlines. The clock does NOT pause for pendency returns, making devolutivas (returned requests) time-critical.

## Request categories supported

O produto cobre **nove categorias clínicas**, entregues incrementalmente por milestone:

| Categoria                    | Escopo principal                                                                                          | Particularidades                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Terapias Especiais**       | Terapias ABA, fonoaudiologia, terapia ocupacional, fisioterapia, psicopedagogia (CID F84.x — TEA e afins) | RN 539/2022 — sessões ilimitadas                                                          |
| **SADT**                     | Serviços ambulatoriais de diagnóstico e terapia                                                           | Maior parte automação Tier 1                                                              |
| **Exames Alta Complexidade** | RM, TC, PET-CT, exames de alto custo                                                                      | DUTs específicas por procedimento                                                         |
| **Home Care**                | Atendimento domiciliar (enfermagem, fisio, paliativo)                                                     | Frequência + duração + equipamentos                                                       |
| **Urgência/Emergência**      | Atendimentos em PS/PA, trauma, emergência hospitalar                                                      | Manchester (vermelho/laranja) → auto-aprovação por Lei 9.656/98 art. 35-C                 |
| **Oncologia**                | Quimio, radio, hormonio, imunoterapia                                                                     | Estadiamento TNM, protocolo, ciclo, linha de tratamento                                   |
| **Internação**               | Eletiva, semi-eletiva, domiciliar de alta complexidade                                                    | Diárias, taxas, justificativa UTI                                                         |
| **Cirurgias Eletivas**       | Cirurgias programadas com ou sem OPME embutido                                                            | Procedimento principal + acessórios, pré-operatório, hospitalização                       |
| **OPME**                     | Órteses, próteses e materiais especiais (standalone ou embutido em cirurgia)                              | ANVISA registro, ≥3 cotações, justificativa estruturada quando não escolher a mais barata |

Modalidades de Terapias Especiais (categoria fundadora) seguem com tratamento próprio: Fonoaudiologia, Psicologia (ABA e demais abordagens), Terapia Ocupacional, Fisioterapia, Psicopedagogia.

### Administrative auto-filter

Antes de qualquer avaliação clínica, o sistema aplica verificações administrativas. Se regras configuráveis pela operadora forem acionadas, o pedido pode ser auto-negado sem revisão humana. Exemplos comuns:

- CID exigido pela categoria ausente ou não confirmado no laudo (ex.: F84 em Terapias Especiais — regra operadora-configurável)
- Laudo obrigatório (neuropsicológico, oncológico, anestésico) ausente, ilegível ou vencido
- Assinatura, carimbo ou CRM do médico inválidos
- Beneficiary ineligible (carência not fulfilled, contract inactive, delinquency)
- Prestador não credenciado
- OPME sem ANVISA vigente (bloqueio regulatório — não pode ser autorizado)

> **Key for developers:** The auto-filter is operator-configurable. Client A may auto-deny on missing signature; Client B may just flag an alert. Never hardcode the consequence — only the detection.

## Operational flow (maps to UI modules)

```
1. ENTRY (Nova Solicitação)
   Request arrives → OCR extracts data → TISS validation → administrative checks

2. TRIAGE (Dashboard + Processing Queue)
   AI classifies complexity → auto-approve Tier 1 if eligible
   → route Tier 2 to Fila Operacional after AI completes analysis
   → requests in-progress show in "Entrando no sistema" (Dashboard processing queue)

3. WORKSPACE (Fila Operacional)
   Analyst sees prioritized queue:
   - Urgência/Emergência → top priority
   - Devolutivas (pendency returns) → high priority (SLA clock running)
   - General → sorted by complexity, risk value, SLA proximity

4. ANALYSIS (Tela de Análise)
   Consolidated view: beneficiary data, clinical history timeline,
   procedure details, documents, AI assistant sidebar.
   AI provides: Suggestion (approve/deny/inconclusive), confidence level,
   technical justification, checklist of verified criteria.

5. DECISION
   Analyst approves, denies, sends to pendency, or escalates to medical board.
   Divergence from AI suggestion requires mandatory justification.
   All decisions are immutable audit records.

6. HISTORY (Histórico)
   Only finalized decisions appear here. Searchable, filterable, auditable.
```

## Domain vocabulary (controlled terms)

Use these exact terms in code, UI labels, and logs. Never invent synonyms.

| Term              | Meaning                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Guia              | Authorization request (the core entity)                                                                            |
| Beneficiário      | The insured patient                                                                                                |
| Operadora         | The health insurance operator (the client company)                                                                 |
| Prestador         | Healthcare provider (hospital, clinic, physician)                                                                  |
| Solicitante       | The requesting physician                                                                                           |
| Executante        | The executing provider                                                                                             |
| Carência          | Contractual waiting period before coverage activates                                                               |
| Inadimplência     | Beneficiary payment delinquency                                                                                    |
| Elegibilidade     | Whether the beneficiary qualifies for the requested procedure                                                      |
| Devolutiva        | A request returned to the provider for missing information                                                         |
| Pendência         | A hold state — request needs additional info before decision                                                       |
| Junta Médica      | Medical board escalation for complex clinical disputes                                                             |
| Divergência       | When the analyst disagrees with the AI suggestion                                                                  |
| Laudo             | Clinical report/justification from the requesting physician                                                        |
| OPME              | Órteses, Próteses e Materiais Especiais                                                                            |
| SADT              | Serviço Auxiliar de Diagnóstico e Terapia                                                                          |
| NIP               | Notificação de Intermediação Preliminar (ANS regulatory notice)                                                    |
| Liminar           | Court injunction requiring authorization regardless of rules                                                       |
| High-User         | Beneficiary with abnormal utilization patterns (fraud/waste signal)                                                |
| Bypass Automático | AI auto-decision without human review                                                                              |
| Código de Pacote  | Operator-proprietary code grouping N TUSS codes into one bundle (starts with 9)                                    |
| Tabela TISS       | ANS-standardized tables: 18 (diárias/taxas), 19 (materiais), 20 (medicamentos), 22 (procedimentos/exames/terapias) |
| CBHPM             | Classificação Brasileira Hierarquizada de Procedimentos Médicos                                                    |

## Procedure codes: TUSS and packages

The system works with two code layers simultaneously:

**TUSS codes** are standardized by ANS. Providers (prestadores) submit requests using TUSS codes. This is the lingua franca of the sector.

**Package codes (códigos de pacote)** are created by each operator individually. They typically start with the digit 9 (e.g., 98911044). One package code groups N TUSS codes. They are pre-registered in the system per operator — they do NOT come from the provider's request.

**Critical rules for developers:**

- TUSS code fields are mandatory in ALL request categories, including urgência/emergência (default code 10101039) and internação
- The provider sends only TUSS codes. The system matches them to a package if the operator has one registered
- A package is an atomic decision unit: approved or denied as a whole, never partially
- Package data is operator-specific (whitelabel) — never hardcode packages
- The autocomplete for code input must search both TUSS tables and operator packages, grouped separately
- Reference data comes from TISS tables 18, 19, 20, 22 + CBHPM, loaded in the database

## AI behavior rules (impacts UI and logic)

1. **AI never clinically denies.** Administrative denial is permitted. Clinical denial requires human decision.
2. **AI suggestions are advisory.** UI must never present AI output as a final decision. Labels: "Sugestão da IA", "Ponto de Vista", never "Decisão da IA".
3. **Confidence level drives routing**, not decisioning. High confidence ≥ 90% enables automation for Tier 1. For Tier 2, confidence informs the analyst but does not auto-decide.
4. **Every AI output must be explainable.** The checklist and justification are mandatory, not optional extras.
5. **RN 539/2022 override (Terapias Especiais):** For CID F84.x, session limits do not apply. Any alert about exceeded session counts must be suppressed or clearly marked as informational-only.
6. **Auto-aprovação regulatória de Urgência/Emergência:** Manchester vermelho/laranja → `routing.outcome: 'auto_decision'` + `status: 'Aprovado'`. Base: Lei 9.656/98 art. 35-C + RN 566/2022. Auditoria pós-fato confirma adequação clínica; glosa retroativa permitida se descaracterizada.
7. **OPME — atributo transversal:** Pedidos com OPME podem ter `category: 'OPME'` (standalone) ou OPME embutido em Cirurgias Eletivas / Oncologia (`surgery.hasOpme === true` ou `opmeMaterials.length > 0`). Renderizar `OpmeBadge` ao lado do `CategoryChip` quando embutido. Aba "Tem OPME" na fila operacional unifica visão.

## Eligibility data layer

The system queries operator data through an abstraction called "Arvo format" — a normalized schema that decouples authorization logic from each operator's ERP. The key data domains:

- **Beneficiary eligibility:** Contract status, carência fulfillment, inadimplência
- **Provider credentialing:** Whether the prestador is in the operator's network
- **Procedure coverage:** Whether the TUSS code is covered by the beneficiary's plan
- **Utilization limits:** Session quotas, annual caps (except where RN 539 overrides for Terapias Especiais CID F84.x)
- **TUSS mapping:** Translation between operator-proprietary codes and official TUSS codes

> **For developers:** When mocking data or building services, always go through the eligibility service layer. Never query operator data directly.
