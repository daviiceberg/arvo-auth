'use client';

import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { CHIP_BASE_SX } from './chip-styles';

/**
 * Marcador OPME — atributo transversal do pedido, NÃO categoria.
 *
 * Mantém a família de cor OPME (laranja-marrom) para preservar reconhecimento,
 * mas usa fundo mais desbotado (0.05 vs 0.1 do CategoryChip OPME) para sinalizar
 * que é um qualifier secundário, não a categoria primária do pedido. Aparece
 * lado a lado com o CategoryChip da categoria real (ex: "Cirurgias Eletivas").
 *
 * Renderizado quando `surgery.hasOpme === true` ou `opmeMaterials.length > 0`,
 * em pedidos cuja categoria primária NÃO é 'OPME'.
 */
export default function OpmeBadge() {
  return (
    <Tooltip
      title="Pedido contém material OPME — material implantável requer auditoria adicional"
      arrow
    >
      <Chip
        label="OPME"
        size="small"
        sx={{
          ...CHIP_BASE_SX,
          backgroundColor: 'rgba(217,119,6,0.05)',
          color: '#b45309',
        }}
      />
    </Tooltip>
  );
}
