'use client';

import { useRouter } from 'next/navigation';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

interface BeneficiarySectionProps {
  entry: HistoryEntry;
}

const LABEL_SX = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
  mb: 0.5,
};

function SexChip({ sex }: { sex: 'M' | 'F' }) {
  const isMale = sex === 'M';
  return (
    <Chip
      icon={
        isMale ? (
          <MaleIcon sx={{ fontSize: 14, color: '#1d4ed8' }} />
        ) : (
          <FemaleIcon sx={{ fontSize: 14, color: '#be185d' }} />
        )
      }
      label={isMale ? 'Masculino' : 'Feminino'}
      size="small"
      sx={{
        backgroundColor: isMale ? 'rgba(29,78,216,0.08)' : 'rgba(190,24,93,0.08)',
        color: isMale ? '#1d4ed8' : '#be185d',
        fontWeight: 600,
        height: 22,
        fontSize: 12,
      }}
    />
  );
}

function HeaderRow({
  name,
  sex,
  age,
  onSeeAll,
}: {
  name: string;
  sex: 'M' | 'F';
  age: number;
  onSeeAll: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75 }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${String(age)} anos`}
            size="small"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.06)',
              color: '#6b7280',
              fontWeight: 600,
              height: 22,
              fontSize: 12,
            }}
          />
          <SexChip sex={sex} />
        </Box>
      </Box>
      <Button
        size="small"
        variant="outlined"
        onClick={onSeeAll}
        sx={{
          fontSize: 12,
          py: 0.5,
          flexShrink: 0,
          color: 'primary.main',
          borderColor: 'rgba(144,43,41,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        Ver todas as guias deste beneficiário →
      </Button>
    </Box>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={LABEL_SX}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value}
      </Typography>
    </Box>
  );
}

function CarenciaField({ carencia }: { carencia: boolean }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={LABEL_SX}>
        Carência
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ fontSize: 13, color: carencia ? 'warning.main' : 'success.main' }}
      >
        {carencia ? 'Em carência' : 'Sem carência'}
      </Typography>
    </Box>
  );
}

function buildDataFields(entry: HistoryEntry) {
  const fields: { label: string; value: string }[] = [
    { label: 'Carteirinha', value: entry.cardNumber },
    { label: 'CPF', value: entry.cpf ?? '—' },
    { label: 'Nascimento', value: entry.birthDate ?? '—' },
    { label: 'Plano', value: entry.plan },
  ];
  if (entry.planInclusionDate) {
    fields.push({ label: 'Inclusão no Plano', value: entry.planInclusionDate });
  }
  if (entry.contactPhone) {
    fields.push({ label: 'Telefone', value: entry.contactPhone });
  }
  return fields;
}

export default function BeneficiarySection({ entry }: BeneficiarySectionProps) {
  const router = useRouter();
  const sex = entry.sex ?? 'M';
  const age = entry.age ?? 45;
  const carencia = entry.waitingPeriod ?? false;
  const fields = buildDataFields(entry);

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
          Beneficiário
        </Typography>

        <HeaderRow
          name={entry.beneficiary}
          sex={sex}
          age={age}
          onSeeAll={() => {
            router.push(`/fila?beneficiario=${encodeURIComponent(entry.beneficiary)}`);
          }}
        />

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
          {fields.map((f) => (
            <DataField key={f.label} label={f.label} value={f.value} />
          ))}
          <CarenciaField carencia={carencia} />
          {entry.planScope ? <DataField label="Abrangência" value={entry.planScope} /> : null}
        </Box>

        {entry.beneficiaryNotes ? (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
            sx={{ mt: 2, fontSize: 12 }}
          >
            <strong>Nota do cadastro:</strong> {entry.beneficiaryNotes}
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
