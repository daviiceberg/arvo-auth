'use client';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ProcedureList from '@/shared/components/procedure-list/ProcedureList';
import { type GuiaProcedure } from '@/types/procedure-codes';

import { useStepOpme } from '@/modules/new-request/hooks/useStepOpme';

import OpmeItemCard from '../opme/OpmeItemCard';
import OpmeResumeCard from '../opme/OpmeResumeCard';

interface StepOpmeProps {
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepOpme({ guiaProcedures, onGuiaProceduresChange }: StepOpmeProps) {
  const {
    opmeItems,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleConsultAnvisa,
    summary,
  } = useStepOpme();

  return (
    <Box>
      {/* Bloco 1: Procedimento Cirúrgico */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: 15 }}>
        Procedimento Cirúrgico
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 12 }}>
        Informe os códigos TUSS ou pacotes do procedimento que utilizará o material OPME.
      </Typography>
      <ProcedureList
        procedures={guiaProcedures}
        onUpdate={onGuiaProceduresChange}
        showPeriod
        showQuantity
      />

      {/* Bloco 2: Materiais e Dispositivos OPME */}
      <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1, fontSize: 15 }}>
        Materiais e Dispositivos OPME
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 12 }}>
        Adicione cada material com seus dados de registro ANVISA e cotações de preço.
      </Typography>
      {opmeItems.map((item, i) => (
        <OpmeItemCard
          key={item.id}
          index={i + 1}
          item={item}
          onUpdate={(updated) => {
            handleUpdateItem(i, updated);
          }}
          onRemove={() => {
            handleRemoveItem(i);
          }}
          canRemove={opmeItems.length > 1}
          onConsultAnvisa={() => {
            handleConsultAnvisa(item);
          }}
        />
      ))}
      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        sx={{
          color: 'error.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '& .MuiButton-startIcon': { color: 'error.main' },
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        Adicionar material
      </Button>

      {/* Bloco 3: Resumo */}
      {guiaProcedures.length > 0 && opmeItems.length > 0 ? (
        <OpmeResumeCard
          procedures={guiaProcedures}
          totalValue={summary.totalValue}
          validAnvisa={summary.validAnvisa}
          totalItems={summary.totalItems}
          completeQuotations={summary.completeQuotations}
        />
      ) : null}
    </Box>
  );
}
