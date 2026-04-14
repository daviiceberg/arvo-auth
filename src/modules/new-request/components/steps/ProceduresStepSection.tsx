'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ProcedureList from '@/shared/components/procedure-list/ProcedureList';
import { type GuiaProcedure } from '@/types/procedure-codes';

interface ProceduresStepSectionProps {
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
  showPeriod?: boolean;
  showQuantity?: boolean;
  fixedIds?: Set<string>;
}

export function ProceduresStepSection({
  guiaProcedures,
  onGuiaProceduresChange,
  showPeriod = false,
  showQuantity = true,
  fixedIds,
}: ProceduresStepSectionProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: 15 }}>
        Procedimentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 12 }}>
        Inclua os códigos TUSS ou pacotes aplicáveis a esta solicitação.
      </Typography>
      <ProcedureList
        procedures={guiaProcedures}
        onUpdate={onGuiaProceduresChange}
        showPeriod={showPeriod}
        showQuantity={showQuantity}
        fixedIds={fixedIds}
      />
    </Box>
  );
}
