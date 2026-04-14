'use client';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import ProcedureCodeInput from '@/shared/components/procedure-code-input/ProcedureCodeInput';
import { type GuiaProcedure } from '@/types/procedure-codes';

import ProcedureListRow from './ProcedureListRow';
import { useProcedureList } from './useProcedureList';

interface ProcedureListProps {
  procedures: GuiaProcedure[];
  onUpdate: (procedures: GuiaProcedure[]) => void;
  readOnly?: boolean;
  showPeriod?: boolean;
  showQuantity?: boolean;
  fixedIds?: Set<string>;
}

export default function ProcedureList({
  procedures,
  onUpdate,
  readOnly = false,
  showPeriod = false,
  showQuantity = true,
  fixedIds,
}: ProcedureListProps) {
  const {
    expandedIds,
    showInput,
    setShowInput,
    toggleExpand,
    handleAdd,
    handleRemove,
    handleQuantityChange,
    handlePeriodChange,
  } = useProcedureList(procedures, onUpdate);

  return (
    <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}>
      {procedures.map((proc) => (
        <ProcedureListRow
          key={proc.id}
          procedure={proc}
          readOnly={readOnly}
          showPeriod={showPeriod}
          showQuantity={showQuantity}
          isExpanded={expandedIds.has(proc.id)}
          isFixed={fixedIds?.has(proc.id) ?? false}
          onToggleExpand={() => {
            toggleExpand(proc.id);
          }}
          onRemove={() => {
            handleRemove(proc.id);
          }}
          onQuantityChange={(qty) => {
            handleQuantityChange(proc.id, qty);
          }}
          onPeriodChange={(field, value) => {
            handlePeriodChange(proc.id, field, value);
          }}
        />
      ))}
      {!readOnly && (
        <Box sx={{ p: 1.5 }}>
          {showInput ? (
            <ProcedureCodeInput onAdd={handleAdd} />
          ) : (
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowInput(true);
              }}
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
              Adicionar procedimento
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
