'use client';

import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { CATEGORIES_ORDER } from '@/shared/constants';

interface QueueFilterBarProps {
  search: string;
  slaFilter: string;
  providerFilter: string;
  stageFilter: string;
  categoryFilter: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onSlaFilterChange: (value: string) => void;
  onProviderFilterChange: (value: string) => void;
  onStageFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function QueueFilterBar({
  search,
  slaFilter,
  providerFilter,
  stageFilter,
  categoryFilter,
  hasFilters,
  onSearchChange,
  onSlaFilterChange,
  onProviderFilterChange,
  onStageFilterChange,
  onCategoryFilterChange,
  onClearFilters,
}: QueueFilterBarProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.75,
        display: 'grid',
        gridTemplateColumns: hasFilters ? '2fr 1fr 1fr 1fr 1fr auto' : '2fr 1fr 1fr 1fr 1fr',
        gap: 1.5,
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <TextField
        placeholder="Buscar (ID, nome, carteirinha...)"
        size="small"
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-label': 'Buscar na fila' },
        }}
      />
      <FormControl size="small" fullWidth>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={categoryFilter}
          label="Categoria"
          onChange={(e) => {
            onCategoryFilterChange(e.target.value);
          }}
        >
          <MenuItem value="Todas">Todas</MenuItem>
          {CATEGORIES_ORDER.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel>Situação SLA</InputLabel>
        <Select
          value={slaFilter}
          label="Situação SLA"
          onChange={(e) => {
            onSlaFilterChange(e.target.value);
          }}
        >
          <MenuItem value="Todas">Todas</MenuItem>
          <MenuItem value="No prazo">No prazo</MenuItem>
          <MenuItem value="Atenção">Atenção</MenuItem>
          <MenuItem value="Violado">Violado</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel>Prestador</InputLabel>
        <Select
          value={providerFilter}
          label="Prestador"
          onChange={(e) => {
            onProviderFilterChange(e.target.value);
          }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Clínica Integrar TEA">Clínica Integrar TEA</MenuItem>
          <MenuItem value="Instituto ABA Brasil">Instituto ABA Brasil</MenuItem>
          <MenuItem value="Centro de Psicologia Infantil">Centro de Psicologia Infantil</MenuItem>
          <MenuItem value="AMA-SP">AMA-SP</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel>Etapa</InputLabel>
        <Select
          value={stageFilter}
          label="Etapa"
          onChange={(e) => {
            onStageFilterChange(e.target.value);
          }}
        >
          <MenuItem value="Todas">Todas</MenuItem>
          <MenuItem value="Aguardando análise">Aguardando análise</MenuItem>
          <MenuItem value="IA Reprocessando">IA Reprocessando</MenuItem>
          <MenuItem value="Pendência aberta">Pendência aberta</MenuItem>
          <MenuItem value="Aguardando junta">Aguardando junta</MenuItem>
          <MenuItem value="Aguardando reanálise">Aguardando reanálise</MenuItem>
        </Select>
      </FormControl>
      {hasFilters ? (
        <Button
          variant="text"
          size="small"
          onClick={onClearFilters}
          sx={{ minHeight: 36, fontSize: 12, color: 'text.secondary' }}
        >
          Limpar
        </Button>
      ) : null}
    </Box>
  );
}
