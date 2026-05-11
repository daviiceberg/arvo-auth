'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { TussCodeSearchField } from '@/shared/components/code-autocomplete';

import { PreOpSection } from '@/modules/new-request/components/PreOpSection';
import { SectionHeader } from '@/modules/new-request/components/SectionHeader';
import { StepHospitalization } from '@/modules/new-request/components/steps/StepHospitalization';
import {
  type FormData,
  type HospitalTaxItem,
  type HospitalizationProcedimento,
  type PreOpFormItem,
  type SurgeryAcessorio,
  type SurgeryTipoChoice,
} from '@/modules/new-request/types';

interface StepSurgeriesProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  // Reuso M4: campos hospitalização
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
  // Cirurgia-específico
  handleSetSurgeryTipo: (next: SurgeryTipoChoice) => void;
  handleSetSurgeryMainProcedure: (code: string, description: string) => void;
  handleAddSurgeryAcessorio: () => void;
  handleRemoveSurgeryAcessorio: (id: string) => void;
  handleUpdateSurgeryAcessorio: (
    id: string,
    field: keyof Omit<SurgeryAcessorio, 'id'>,
    value: string,
  ) => void;
  handleSetSurgeryHasOpme: (value: boolean) => void;
  handleSetSurgeryHasOncologyLink: (value: boolean) => void;
  handleAddPreOpItem: () => void;
  handleRemovePreOpItem: (id: string) => void;
  handleUpdatePreOpItem: (
    id: string,
    field: keyof Omit<PreOpFormItem, 'id' | 'templateId'>,
    value: string | boolean,
  ) => void;
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

function SurgeryGeneralFields({
  form,
  set,
  handleSetSurgeryTipo,
  handleSetSurgeryMainProcedure,
}: Pick<
  StepSurgeriesProps,
  'form' | 'set' | 'handleSetSurgeryTipo' | 'handleSetSurgeryMainProcedure'
>) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '16px',
        p: 2,
        mb: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Tipo de Cirurgia *</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.surgeryTipo}
              onChange={(e) => {
                handleSetSurgeryTipo(e.target.value as SurgeryTipoChoice);
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="geral_eletiva">Geral Eletiva</MenuItem>
              <MenuItem value="ortopedica_programada">Ortopédica Programada</MenuItem>
              <MenuItem value="oftalmologica">Oftalmológica</MenuItem>
              <MenuItem value="plastica_reparadora">Plástica Reparadora</MenuItem>
              <MenuItem value="oncologica_eletiva">Oncológica Eletiva</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Procedimento Principal (TUSS / Pacote) *</FieldLabel>
          <TussCodeSearchField
            code={form.surgeryMainProcedureCode}
            description={form.surgeryMainProcedureDescription}
            onChange={(c, d) => {
              handleSetSurgeryMainProcedure(c, d);
            }}
            label=""
            placeholder="Buscar código TUSS ou pacote"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Notas adicionais</FieldLabel>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            placeholder="Observações sobre o plano cirúrgico, abordagem, vias, etc."
            value={form.surgeryNotes}
            onChange={set('surgeryNotes')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function SurgeryAcessoriosList({
  form,
  handleAddSurgeryAcessorio,
  handleRemoveSurgeryAcessorio,
  handleUpdateSurgeryAcessorio,
}: Pick<
  StepSurgeriesProps,
  | 'form'
  | 'handleAddSurgeryAcessorio'
  | 'handleRemoveSurgeryAcessorio'
  | 'handleUpdateSurgeryAcessorio'
>) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Procedimentos Acessórios — opcional
      </Typography>
      {form.surgeryAcessorios.map((acc, index) => (
        <Box
          key={acc.id}
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            p: 1.5,
            mb: 1.5,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              Acessório {index + 1}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                handleRemoveSurgeryAcessorio(acc.id);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
          <TussCodeSearchField
            code={acc.codigoTUSS}
            description={acc.descricaoTUSS}
            onChange={(c, d) => {
              handleUpdateSurgeryAcessorio(acc.id, 'codigoTUSS', c);
              handleUpdateSurgeryAcessorio(acc.id, 'descricaoTUSS', d);
            }}
            label=""
            placeholder="Buscar código TUSS ou pacote"
          />
        </Box>
      ))}
      <Button
        variant="text"
        onClick={handleAddSurgeryAcessorio}
        disabled={form.surgeryAcessorios.length >= 5}
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
        Adicionar Procedimento Acessório
      </Button>
    </Box>
  );
}

function SurgeryToggles({
  form,
  handleSetSurgeryHasOpme,
  handleSetSurgeryHasOncologyLink,
}: Pick<
  StepSurgeriesProps,
  'form' | 'handleSetSurgeryHasOpme' | 'handleSetSurgeryHasOncologyLink'
>) {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Tooltip
        title="OPME (órteses, próteses e materiais especiais) entrará em milestone futuro (M5). Toggle desabilitado por enquanto."
        arrow
      >
        <FormControlLabel
          sx={{ width: 'fit-content' }}
          control={
            <Switch
              checked={form.surgeryHasOpme}
              disabled
              onChange={(e) => {
                handleSetSurgeryHasOpme(e.target.checked);
              }}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
              Esta cirurgia tem OPME? (disponível em M5)
            </Typography>
          }
        />
      </Tooltip>
      <FormControlLabel
        sx={{ width: 'fit-content' }}
        control={
          <Switch
            checked={form.surgeryHasOncologyLink}
            onChange={(e) => {
              handleSetSurgeryHasOncologyLink(e.target.checked);
            }}
          />
        }
        label={
          <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600 }}>
            Cirurgia oncológica? (vincula protocolo M3 — estadiamento + linha + ciclo)
          </Typography>
        }
      />
    </Box>
  );
}

