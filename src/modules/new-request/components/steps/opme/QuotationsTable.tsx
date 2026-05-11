'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  type OpmeFormMaterial,
  type OpmeFormQuotation,
  cheapestQuotation,
  parseNumeric,
} from '@/modules/new-request/types/opme';

const MAX_QUOTATIONS = 5;
const MIN_QUOTATIONS = 3;

interface QuotationsTableProps {
  material: OpmeFormMaterial;
  onChangeField: (
    quotationId: string,
    field: keyof Omit<OpmeFormQuotation, 'id'>,
    value: string,
  ) => void;
  onSelect: (quotationId: string) => void;
  onAdd: () => void;
  onRemove: (quotationId: string) => void;
}

function formatCurrency(value: string): string {
  const numeric = parseNumeric(value);
  if (numeric === 0) return '—';
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function QuotationsTable({
  material,
  onChangeField,
  onSelect,
  onAdd,
  onRemove,
}: QuotationsTableProps) {
  const cheapest = cheapestQuotation(material);
  const quantity = parseNumeric(material.quantity);
  const canAdd = material.quotations.length < MAX_QUOTATIONS;
  const canRemove = material.quotations.length > MIN_QUOTATIONS;

  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, py: 1.5, backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          Cotações de Fornecedores
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Mínimo de 3 cotações de fornecedores distintos. Selecione a opção escolhida — justifique
          se não escolher a mais barata.
        </Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, width: 56 }}>Escolha</TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700 }}>Fornecedor</TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700 }}>Marca / Modelo</TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700 }} align="right">
              Valor unit.
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700 }} align="right">
              Total
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, width: 100 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {material.quotations.map((quotation) => {
            const isCheapest =
              cheapest?.id === quotation.id && parseNumeric(quotation.unitValue) > 0;
            const isChosen = material.chosenQuotationId === quotation.id;
            const totalLine = parseNumeric(quotation.unitValue) * quantity;
            return (
              <TableRow key={quotation.id} hover>
                <TableCell>
                  <Tooltip title={isChosen ? 'Cotação escolhida' : 'Marcar como escolhida'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => {
                        onSelect(quotation.id);
                      }}
                    >
                      {isChosen ? (
                        <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={quotation.supplier}
                    onChange={(e) => {
                      onChangeField(quotation.id, 'supplier', e.target.value);
                    }}
                    placeholder="Fornecedor"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    value={quotation.brand}
                    onChange={(e) => {
                      onChangeField(quotation.id, 'brand', e.target.value);
                    }}
                    placeholder="Marca / Modelo"
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    size="small"
                    variant="standard"
                    value={quotation.unitValue}
                    onChange={(e) => {
                      onChangeField(quotation.id, 'unitValue', e.target.value);
                    }}
                    placeholder="0,00"
                    sx={{ minWidth: 90 }}
                    slotProps={{ input: { sx: { textAlign: 'right', fontSize: 13 } } }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600 }}>
                  {totalLine > 0
                    ? totalLine.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    : '—'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isCheapest ? (
                      <Chip
                        label="Mais barato"
                        size="small"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          height: 20,
                          backgroundColor: 'rgba(22,163,74,0.12)',
                          color: '#16a34a',
                        }}
                      />
                    ) : null}
                    {canRemove ? (
                      <Tooltip title="Remover cotação" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            onRemove(quotation.id);
                          }}
                          sx={{ color: 'text.secondary' }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
          Mínimo {MIN_QUOTATIONS}, máximo {MAX_QUOTATIONS} cotações por material.
        </Typography>
        <Button
          variant="text"
          size="small"
          startIcon={<AddOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onAdd}
          disabled={!canAdd}
          sx={{ fontSize: 12, fontWeight: 600 }}
        >
          Adicionar cotação
        </Button>
      </Box>
      {cheapest ? (
        <Box
          sx={{
            px: 2,
            py: 1,
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
            Cotação mais barata identificada: <strong>{cheapest.supplier || '—'}</strong> ·{' '}
            {formatCurrency(cheapest.unitValue)} unit.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
