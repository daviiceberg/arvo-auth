'use client'

import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { type FormData, type TerapiaProcedimento } from '../../types'

function FieldLabel({ children, validated, warning }: { children: React.ReactNode; validated?: boolean; warning?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} /> : null}
      {warning ? <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} /> : null}
    </Box>
  )
}

interface StepTherapiesProps {
  form: FormData
  setSelect: (field: keyof FormData) => (value: string) => void
  terapiaProcedimentos: TerapiaProcedimento[]
  handleAddTerapiaProc: () => void
  handleRemoveTerapiaProc: (id: string) => void
  handleUpdateTerapiaProc: (id: string, field: keyof Omit<TerapiaProcedimento, 'id'>, value: string) => void
}

export function StepTherapies({
  form, setSelect,
  terapiaProcedimentos, handleAddTerapiaProc, handleRemoveTerapiaProc, handleUpdateTerapiaProc,
}: StepTherapiesProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Sessões de Terapia</Typography>

      {/* Etapa da Autorização — nível da solicitação */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Etapa da Autorização *</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.etapaAutorizacao}
              onChange={(e) => { setSelect('etapaAutorizacao')(e.target.value); }}
              displayEmpty
            >
              <MenuItem value="" disabled><em>Selecione</em></MenuItem>
              <MenuItem value="primeira_solicitacao">Primeira Solicitação</MenuItem>
              <MenuItem value="continuidade">Continuidade / Renovação</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {form.etapaAutorizacao === 'continuidade' && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ fontSize: 13 }}>
              Renovação exige Relatório de Evolução Terapêutica emitido pelo profissional executante. Verifique o anexo na etapa Documentos.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Procedimentos */}
      {terapiaProcedimentos.map((proc, idx) => {
        const dataErro = proc.dataTermino && proc.dataInicio && proc.dataTermino <= proc.dataInicio
        return (
          <Box key={proc.id} sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'transparent', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {terapiaProcedimentos.length > 1 ? `Procedimento ${String(idx + 1)}` : 'Procedimento'}
              </Typography>
              {terapiaProcedimentos.length > 1 && (
                <IconButton size="small" color="error" onClick={() => { handleRemoveTerapiaProc(proc.id); }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Tipo de Terapia *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={proc.tipoTerapia}
                    onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'tipoTerapia', e.target.value); }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled><em>Selecione</em></MenuItem>
                    <MenuItem value="ABA / Análise do Comportamento">ABA / Análise do Comportamento</MenuItem>
                    <MenuItem value="Fisioterapia">Fisioterapia</MenuItem>
                    <MenuItem value="Fonoaudiologia">Fonoaudiologia</MenuItem>
                    <MenuItem value="Hidroterapia">Hidroterapia</MenuItem>
                    <MenuItem value="Musicoterapia">Musicoterapia</MenuItem>
                    <MenuItem value="Psicologia">Psicologia</MenuItem>
                    <MenuItem value="Equoterapia">Equoterapia</MenuItem>
                    <MenuItem value="Terapia Ocupacional">Terapia Ocupacional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Código TUSS *</FieldLabel>
                <TextField
                  fullWidth size="small"
                  placeholder="Ex: 50000470"
                  value={proc.codigoTUSS}
                  onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'codigoTUSS', e.target.value); }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Sugerido com base no tipo de terapia. Editável." placement="top">
                          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'default' }} />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Nº de Sessões *</FieldLabel>
                <TextField fullWidth size="small" type="number" value={proc.numeroSessoes} onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'numeroSessoes', e.target.value); }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Data de Início *</FieldLabel>
                <TextField fullWidth size="small" type="date" value={proc.dataInicio} onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'dataInicio', e.target.value); }} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Data de Término *</FieldLabel>
                <TextField
                  fullWidth size="small" type="date"
                  value={proc.dataTermino}
                  onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'dataTermino', e.target.value); }}
                  InputLabelProps={{ shrink: true }}
                  error={!!dataErro}
                  helperText={dataErro ? 'Deve ser posterior à data de início.' : ''}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Frequência Semanal</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={proc.frequenciaSemanal} onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'frequenciaSemanal', e.target.value); }}>
                    <MenuItem value="1x por semana">1x por semana</MenuItem>
                    <MenuItem value="2x por semana">2x por semana</MenuItem>
                    <MenuItem value="3x por semana">3x por semana</MenuItem>
                    <MenuItem value="5x por semana">5x por semana</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FieldLabel>Duração da Sessão (min)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={proc.duracaoSessao} onChange={(e) => { handleUpdateTerapiaProc(proc.id, 'duracaoSessao', e.target.value); }} />
              </Grid>
            </Grid>
          </Box>
        )
      })}

      <Tooltip title={terapiaProcedimentos.length >= 5 ? 'Máximo de 5 procedimentos por solicitação' : ''} placement="top">
        <span>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddTerapiaProc}
            disabled={terapiaProcedimentos.length >= 5}
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
            Adicionar Procedimento
          </Button>
        </span>
      </Tooltip>
    </Box>
  )
}
