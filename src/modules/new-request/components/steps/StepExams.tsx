'use client';

import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type GuiaProcedure } from '@/types/procedure-codes';

import { type FormData } from '@/modules/new-request/types';

import { ProceduresStepSection } from './ProceduresStepSection';

interface StepExamsProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepExams({
  form,
  setForm,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepExamsProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Exames Solicitados
      </Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 80 }}>Qtd</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.exames.map((ex, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField
                    size="small"
                    value={ex.codigoTUSS}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        exames: f.exames.map((item, idx) =>
                          idx === i ? { ...item, codigoTUSS: e.target.value } : item,
                        ),
                      }));
                    }}
                    sx={{ width: 110 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={ex.descricao}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        exames: f.exames.map((item, idx) =>
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
                    value={ex.tipo}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        exames: f.exames.map((item, idx) =>
                          idx === i ? { ...item, tipo: e.target.value } : item,
                        ),
                      }));
                    }}
                    placeholder="Lab, Imagem..."
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={ex.qtd}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        exames: f.exames.map((item, idx) =>
                          idx === i ? { ...item, qtd: e.target.value } : item,
                        ),
                      }));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setForm((f) => ({ ...f, exames: f.exames.filter((_, j) => j !== i) }));
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
            exames: [...f.exames, { codigoTUSS: '', descricao: '', tipo: '', qtd: '1' }],
          }));
        }}
      >
        Adicionar Exame
      </Button>

      <ProceduresStepSection
        guiaProcedures={guiaProcedures}
        onGuiaProceduresChange={onGuiaProceduresChange}
        showQuantity
      />
    </Box>
  );
}
