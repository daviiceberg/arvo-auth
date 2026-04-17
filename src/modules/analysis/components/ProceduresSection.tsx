'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import DutModal from '@/shared/components/dut-modal/DutModal';
import { useDutModal } from '@/shared/components/dut-modal/useDutModal';
import { CID_DATABASE, CID_GROUP_LABELS } from '@/shared/constants/cid-codes';
import { type Adjustment, type Procedure, type Request } from '@/types/pedido';

import { getDutNumberForTuss } from '@/mocks/tuss-dut-mapping';

import { USER_PROFILE } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────

function getAdjustmentForField(
  allAdjustments: Adjustment[],
  procCode: string,
  field: Adjustment['field'],
): Adjustment | undefined {
  return allAdjustments.find((a) => a.procedureCode === procCode && a.field === field);
}

function getCredentialingStatus(code: string): 'ok' | 'warning' {
  const lastDigit = parseInt(code.slice(-1));
  return lastDigit % 2 === 0 ? 'ok' : 'warning';
}

const TH_SX = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  color: 'text.secondary',
  py: '6px',
  px: 2,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

const TD_SX = { py: '8px', px: 2, verticalAlign: 'top' as const };

// ── Sub-components ──────────────────────────────────────────────────

type AdjustClickHandler = (proc: {
  codigo: string;
  descricao: string;
  qty: number;
  prestador: string;
  cid: string;
}) => void;

interface ProcedureActionCellProps {
  isGuideFinalized: boolean;
  proc: Procedure;
  hospital: string;
  onAdjustClick: AdjustClickHandler;
}

function ProcedureActionCell({
  isGuideFinalized,
  proc,
  hospital,
  onAdjustClick,
}: ProcedureActionCellProps) {
  return (
    <TableCell sx={TD_SX}>
      {USER_PROFILE !== 'Auditor' &&
        (isGuideFinalized ? (
          <Tooltip title="Guia já finalizada — edição não permitida">
            <span>
              <Button
                size="small"
                variant="outlined"
                disabled
                startIcon={<EditIcon sx={{ fontSize: 12 }} />}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: 'text.disabled',
                  py: 0.25,
                  px: 1,
                }}
              >
                Ajustar
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon sx={{ fontSize: 12 }} />}
            onClick={() => {
              onAdjustClick({
                codigo: proc.code,
                descricao: proc.description,
                qty: proc.qty,
                prestador: hospital,
                cid: proc.cid,
              });
            }}
            sx={{
              fontSize: 11,
              fontWeight: 600,
              borderColor: 'rgba(0,0,0,0.2)',
              color: 'text.secondary',
              py: 0.25,
              px: 1,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                backgroundColor: 'rgba(144,43,41,0.04)',
              },
            }}
          >
            Ajustar
          </Button>
        ))}
      {USER_PROFILE === 'Auditor' && (
        <Chip
          label="Somente leitura"
          size="small"
          sx={{
            fontSize: 11,
            height: 20,
            backgroundColor: 'rgba(0,0,0,0.06)',
            color: 'text.secondary',
          }}
        />
      )}
    </TableCell>
  );
}

// ── Expanded TUSS sub-row for packages ──────────────────────────────

function PackageTussRow({ code, description }: { code: string; description: string }) {
  return (
    <TableRow sx={{ '& td': { borderBottom: '1px solid rgba(0,0,0,0.04)' } }}>
      <TableCell />
      <TableCell sx={{ pl: 0 }}>
        <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: 'text.secondary', pl: 2 }}>
          {code}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{description}</Typography>
      </TableCell>
      <TableCell colSpan={5} />
      <TableCell />
    </TableRow>
  );
}

// ── Procedure row cell sub-components ──────────────────────────────

interface ProcedureCodeCellProps {
  code: string;
  codeAdjustment: Adjustment | undefined;
}

