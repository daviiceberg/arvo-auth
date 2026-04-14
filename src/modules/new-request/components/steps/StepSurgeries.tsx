'use client';

import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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

interface StepSurgeriesProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepSurgeries({
  form,
  setForm,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepSurgeriesProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Procedimentos Cirúrgicos
      </Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 80 }}>Qtd</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.procedimentos.map((p, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField
                    size="small"
                    value={p.codigoTUSS}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        procedimentos: f.procedimentos.map((item, idx) =>
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
                    value={p.descricao}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        procedimentos: f.procedimentos.map((item, idx) =>
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
                    type="number"
                    value={p.qtd}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        procedimentos: f.procedimentos.map((item, idx) =>
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
                      setForm((f) => ({
                        ...f,
                        procedimentos: f.procedimentos.filter((_, j) => j !== i),
                      }));
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
            procedimentos: [...f.procedimentos, { codigoTUSS: '', descricao: '', qtd: '1' }],
          }));
        }}
      >
        Adicionar Procedimento
      </Button>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Materiais e OPME
      </Typography>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#faf6f2' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Código TUSS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Fabricante</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 70 }}>Qtd</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 11, width: 100 }}>Valor Unit.</TableCell>
              <TableCell sx={{ width: 48 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.opme.map((o, i) => (
              <TableRow key={i}>
                <TableCell>
                  <TextField
                    size="small"
                    value={o.codigoTUSS}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        opme: f.opme.map((item, idx) =>
                          idx === i ? { ...item, codigoTUSS: e.target.value } : item,
                        ),
                      }));
                    }}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={o.descricao}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        opme: f.opme.map((item, idx) =>
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
                    value={o.fabricante}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        opme: f.opme.map((item, idx) =>
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
                    value={o.qtd}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        opme: f.opme.map((item, idx) =>
                          idx === i ? { ...item, qtd: e.target.value } : item,
                        ),
                      }));
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={o.valorUnit}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        opme: f.opme.map((item, idx) =>
                          idx === i ? { ...item, valorUnit: e.target.value } : item,
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
                      setForm((f) => ({ ...f, opme: f.opme.filter((_, j) => j !== i) }));
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
            opme: [
              ...f.opme,
              { codigoTUSS: '', descricao: '', fabricante: '', qtd: '1', valorUnit: '' },
            ],
          }));
        }}
      >
        Adicionar Material / OPME
      </Button>

      <ProceduresStepSection
        guiaProcedures={guiaProcedures}
        onGuiaProceduresChange={onGuiaProceduresChange}
        showPeriod
        showQuantity
      />
    </Box>
  );
}
