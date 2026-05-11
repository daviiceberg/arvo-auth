'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { TussCodeSearchField } from '@/shared/components/code-autocomplete';

import { SectionHeader } from '@/modules/new-request/components/SectionHeader';
import {
  type FormData,
  type HospitalTaxItem,
  type HospitalizationAuditChoice,
  type HospitalizationProcedimento,
  type HospitalizationTipo,
} from '@/modules/new-request/types';

const UTI_MIN_CHARS = 50;

interface StepHospitalizationProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  handleAddHospitalizationProcedimento: () => void;
  handleRemoveHospitalizationProcedimento: (id: string) => void;
  handleUpdateHospitalizationProcedimento: (
    id: string,
    field: keyof Omit<HospitalizationProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddHospitalizationTaxa: () => void;
  handleRemoveHospitalizationTaxa: (id: string) => void;
  handleUpdateHospitalizationTaxa: (
    id: string,
    field: keyof Omit<HospitalTaxItem, 'id'>,
    value: string,
  ) => void;
  /**
   * Quando true, omite cabeçalho e alerta — usado quando o componente é
   * embarcado dentro de outro step (ex: Cirurgias Eletivas), que já fornece
   * o título do passo do wizard.
   */
  embedded?: boolean;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75, display: 'block' }}
    >
      {children}
    </Typography>
  );
}

