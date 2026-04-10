'use client';

import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EditIcon from '@mui/icons-material/Edit';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { type Request, type Adjustment, type Procedure } from '@/data/pedidos';

import { USER_PROFILE } from '../types';

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

type AdjustClickHandler = (proc: {
  codigo: string;
  descricao: string;
  qty: number;
  prestador: string;
  fabricante?: string;
  valorUnitario?: number;
}) => void;

interface OpmeFieldsProps {
  manufacturer: string | undefined;
  unitValue: number | undefined;
}

function OpmeFields({ manufacturer, unitValue }: OpmeFieldsProps) {
  if (!manufacturer && !unitValue) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75, flexWrap: 'wrap' }}>
      {manufacturer ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BusinessOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
            {manufacturer}
          </Typography>
        </Box>
      ) : null}
      {unitValue ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MonetizationOnOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.primary" sx={{ fontSize: 12, fontWeight: 600 }}>
            {unitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

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
    <TableCell sx={{ verticalAlign: 'top', pt: 1, pr: 0 }}>
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
                fabricante: proc.manufacturer,
                valorUnitario: proc.unitValue,
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
                borderColor: '#902B29',
                color: '#902B29',
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

interface ProcedureRowProps {
  proc: Procedure;
  allAdjustments: Adjustment[];
  isGuideFinalized: boolean;
  isLast: boolean;
  hospital: string;
  onAdjustClick: AdjustClickHandler;
}

function ProcedureRow({
  proc,
  allAdjustments,
  isGuideFinalized,
  isLast,
  hospital,
  onAdjustClick,
}: ProcedureRowProps) {
  const qtyAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'quantidade');
  const providerAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'prestador');
  const codeAdjustment = getAdjustmentForField(allAdjustments, proc.code, 'codigo');
  const hasAnyAdjustment = allAdjustments.some((a) => a.procedureCode === proc.code);
  const credStatus = getCredentialingStatus(proc.code);
  const credOk = credStatus === 'ok';

  return (
    <TableRow
      sx={{
        cursor: 'default',
        '& td': { borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.08)' },
        '&:not(:first-of-type) td': { pt: 2 },
        '&:hover': { backgroundColor: 'transparent' },
      }}
    >
      <TableCell
        sx={{ pl: 0, fontWeight: 700, fontSize: 13, width: 120, verticalAlign: 'top', pt: 1.5 }}
      >
        {proc.manufacturer !== undefined && (
          <Chip
            label="OPME"
            size="small"
            sx={{
              fontSize: 10,
              height: 18,
              backgroundColor: 'rgba(144,43,41,0.1)',
              color: 'primary.main',
              fontWeight: 700,
              mb: 0.5,
              display: 'block',
              width: 'fit-content',
            }}
          />
        )}
        {codeAdjustment ? (
          <Box>
            <Typography
              sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}
            >
              {proc.code}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>
              {codeAdjustment.newValue.split(' — ')[0]}
            </Typography>
          </Box>
        ) : (
          proc.code
        )}
      </TableCell>
      <TableCell sx={{ fontWeight: 600, fontSize: 13, verticalAlign: 'top', pt: 1.5 }}>
        {codeAdjustment ? (
          <Box>
            <Typography
              sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}
            >
              {proc.description}
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#b45309' }}>
              {codeAdjustment.newValue.split(' — ')[1] ?? codeAdjustment.newValue}
            </Typography>
          </Box>
        ) : (
          proc.description
        )}
        <OpmeFields manufacturer={proc.manufacturer} unitValue={proc.unitValue} />
      </TableCell>
      <TableCell
        sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5, width: 80 }}
      >
        {qtyAdjustment ? (
          <Box>
            <Typography sx={{ fontSize: 12 }}>Qtd: {proc.qty}</Typography>
            <Typography sx={{ fontSize: 12, color: 'primary.main', fontWeight: 700 }}>
              Aut: {qtyAdjustment.newValue} ✏
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            {`Qtd: ${String(proc.qty)}${proc.authorizedQty !== undefined ? ` · Aut: ${String(proc.authorizedQty)}` : ''}`}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ fontSize: 12, verticalAlign: 'top', pt: 1.5, maxWidth: 160, minWidth: 120 }}>
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
      <TableCell
        sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5, width: 140 }}
      >
        {proc.startDate} → {proc.endDate}
      </TableCell>
      <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {proc.cid ? (
            <Chip
              label={`CID ${proc.cid}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(37,99,235,0.08)',
                color: '#2563eb',
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
              color: credOk ? '#16a34a' : '#d4183d',
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
      <ProcedureActionCell
        isGuideFinalized={isGuideFinalized}
        proc={proc}
        hospital={hospital}
        onAdjustClick={onAdjustClick}
      />
    </TableRow>
  );
}

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
  const p = request.provider;
  const isGuideFinalized = ['Aprovado', 'Negado', 'Aprovado Parcial'].includes(request.status);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            mb: 2,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(0,0,0,0.08)' } }}>
              <TableCell
                sx={{
                  pl: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                  width: 120,
                }}
              >
                Código
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                }}
              >
                Descrição
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                  width: 80,
                }}
              >
                Qtd
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                  minWidth: 120,
                }}
              >
                Prestador
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                  width: 140,
                }}
              >
                Período
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  pb: 1,
                  pr: 0,
                }}
              />
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
                hospital={p.hospital}
                onAdjustClick={onAdjustClick}
              />
            ))}
          </TableBody>
        </Table>
        {request.secondaryCids && request.secondaryCids.length > 0 ? (
          <Box sx={{ px: 2.5, pb: 2, pt: 0.5 }}>
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
              {request.secondaryCids.map((cid, i) => (
                <Chip
                  key={i}
                  label={cid}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(100,116,139,0.08)',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 12,
                    height: 20,
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : null}
        {(() => {
          const providerAdj = allAdjustments.find((a) => a.field === 'prestador');
          const activeHospital = providerAdj ? providerAdj.newValue : p.hospital;
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
                { label: 'Médico Solicitante', value: p.doctor },
                { label: 'CRM', value: p.crm },
                { label: 'Especialidade', value: p.specialty },
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
    </Card>
  );
}