function ProcedureCodeCell({ code, codeAdjustment }: ProcedureCodeCellProps) {
  return (
    <TableCell sx={{ ...TD_SX, fontWeight: 700, fontSize: 13, width: 120 }}>
      {codeAdjustment ? (
        <Box>
          <Typography sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}>
            {code}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'warning.main' }}>
            {codeAdjustment.newValue.split(' — ')[0]}
          </Typography>
        </Box>
      ) : (
        code
      )}
    </TableCell>
  );
}

interface ProcedureDescCellProps {
  description: string;
  codeAdjustment: Adjustment | undefined;
}

function ProcedureDescCell({ description, codeAdjustment }: ProcedureDescCellProps) {
  return (
    <TableCell sx={{ ...TD_SX, fontWeight: 600, fontSize: 13 }}>
      {codeAdjustment ? (
        <Box>
          <Typography sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}>
            {description}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'warning.main' }}>
            {codeAdjustment.newValue.split(' — ')[1] ?? codeAdjustment.newValue}
          </Typography>
        </Box>
      ) : (
        description
      )}
    </TableCell>
  );
}

interface ProcedureQtyCellProps {
  qty: number;
  authorizedQty: number | undefined;
  qtyAdjustment: Adjustment | undefined;
}

function ProcedureQtyCell({ qty, authorizedQty, qtyAdjustment }: ProcedureQtyCellProps) {
  return (
    <TableCell sx={{ ...TD_SX, color: 'text.secondary', fontSize: 12, width: 80 }}>
      {qtyAdjustment ? (
        <Box>
          <Typography sx={{ fontSize: 12 }}>Qtd: {qty}</Typography>
          <Typography sx={{ fontSize: 12, color: 'primary.main', fontWeight: 700 }}>
            Aut: {qtyAdjustment.newValue} ✏
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          {`Qtd: ${String(qty)}${authorizedQty !== undefined ? ` · Aut: ${String(authorizedQty)}` : ''}`}
        </Typography>
      )}
    </TableCell>
  );
}

interface ProcedureProviderCellProps {
  hospital: string;
  providerAdjustment: Adjustment | undefined;
}

function ProcedureProviderCell({ hospital, providerAdjustment }: ProcedureProviderCellProps) {
  return (
    <TableCell sx={{ ...TD_SX, fontSize: 12, maxWidth: 160, minWidth: 120 }}>
      {providerAdjustment ? (
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              color: 'text.disabled',
              textDecoration: 'line-through',
              lineHeight: 1.3,
              display: 'block',
            }}
          >
            {providerAdjustment.previousValue}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
            <EditIcon sx={{ fontSize: 11, color: 'primary.main', flexShrink: 0 }} />
            <Typography
              sx={{ fontSize: 11, color: 'primary.main', fontWeight: 600, lineHeight: 1.3 }}
            >
              {providerAdjustment.newValue}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{hospital}</Typography>
      )}
    </TableCell>
  );
}

interface ProcedureStatusCellProps {
  cid: string;
  credOk: boolean;
  hasAnyAdjustment: boolean;
  isGuideFinalized: boolean;
}