function HospitalizationGeneralFields({
  form,
  set,
  setSelect,
  showInnerTitle = true,
}: Pick<StepHospitalizationProps, 'form' | 'set' | 'setSelect'> & { showInnerTitle?: boolean }) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '16px',
        p: 2,
        mb: 2,
      }}
    >
      {showInnerTitle ? (
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          Dados da Internação
        </Typography>
      ) : null}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Tipo de Internação *</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.hospitalizationTipo}
              onChange={(e) => {
                setSelect('hospitalizationTipo')(e.target.value as HospitalizationTipo);
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="clinica_eletiva">Clínica Eletiva</MenuItem>
              <MenuItem value="semi_eletiva">Semi-Eletiva</MenuItem>
              <MenuItem value="domiciliar_alta_complexidade">Domiciliar Alta Complexidade</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Nível de Auditoria *</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.hospitalizationAuditLevel}
              onChange={(e) => {
                setSelect('hospitalizationAuditLevel')(
                  e.target.value as HospitalizationAuditChoice,
                );
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="AMBULATORIAL">Ambulatorial</MenuItem>
              <MenuItem value="HOSPITALAR">Hospitalar</MenuItem>
              <MenuItem value="UTI">UTI</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Data Prevista de Internação *</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={form.hospitalizationDataPrevista}
            onChange={set('hospitalizationDataPrevista')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Duração estimada (diárias) *</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.hospitalizationDuracao}
            onChange={set('hospitalizationDuracao')}
            placeholder="Ex: 5"
          />
        </Grid>
        {form.hospitalizationAuditLevel === 'UTI' ? (
          <Grid size={{ xs: 12 }}>
            <FieldLabel>
              Justificativa clínica de UTI * (mínimo {UTI_MIN_CHARS} caracteres)
            </FieldLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={3}
              placeholder="Descrever quadro clínico, fatores de risco e razão da indicação UTI."
              value={form.hospitalizationUtiJustificativa}
              onChange={set('hospitalizationUtiJustificativa')}
              error={
                form.hospitalizationUtiJustificativa.length > 0 &&
                form.hospitalizationUtiJustificativa.trim().length < UTI_MIN_CHARS
              }
              helperText={
                form.hospitalizationUtiJustificativa.length > 0 &&
                form.hospitalizationUtiJustificativa.trim().length < UTI_MIN_CHARS
                  ? `${String(form.hospitalizationUtiJustificativa.trim().length)}/${String(UTI_MIN_CHARS)} caracteres`
                  : ' '
              }
            />
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}

function HospitalizationProceduresList({
  form,
  handleAddHospitalizationProcedimento,
  handleRemoveHospitalizationProcedimento,
  handleUpdateHospitalizationProcedimento,
  showInnerTitle = true,
}: Pick<
  StepHospitalizationProps,
  | 'form'
  | 'handleAddHospitalizationProcedimento'
  | 'handleRemoveHospitalizationProcedimento'
  | 'handleUpdateHospitalizationProcedimento'
> & { showInnerTitle?: boolean }) {
  return (
    <Box>
      {showInnerTitle ? (
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
          Procedimentos de Internação
        </Typography>
      ) : null}
      {form.hospitalizationProcedimentos.map((proc, index) => (
        <Box
          key={proc.id}
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            p: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              Procedimento {index + 1}
            </Typography>
            {form.hospitalizationProcedimentos.length > 1 && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveHospitalizationProcedimento(proc.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 8 }}>
              <FieldLabel>Código TUSS / Pacote *</FieldLabel>
              <TussCodeSearchField
                code={proc.codigoTUSS}
                description={proc.descricaoTUSS}
                onChange={(c, d) => {
                  handleUpdateHospitalizationProcedimento(proc.id, 'codigoTUSS', c);
                  handleUpdateHospitalizationProcedimento(proc.id, 'descricaoTUSS', d);
                }}
                label=""
                placeholder="Buscar código TUSS ou pacote"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <FieldLabel>CID</FieldLabel>
              <TextField
                fullWidth
                size="small"
                value={proc.cid}
                onChange={(e) => {
                  handleUpdateHospitalizationProcedimento(proc.id, 'cid', e.target.value);
                }}
                placeholder="Ex: I50.0"
              />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <FieldLabel>Quantidade</FieldLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={proc.qtd}
                onChange={(e) => {
                  handleUpdateHospitalizationProcedimento(proc.id, 'qtd', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        variant="text"
        onClick={handleAddHospitalizationProcedimento}
        disabled={form.hospitalizationProcedimentos.length >= 5}
        startIcon={<AddOutlinedIcon fontSize="small" />}
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        Adicionar Procedimento
      </Button>
    </Box>
  );
}

function HospitalizationTaxesList({
  form,
  handleAddHospitalizationTaxa,
  handleRemoveHospitalizationTaxa,
  handleUpdateHospitalizationTaxa,
  showInnerTitle = true,
}: Pick<
  StepHospitalizationProps,
  | 'form'
  | 'handleAddHospitalizationTaxa'
  | 'handleRemoveHospitalizationTaxa'
  | 'handleUpdateHospitalizationTaxa'
> & { showInnerTitle?: boolean }) {
  return (
    <Box sx={{ mt: showInnerTitle ? 3 : 0, pb: 1 }}>
      {showInnerTitle ? (
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
          Taxas Hospitalares (TISS 18) — opcional
        </Typography>
      ) : null}
      {form.hospitalizationTaxas.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: 12, mb: 1 }}>
          Adicione taxas hospitalares para a estimativa financeira (sala, materiais, monitorização
          etc).
        </Alert>
      ) : (
        form.hospitalizationTaxas.map((taxa, index) => (
          <Box
            key={taxa.id}
            sx={{
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '16px',
              p: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="body2" fontWeight={600}>
                Taxa {index + 1}
              </Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveHospitalizationTaxa(taxa.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <FieldLabel>Código TISS 18</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={taxa.code}
                  onChange={(e) => {
                    handleUpdateHospitalizationTaxa(taxa.id, 'code', e.target.value);
                  }}
                  placeholder="Ex: 60011081"
                />
              </Grid>
              <Grid size={{ xs: 8 }}>
                <FieldLabel>Descrição</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={taxa.description}
                  onChange={(e) => {
                    handleUpdateHospitalizationTaxa(taxa.id, 'description', e.target.value);
                  }}
                  placeholder="Ex: Taxa de sala — leito hospitalar comum"
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <FieldLabel>Quantidade</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={taxa.quantity}
                  onChange={(e) => {
                    handleUpdateHospitalizationTaxa(taxa.id, 'quantity', e.target.value);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <FieldLabel>Valor unitário (R$)</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={taxa.estimatedValue}
                  onChange={(e) => {
                    handleUpdateHospitalizationTaxa(taxa.id, 'estimatedValue', e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      )}
      <Button
        variant="text"
        onClick={handleAddHospitalizationTaxa}
        disabled={form.hospitalizationTaxas.length >= 10}
        startIcon={<AddOutlinedIcon fontSize="small" />}
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        Adicionar Taxa
      </Button>
    </Box>
  );
}

export function StepHospitalization(props: StepHospitalizationProps) {
  const isEmbedded = props.embedded === true;

  // Embedded: render simples (subseções com títulos inline) — usado dentro de StepSurgeries
  if (isEmbedded) {
    return (
      <Box>
        <HospitalizationGeneralFields
          form={props.form}
          set={props.set}
          setSelect={props.setSelect}
        />
        <HospitalizationProceduresList
          form={props.form}
          handleAddHospitalizationProcedimento={props.handleAddHospitalizationProcedimento}
          handleRemoveHospitalizationProcedimento={props.handleRemoveHospitalizationProcedimento}
          handleUpdateHospitalizationProcedimento={props.handleUpdateHospitalizationProcedimento}
        />
        <HospitalizationTaxesList
          form={props.form}
          handleAddHospitalizationTaxa={props.handleAddHospitalizationTaxa}
          handleRemoveHospitalizationTaxa={props.handleRemoveHospitalizationTaxa}
          handleUpdateHospitalizationTaxa={props.handleUpdateHospitalizationTaxa}
        />
      </Box>
    );
  }

  // Standalone: blocos numerados com SectionHeader + Dividers (padrão StepSurgeries)
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 15 }}>
        Plano de Internação
      </Typography>
      <Alert severity="info" sx={{ mb: 3, fontSize: 13 }}>
        Internação eletiva planejada. Preencha os dados gerais, procedimentos vinculados e taxas
        hospitalares (TISS 18). UTI exige justificativa clínica robusta.
      </Alert>

      {/* Bloco 1: Dados gerais */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          title="1. Dados da Internação"
          subtitle="Tipo, nível de auditoria, data prevista e duração estimada."
        />
        <HospitalizationGeneralFields
          form={props.form}
          set={props.set}
          setSelect={props.setSelect}
          showInnerTitle={false}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bloco 2: Procedimentos */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          title="2. Procedimentos"
          subtitle="Códigos TUSS / Pacote relacionados à internação."
        />
        <HospitalizationProceduresList
          form={props.form}
          handleAddHospitalizationProcedimento={props.handleAddHospitalizationProcedimento}
          handleRemoveHospitalizationProcedimento={props.handleRemoveHospitalizationProcedimento}
          handleUpdateHospitalizationProcedimento={props.handleUpdateHospitalizationProcedimento}
          showInnerTitle={false}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bloco 3: Taxas */}
      <Box>
        <SectionHeader
          title="3. Taxas Hospitalares"
          subtitle="Tabela TISS 18 (opcional, para estimativa financeira)."
        />
        <HospitalizationTaxesList
          form={props.form}
          handleAddHospitalizationTaxa={props.handleAddHospitalizationTaxa}
          handleRemoveHospitalizationTaxa={props.handleRemoveHospitalizationTaxa}
          handleUpdateHospitalizationTaxa={props.handleUpdateHospitalizationTaxa}
          showInnerTitle={false}
        />
      </Box>
    </Box>
  );
}
