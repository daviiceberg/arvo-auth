'use client';

import { useEffect, useRef } from 'react';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { TussCodeSearchField } from '@/shared/components/code-autocomplete';
import { type OpmeValueReasonCode } from '@/types/pedido';

import { PreOpSection } from '@/modules/new-request/components/PreOpSection';
import { SectionHeader } from '@/modules/new-request/components/SectionHeader';
import { StepHospitalization } from '@/modules/new-request/components/steps/StepHospitalization';
import { StepOpme } from '@/modules/new-request/components/steps/StepOpme';
import {
  type FormData,
  type HospitalTaxItem,
  type HospitalizationProcedimento,
  type PreOpFormItem,
  type SurgeryAcessorio,
  type SurgeryTipoChoice,
} from '@/modules/new-request/types';
import {
  type AnvisaConsultResult,
  type OpmeFormMaterial,
  type OpmeFormQuotation,
} from '@/modules/new-request/types/opme';

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
  // OPME embedded (M5)
  handleAddOpmeMaterial: () => void;
  handleRemoveOpmeMaterial: (id: string) => void;
  handleUpdateOpmeMaterial: (
    id: string,
    field: keyof Omit<OpmeFormMaterial, 'id' | 'quotations'>,
    value: string,
  ) => void;
  handleAddOpmeQuotation: (materialId: string) => void;
  handleRemoveOpmeQuotation: (materialId: string, quotationId: string) => void;
  handleUpdateOpmeQuotation: (
    materialId: string,
    quotationId: string,
    field: keyof Omit<OpmeFormQuotation, 'id'>,
    value: string,
  ) => void;
  handleSelectOpmeQuotation: (materialId: string, quotationId: string) => void;
  handleSetOpmeChosenReason: (
    materialId: string,
    code: OpmeValueReasonCode | '',
    note: string,
  ) => void;
  handleConsultAnvisa: (materialId: string) => Promise<AnvisaConsultResult>;
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

export function StepSurgeries(props: StepSurgeriesProps) {
  const opmeBlockRef = useRef<HTMLDivElement | null>(null);
  const oncologyBlockRef = useRef<HTMLDivElement | null>(null);
  const previousHasOpmeRef = useRef(props.form.surgeryHasOpme);
  const previousHasOncologyRef = useRef(props.form.surgeryHasOncologyLink);

  useEffect(() => {
    if (props.form.surgeryHasOpme && !previousHasOpmeRef.current) {
      requestAnimationFrame(() => {
        opmeBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    previousHasOpmeRef.current = props.form.surgeryHasOpme;
  }, [props.form.surgeryHasOpme]);

  useEffect(() => {
    if (props.form.surgeryHasOncologyLink && !previousHasOncologyRef.current) {
      requestAnimationFrame(() => {
        oncologyBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    previousHasOncologyRef.current = props.form.surgeryHasOncologyLink;
  }, [props.form.surgeryHasOncologyLink]);

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
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bloco Oncologia (toggle no header — expande inline) */}
      <Box sx={{ mb: 1.5 }}>
        <Box
          ref={oncologyBlockRef}
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              backgroundColor: props.form.surgeryHasOncologyLink
                ? 'rgba(147,51,234,0.06)'
                : 'rgba(0,0,0,0.02)',
              borderBottom: props.form.surgeryHasOncologyLink
                ? '1px solid rgba(147,51,234,0.2)'
                : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              transition: 'background-color 200ms ease, border-color 200ms ease',
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                Esta é uma cirurgia oncológica?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
                Vincula protocolo oncológico (estadiamento, linha e ciclo) à cirurgia.
              </Typography>
            </Box>
            <Switch
              checked={props.form.surgeryHasOncologyLink}
              onChange={(e) => {
                props.handleSetSurgeryHasOncologyLink(e.target.checked);
              }}
            />
          </Box>
          <Collapse in={props.form.surgeryHasOncologyLink} timeout={350} unmountOnExit>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <FieldLabel>Estadiamento (TNM)</FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={props.form.estadiamentoTNM}
                    onChange={props.set('estadiamentoTNM')}
                    placeholder="Ex: T2 N1 M0"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FieldLabel>Protocolo Cirúrgico</FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={props.form.protocoloQuimio}
                    onChange={props.set('protocoloQuimio')}
                    placeholder="Ex: Mastectomia + esvaziamento axilar"
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* Bloco OPME (toggle no header — expande inline) */}
      <Box sx={{ mb: 4 }}>
        <Box
          ref={opmeBlockRef}
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              backgroundColor: props.form.surgeryHasOpme
                ? 'rgba(217,119,6,0.06)'
                : 'rgba(0,0,0,0.02)',
              borderBottom: props.form.surgeryHasOpme
                ? '1px solid rgba(217,119,6,0.2)'
                : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              transition: 'background-color 200ms ease, border-color 200ms ease',
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                Esta cirurgia inclui OPME?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
                Materiais especiais (próteses, órteses, implantes) com registro ANVISA e cotações
                (TISS 19).
              </Typography>
            </Box>
            <Switch
              checked={props.form.surgeryHasOpme}
              onChange={(e) => {
                props.handleSetSurgeryHasOpme(e.target.checked);
              }}
            />
          </Box>
          <Collapse in={props.form.surgeryHasOpme} timeout={350} unmountOnExit>
            <Box sx={{ p: 2.5 }}>
              <StepOpme
                embedded
                form={props.form}
                set={props.set}
                handleAddOpmeMaterial={props.handleAddOpmeMaterial}
                handleRemoveOpmeMaterial={props.handleRemoveOpmeMaterial}
                handleUpdateOpmeMaterial={props.handleUpdateOpmeMaterial}
                handleAddOpmeQuotation={props.handleAddOpmeQuotation}
                handleRemoveOpmeQuotation={props.handleRemoveOpmeQuotation}
                handleUpdateOpmeQuotation={props.handleUpdateOpmeQuotation}
                handleSelectOpmeQuotation={props.handleSelectOpmeQuotation}
                handleSetOpmeChosenReason={props.handleSetOpmeChosenReason}
                handleConsultAnvisa={props.handleConsultAnvisa}
              />
            </Box>
          </Collapse>
        </Box>
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
