'use client';

import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type FormData } from '@/modules/new-request/types';

function FieldLabel({
  children,
  validated,
  warning,
}: {
  children: React.ReactNode;
  validated?: boolean;
  warning?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#16a34a' }} /> : null}
      {warning ? <WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b' }} /> : null}
    </Box>
  );
}

interface StepOpmeProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function StepOpme({ form, setForm, set }: StepOpmeProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Materiais e OPME
      </Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Fabricante</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 70 }}>Qtd</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 100 }}>Valor</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.materiais.map((m, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField
                    size="small"
                    value={m.codigo}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        materiais: f.materiais.map((item, idx) =>
                          idx === i ? { ...item, codigo: e.target.value } : item,
                        ),
                      }));
                    }}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={m.descricao}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        materiais: f.materiais.map((item, idx) =>
                          idx === i ? { ...item, descricao: e.target.value } : item,
                        ),
                      }));
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={m.fabricante}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        materiais: f.materiais.map((item, idx) =>
                          idx === i ? { ...item, fabricante: e.target.value } : item,
                        ),
                      }));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={m.qtd}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        materiais: f.materiais.map((item, idx) =>
                          idx === i ? { ...item, qtd: e.target.value } : item,
                        ),
                      }));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={m.valor}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        materiais: f.materiais.map((item, idx) =>
                          idx === i ? { ...item, valor: e.target.value } : item,
                        ),
                      }));
                    }}
                    placeholder="R$ 0,00"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setForm((f) => ({ ...f, materiais: f.materiais.filter((_, j) => j !== i) }));
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => {
          setForm((f) => ({
            ...f,
            materiais: [
              ...f.materiais,
              { codigo: '', descricao: '', fabricante: '', qtd: '1', valor: '' },
            ],
          }));
        }}
        sx={{ mb: 3 }}
      >
        Adicionar Material
      </Button>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Registro ANVISA</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.registroAnvisa}
            onChange={set('registroAnvisa')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Fabricante do Material</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.fabricanteMaterial}
            onChange={set('fabricanteMaterial')}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Justificativa Técnica para Marca</FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            value={form.justificativaTecnica}
            onChange={set('justificativaTecnica')}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5, fontSize: 13 }}>
            3 Cotações de Preço
          </Typography>
          {form.cotacoes.map((c, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
              <TextField
                size="small"
                label={`Fornecedor ${String(i + 1)}`}
                value={c.fornecedor}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    cotacoes: f.cotacoes.map((item, idx) =>
                      idx === i ? { ...item, fornecedor: e.target.value } : item,
                    ),
                  }));
                }}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Valor (R$)"
                value={c.valor}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    cotacoes: f.cotacoes.map((item, idx) =>
                      idx === i ? { ...item, valor: e.target.value } : item,
                    ),
                  }));
                }}
                sx={{ width: 140 }}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
