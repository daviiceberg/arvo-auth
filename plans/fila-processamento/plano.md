# Fila de Processamento Assíncrono

## Escopo

Pedidos em processamento pela IA **não pertencem à Fila Operacional**. Eles ficam visíveis apenas no Dashboard, numa seção "Entrando no sistema", até serem processados.

## Mudanças

### 1. Dados (`src/data/pedidos.ts`)
- Novo tipo `StatusProcessamento`
- Novo tipo `PedidoEmProcessamento` (estrutura simplificada)
- Array exportado `pedidosEmProcessamento` com 4 mocks

### 2. Dashboard (`src/app/(main)/dashboard/page.tsx`)
- Seção "Entrando no sistema" entre Alertas e Charts
- Cards horizontais com scroll, um por pedido em processamento
- KPI "Aguardam Decisão" ganha sub-info "+ N chegando"

### 3. Fila (`src/app/(main)/fila/page.tsx`)
- Filtro explícito: só pedidos processados (já natural pois são arrays separados)

### 4. AppShell (`src/components/AppShell.tsx`)
- Badge "Fila Operacional" usa apenas `pedidos.length` (já correto)
- Novas notificações mockadas para pedidos processados/erro

### 5. Notificações (AppShell)
- 3 tipos: pronto para análise, decisão automática, erro de processamento
- Navegação ao clicar
