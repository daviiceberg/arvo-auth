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

interface QueueFilterBarProps {
  search: string;
  categoriaFilter: string;
  slaFilter: string;
  prestadorFilter: string;
  iaFilter: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoriaFilterChange: (value: string) => void;
  onSlaFilterChange: (value: string) => void;
  onPrestadorFilterChange: (value: string) => void;
  onIaFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function QueueFilterBar({
  search,
  categoriaFilter,
  slaFilter,
  prestadorFilter,
  iaFilter,
  hasFilters,
  onSearchChange,
  onCategoriaFilterChange,
  onSlaFilterChange,
  onPrestadorFilterChange,
  onIaFilterChange,
  onClearFilters,
}: QueueFilterBarProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.75,
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
        gap: 1.5,
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <TextField
        placeholder="Buscar (ID, nome, carteirinha...)"
        size="small"
        value={search}
        onChange={(e) => { onSearchChange(e.target.value); }}
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
          value={categoriaFilter}
          label="Categoria"
          onChange={(e) => { onCategoriaFilterChange(e.target.value); }}
        >
          <MenuItem value="Todas">Todas</MenuItem>
          <MenuItem value="Internação">Internação</MenuItem>
          <MenuItem value="Urgência/Emergência">Urgência/Emergência</MenuItem>
          <MenuItem value="Oncologia">Oncologia</MenuItem>
          <MenuItem value="Terapias Especiais">Terapias Especiais</MenuItem>
          <MenuItem value="OPME">OPME</MenuItem>
          <MenuItem value="Exames Alta Complexidade">Exames Alta Complexidade</MenuItem>
          <MenuItem value="Cirurgias Eletivas">Cirurgias Eletivas</MenuItem>
          <MenuItem value="Home Care">Home Care</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel>Situação SLA</InputLabel>
        <Select
          value={slaFilter}
          label="Situação SLA"
          onChange={(e) => { onSlaFilterChange(e.target.value); }}
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
          value={prestadorFilter}
          label="Prestador"
          onChange={(e) => { onPrestadorFilterChange(e.target.value); }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Hospital São Lucas">Hospital São Lucas</MenuItem>
          <MenuItem value="Clínica Integrar TEA">Clínica Integrar TEA</MenuItem>
          <MenuItem value="Hospital Sírio-Libanês SP">Hospital Sírio-Libanês SP</MenuItem>
          <MenuItem value="Lab Diagnostium">Lab Diagnostium</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
        <InputLabel>Sugestão IA</InputLabel>
        <Select
          value={iaFilter}
          label="Sugestão IA"
          onChange={(e) => { onIaFilterChange(e.target.value); }}
        >
          <MenuItem value="Todas">Todas</MenuItem>
          <MenuItem value="Aprovar">Aprovar</MenuItem>
          <MenuItem value="Negar">Negar</MenuItem>
          <MenuItem value="Junta Médica">Junta Médica</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="text"
        size="small"
        disabled={!hasFilters}
        onClick={onClearFilters}
        sx={{ minHeight: 36, fontSize: 12, color: 'text.secondary' }}
      >
        Limpar
      </Button>
    </Box>
  );
}