function ProcedureStatusCell({
  cid,
  credOk,
  hasAnyAdjustment,
  isGuideFinalized,
}: ProcedureStatusCellProps) {
  return (
    <TableCell sx={TD_SX}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {cid ? (
          <Chip
            label={`CID ${cid}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(37,99,235,0.08)',
              color: 'info.main',
              fontWeight: 700,
              fontSize: 12,
              height: 20,
            }}
          />
        ) : null}
        <Chip
          label={credOk ? 'Credenciado' : 'Não credenciado'}
          size="small"
          sx={{
            backgroundColor: credOk ? 'rgba(22,163,74,0.1)' : 'rgba(212,24,61,0.1)',
            color: credOk ? 'success.main' : 'error.main',
            fontWeight: 700,
            fontSize: 11,
            height: 20,
          }}
        />
        {hasAnyAdjustment && !isGuideFinalized ? (
          <Chip
            icon={<EditIcon sx={{ fontSize: 10, ml: '4px !important' }} />}
            label="Ajustado"
            size="small"
            sx={{
              backgroundColor: 'rgba(144,43,41,0.1)',
              color: 'primary.main',
              fontWeight: 700,
              fontSize: 11,
              height: 20,
            }}
          />
        ) : null}
      </Box>
    </TableCell>
  );
}

// ── Main procedure row ──────────────────────────────────────────────

interface ProcedureRowProps {
  proc: Procedure;
  allAdjustments: Adjustment[];
  isGuideFinalized: boolean;
  isLast: boolean;
  hospital: string;
  onAdjustClick: AdjustClickHandler;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDutClick: (dutNumber: number) => void;
}

function ProcedureRow({
  proc,
  allAdjustments,
  isGuideFinalized,
  isLast,
  hospital,
  onAdjustClick,
  isExpanded,
  onToggleExpand,
  onDutClick,
}: ProcedureRowProps) {
  const qtyAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'quantidade');
  const providerAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'prestador');
  const codeAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'codigo');
  const hasAnyAdjustment = allAdjustments.some((a) => a.procedureCode === proc.code);
  const credOk = getCredentialingStatus(proc.code) === 'ok';
  const codeType = proc.codeType ?? 'TUSS';
  const isPackage = codeType === 'PACKAGE';
  const hasTussCodes = isPackage && (proc.tussCodesIncluded?.length ?? 0) > 0;
  const dutNumber = getDutNumberForTuss(proc.code);

  return (
    <>
      <TableRow
        sx={{
          cursor: 'default',
          '& td': { borderBottom: isLast && !isExpanded ? 'none' : '1px solid rgba(0,0,0,0.08)' },
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        {/* Tipo */}
        <TableCell sx={{ ...TD_SX, width: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CodeTypeChip codeType={codeType} onClick={hasTussCodes ? onToggleExpand : undefined} />
            {hasTussCodes ? (
              <IconButton size="small" onClick={onToggleExpand} sx={{ p: 0.25 }}>
                {isExpanded ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            ) : null}
          </Box>
        </TableCell>
        <ProcedureCodeCell code={proc.code} codeAdjustment={codeAdjustment} />
        <ProcedureDescCell description={proc.description} codeAdjustment={codeAdjustment} />
        <ProcedureQtyCell
          qty={proc.qty}
          authorizedQty={proc.authorizedQty}
          qtyAdjustment={qtyAdjustment}
        />
        <ProcedureProviderCell hospital={hospital} providerAdjustment={providerAdjustment} />
        {/* Datas */}
        <TableCell
          sx={{
            ...TD_SX,
            color: 'text.secondary',
            fontSize: 12,
            width: 140,
          }}
        >
          Solic.: {proc.requestDate}
          {proc.passwordExpiryDate ? (
            <Typography variant="caption" sx={{ display: 'block', fontSize: 11, mt: 0.25 }}>
              Val.: {proc.passwordExpiryDate}
            </Typography>
          ) : null}
        </TableCell>
        <ProcedureStatusCell
          cid={proc.cid}
          credOk={credOk}
          hasAnyAdjustment={hasAnyAdjustment}
          isGuideFinalized={isGuideFinalized}
        />
        {/* DUT */}
        <TableCell sx={{ ...TD_SX, width: 70, textAlign: 'left' }}>
          {dutNumber ? (
            <Typography
              component="button"
              onClick={() => {
                onDutClick(dutNumber);
              }}
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: 'primary.main',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                p: 0,
                whiteSpace: 'nowrap',
                textAlign: 'left',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              DUT {String(dutNumber)}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>—</Typography>
          )}
        </TableCell>
        <ProcedureActionCell
          isGuideFinalized={isGuideFinalized}
          proc={proc}
          hospital={hospital}
          onAdjustClick={onAdjustClick}
        />
      </TableRow>
      {/* Expanded TUSS codes for packages */}
      {isExpanded
        ? proc.tussCodesIncluded?.map((tuss) => (
            <PackageTussRow key={tuss.code} code={tuss.code} description={tuss.description} />
          ))
        : null}
    </>
  );
}

// ── Secondary CIDs editor ───────────────────────────────────────────

interface SecondaryCidsEditorProps {
  cids: string[];
  disabled: boolean;
  onAdd: (cid: string) => void;
  onRemove: (index: number) => void;
}

function SecondaryCidsEditor({ cids, disabled, onAdd, onRemove }: SecondaryCidsEditorProps) {
  const [showAdd, setShowAdd] = useState(false);

  if (cids.length === 0 && disabled) return null;

  return (
    <Box sx={{ pb: 2, pt: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#64748b',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        CIDs Secundários
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75, alignItems: 'center' }}>
        {cids.map((cid, i) => (
          <Chip
            key={`${cid}-${String(i)}`}
            label={cid}
            size="small"
            onDelete={
              disabled
                ? undefined
                : () => {
                    onRemove(i);
                  }
            }
            sx={{
              backgroundColor: 'rgba(100,116,139,0.08)',
              color: '#475569',
              fontWeight: 600,
              fontSize: 12,
              height: 22,
            }}
          />
        ))}
        {!disabled ? (
          <Chip
            icon={<AddIcon sx={{ fontSize: 12, ml: '4px !important' }} />}
            label="CID"
            size="small"
            variant="outlined"
            onClick={() => {
              setShowAdd(true);
            }}
            sx={{
              fontSize: 11,
              height: 22,
              cursor: 'pointer',
              borderStyle: 'dashed',
              color: 'text.secondary',
            }}
          />
        ) : null}
      </Box>
      {showAdd ? (
        <Box sx={{ mt: 1, maxWidth: 320 }}>
          <Autocomplete
            freeSolo
            openOnFocus
            options={CID_DATABASE}
            groupBy={(option) => CID_GROUP_LABELS[option.group] ?? ''}
            getOptionLabel={(opt) =>
              typeof opt === 'string' ? opt : `${opt.code} — ${opt.description}`
            }
            filterOptions={(options, { inputValue }) => {
              const q = inputValue.toLowerCase().trim();
              if (q.length < 2) return options.filter((c) => c.group === 'tea');
              return options.filter(
                (c) =>
                  c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
              );
            }}
            onChange={(_e, value) => {
              if (value && typeof value !== 'string') {
                onAdd(`${value.code} — ${value.description}`);
                setShowAdd(false);
              }
            }}
            onBlur={() => {
              setShowAdd(false);
            }}
            size="small"
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Buscar CID para adicionar..." />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      color: option.group === 'tea' ? '#166534' : 'text.secondary',
                      flexShrink: 0,
                      minWidth: 56,
                    }}
                  >
                    {option.code}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                    {option.description}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Box>
      ) : null}
    </Box>
  );
}

// ── Main section ────────────────────────────────────────────────────

interface ProceduresSectionProps {
  request: Request;
  allAdjustments: Adjustment[];
  onAdjustClick: AdjustClickHandler;
}

export default function ProceduresSection({
  request,
  allAdjustments,
  onAdjustClick,
}: ProceduresSectionProps) {
  const procs = request.procedures;
  const rp = request.requestingProvider;
  const ep = request.executingProvider;
  const isGuideFinalized = ['Aprovado', 'Negado', 'Aprovado Parcial'].includes(request.status);
  const [expandedCodes, setExpandedCodes] = useState(new Set());
  const [localSecondaryCids, setLocalSecondaryCids] = useState(request.secondaryCids ?? []);
  const dutModal = useDutModal();

  const handleRemoveSecondaryCid = (index: number) => {
    setLocalSecondaryCids((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSecondaryCid = (cid: string) => {
    setLocalSecondaryCids((prev) => (prev.includes(cid) ? prev : [...prev, cid]));
  };

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'text.secondary',
            }}
          >
            Procedimentos ({procs.length})
          </Typography>
          {request.cidSource ? (
            <Chip
              label={
                request.cidSource === 'prestador'
                  ? 'CID: Prestador'
                  : request.cidSource === 'ocr'
                    ? 'CID: OCR'
                    : 'CID: IA'
              }
              size="small"
              sx={{
                fontSize: 10,
                height: 20,
                fontWeight: 700,
                backgroundColor:
                  request.cidSource === 'prestador'
                    ? 'rgba(0,0,0,0.06)'
                    : request.cidSource === 'ocr'
                      ? 'rgba(37,99,235,0.08)'
                      : 'rgba(144,43,41,0.08)',
                color:
                  request.cidSource === 'prestador'
                    ? 'text.secondary'
                    : request.cidSource === 'ocr'
                      ? 'info.main'
                      : 'primary.main',
              }}
            />
          ) : null}
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...TH_SX, width: 80 }}>Tipo</TableCell>
                  <TableCell sx={{ ...TH_SX, width: 120 }}>Código</TableCell>
                  <TableCell sx={TH_SX}>Descrição</TableCell>
                  <TableCell sx={{ ...TH_SX, width: 80 }}>Qtd</TableCell>
                  <TableCell sx={{ ...TH_SX, minWidth: 120 }}>Prestador</TableCell>
                  <TableCell sx={{ ...TH_SX, width: 140 }}>Datas</TableCell>
                  <TableCell sx={TH_SX}>Status</TableCell>
                  <TableCell sx={{ ...TH_SX, width: 70 }}>DUT</TableCell>
                  <TableCell sx={{ ...TH_SX, minWidth: 80 }}>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {procs.map((proc, index) => (
                  <ProcedureRow
                    key={proc.code}
                    proc={proc}
                    allAdjustments={allAdjustments}
                    isGuideFinalized={isGuideFinalized}
                    isLast={index === procs.length - 1}
                    hospital={ep.name}
                    onAdjustClick={onAdjustClick}
                    isExpanded={expandedCodes.has(proc.code)}
                    onToggleExpand={() => {
                      toggleExpand(proc.code);
                    }}
                    onDutClick={dutModal.open}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
        <SecondaryCidsEditor
          cids={localSecondaryCids}
          disabled={isGuideFinalized}
          onAdd={handleAddSecondaryCid}
          onRemove={handleRemoveSecondaryCid}
        />
        {(() => {
          const providerAdj = allAdjustments.find((a) => a.field === 'prestador');
          const activeHospital = providerAdj ? providerAdj.newValue : ep.name;
          return (
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                flexWrap: 'wrap',
                pt: 2.5,
                mt: 2,
                borderTop: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    mb: 0.5,
                  }}
                >
                  Hospital / Clínica
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                    {activeHospital}
                  </Typography>
                  {providerAdj ? (
                    <Chip
                      icon={<EditIcon sx={{ fontSize: 10, ml: '4px !important' }} />}
                      label="Prestador ajustado"
                      size="small"
                      sx={{
                        fontSize: 10,
                        height: 18,
                        backgroundColor: 'rgba(144,43,41,0.08)',
                        color: 'primary.main',
                      }}
                    />
                  ) : null}
                </Box>
              </Box>
              {[
                { label: 'Profissional Solicitante', value: rp.professional },
                {
                  label: 'Conselho',
                  value: `${rp.councilType} ${rp.councilNumber}/${rp.councilUF}`,
                },
                { label: 'Contratado Solicitante', value: rp.name },
              ].map((f) => (
                <Box key={f.label}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      mb: 0.5,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                    {f.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          );
        })()}
      </CardContent>
      <DutModal open={dutModal.isOpen} onClose={dutModal.close} dutEntry={dutModal.dutEntry} />
    </Card>
  );
}
