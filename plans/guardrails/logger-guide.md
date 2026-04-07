# Guia do Logger

> Substituto do `console.log` — usa `loglevel` para logging estruturado com níveis.

## Por que não usar console.log?

- `console.log` em produção é lixo — polui o console do browser
- Pode vazar dados sensíveis (tokens, dados de pacientes)
- Sem controle de nível — não dá pra desligar em prod
- ESLint bloqueia com `no-console: error`

## Configuração

**Arquivo:** `src/shared/utils/logger.ts`

```typescript
import log from 'loglevel';

const logger = log.getLogger('arvo-auth');

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('warn');
} else {
  logger.setLevel('debug');
}

export { logger };
```

## Níveis

| Nível | Quando usar | Visível em prod? |
|-------|-------------|------------------|
| `logger.debug()` | Dados de debug, valores de variáveis | Não |
| `logger.info()` | Eventos importantes (login, navegação) | Não |
| `logger.warn()` | Situações inesperadas mas não críticas | Sim |
| `logger.error()` | Erros que impactam o usuário | Sim |

## Exemplos de Uso

```typescript
import { logger } from '@/shared/utils/logger';

// Debug — development only
logger.debug('Queue filter applied', { status, category, page });

// Info — relevant events
logger.info('User authenticated', { userId: user.id, role: user.role });

// Warn — attention needed
logger.warn('SLA approaching violation', { requestId, remainingTime });

// Error — something broke
logger.error('Failed to fetch queue data', { error: err.message, endpoint });
```

## Rules

### Language
- **All log messages must be written in English** — no exceptions
- Log keys and values must also be in English

### Sensitive Data — CRITICAL
- **NEVER log**: tokens, passwords, CPF, patient data, card numbers, personal health information
- **NEVER log full API responses** — filter only relevant, non-sensitive fields
- **NEVER log request/response bodies** that may contain PII (Personally Identifiable Information)
- When logging user context, use only IDs — never names, emails, or documents
- When in doubt, **don't log it**

```typescript
// WRONG — exposes sensitive data
logger.info('User login', { email: user.email, cpf: user.cpf, token });

// CORRECT — only IDs, no PII
logger.info('User login successful', { userId: user.id, role: user.role });
```

```typescript
// WRONG — full API response may contain patient data
logger.debug('API response', response.data);

// CORRECT — only structural info
logger.debug('API response received', { status: response.status, count: response.data.length });
```

### Log Levels — Use Appropriately
- `debug` — **Development only**: variable values, filter states, data flow tracing
- `info` — **Relevant events**: authentication, navigation, successful operations
- `warn` — **Unexpected but non-critical**: SLA near violation, retry attempts, deprecation notices
- `error` — **User-impacting failures**: API errors, render failures, auth failures

### Message Format
- First argument: descriptive string of what happened
- Second argument: object with contextual data (filtered, non-sensitive)
- Keep messages concise and searchable
