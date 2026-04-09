## Backend Integration

- **Swagger UI (routes & contracts):** https://authz-api.sandbox.arvohealth.com/docs
- **General API documentation:** https://authz-api.sandbox.arvohealth.com/api/docs/
- **Module-specific docs:** https://authz-api.sandbox.arvohealth.com/api/docs/{module}/{file}

**Rules:**

- Before implementing any API call, fetch the contract from the Swagger at the URL above to discover the exact route, method, request body, query params, and response schema.
- Never assume or hardcode contracts — always derive types and payloads from the Swagger definition.
- For domain-level understanding (business rules, error codes, flows), consult the module-specific docs endpoint.

### No Mocks for Backend-Dependent Modules [CRITICAL]

- **NEVER** create mock data, stub responses, or fake API layers for modules that require real backend integration. Mocks hide integration gaps and create false confidence.
- The only accepted use of mocks is within **unit and integration tests** (MSW handlers scoped to test files), never in production or development runtime code.

### Missing or Incomplete Backend Endpoints

If, during Research or Implementation, an endpoint required by this frontend module does not exist in the Swagger, is incomplete, or needs changes in the backend:

1. **Stop.** Do not implement a workaround, mock, or stub.
2. **Notify the user** clearly, specifying:

- Which feature/flow is blocked.
- Which route, method, and contract are missing or incorrect.
- What the expected contract should be (request/response shape, auth requirements, error codes).

3. **Ask for authorization** before proceeding: _"Posso criar uma Issue no repositório do backend (`arvo-health/arvo-auth`) detalhando o que precisa ser implementado?"_
4. **If authorized**, create a GitHub Issue at https://github.com/arvo-health/arvo-auth with maximum detail, written in **Portuguese-BR**, including:

- **Contexto:** qual funcionalidade do frontend depende deste endpoint e por quê ele é necessário.
- **Endpoint esperado:** método HTTP, rota completa, autenticação necessária.
- **Request contract:** todos os campos do body/query/path params, seus tipos, obrigatoriedade e validações esperadas.
- **Response contract:** estrutura esperada de sucesso (status code + body) e de erros (status codes + mensagens).
- **Regras de negócio relevantes:** comportamentos esperados, edge cases, restrições de domínio.
- **Critérios de aceite:** lista objetiva do que o endpoint deve satisfazer para que a integração frontend seja considerada completa.