function SurgeryOncologyExtraFields({ form, set }: Pick<StepSurgeriesProps, 'form' | 'set'>) {
  if (!form.surgeryHasOncologyLink) return null;
  return (
    <Box
      sx={{
        mt: 2,
        border: '1px dashed rgba(147,51,234,0.4)',
        borderRadius: '12px',
        p: 2,
        backgroundColor: 'rgba(147,51,234,0.04)',
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 1.5 }}>
        Vínculo Oncológico (M3)
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Estadiamento (TNM)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.estadiamentoTNM}
            onChange={set('estadiamentoTNM')}
            placeholder="Ex: T2 N1 M0"
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <FieldLabel>Protocolo Cirúrgico</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.protocoloQuimio}
            onChange={set('protocoloQuimio')}
            placeholder="Ex: Mastectomia + esvaziamento axilar"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function StepSurgeries(props: StepSurgeriesProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 15 }}>
        Plano Cirúrgico
      </Typography>
      <Alert severity="info" sx={{ mb: 3, fontSize: 13 }}>
        Cirurgia eletiva planejada. Preencha o plano cirúrgico, a estrutura hospitalar de apoio
        (nível de auditoria, diárias, taxas) e o pré-operatório. SLA regulatório de 21 dias úteis;
        UTI exige justificativa clínica robusta.
      </Alert>

      {/* Bloco 1: Cirurgia */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          title="1. Dados da Cirurgia"
          subtitle="Tipo, procedimento principal, acessórios e vínculos."
        />
        <SurgeryGeneralFields
          form={props.form}
          set={props.set}
          handleSetSurgeryTipo={props.handleSetSurgeryTipo}
          handleSetSurgeryMainProcedure={props.handleSetSurgeryMainProcedure}
        />
        <SurgeryAcessoriosList
          form={props.form}
          handleAddSurgeryAcessorio={props.handleAddSurgeryAcessorio}
          handleRemoveSurgeryAcessorio={props.handleRemoveSurgeryAcessorio}
          handleUpdateSurgeryAcessorio={props.handleUpdateSurgeryAcessorio}
        />
        <SurgeryToggles
          form={props.form}
          handleSetSurgeryHasOpme={props.handleSetSurgeryHasOpme}
          handleSetSurgeryHasOncologyLink={props.handleSetSurgeryHasOncologyLink}
        />
        <SurgeryOncologyExtraFields form={props.form} set={props.set} />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bloco 2: Hospitalização (reuso embarcado) */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          title="2. Hospitalização"
          subtitle="Nível de auditoria, duração, procedimentos e taxas (TISS 18)."
        />
        <StepHospitalization
          embedded
          form={props.form}
          set={props.set}
          setSelect={props.setSelect}
          handleAddHospitalizationProcedimento={props.handleAddHospitalizationProcedimento}
          handleRemoveHospitalizationProcedimento={props.handleRemoveHospitalizationProcedimento}
          handleUpdateHospitalizationProcedimento={props.handleUpdateHospitalizationProcedimento}
          handleAddHospitalizationTaxa={props.handleAddHospitalizationTaxa}
          handleRemoveHospitalizationTaxa={props.handleRemoveHospitalizationTaxa}
          handleUpdateHospitalizationTaxa={props.handleUpdateHospitalizationTaxa}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bloco 3: Pré-Operatório */}
      <Box>
        <SectionHeader
          title="3. Pré-Operatório"
          subtitle="Checklist obrigatório carregado conforme tipo de cirurgia."
        />
        <Box
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            p: 2,
          }}
        >
          <PreOpSection
            preOpItens={props.form.preOpItens}
            handleAddPreOpItem={props.handleAddPreOpItem}
            handleRemovePreOpItem={props.handleRemovePreOpItem}
            handleUpdatePreOpItem={props.handleUpdatePreOpItem}
          />
        </Box>
      </Box>
    </Box>
  );
}
