'use client';

import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { type OriginFilter, type ActionFilter, type DivergenceFilter } from '../types';

interface HistoryListFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  originFilter: OriginFilter;
  onOriginFilterChange: (value: OriginFilter) => void;
  actionFilter: ActionFilter;
  onActionFilterChange: (value: ActionFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  divergenceFilter: DivergenceFilter;
  onDivergenceFilterChange: (value: DivergenceFilter) => void;
  categories: string[];
  hasFilters: boolean;
  onClearFilters: () => void;
  onResetPage: () => void;
}

export default function HistoryListFilterBar({
  search,
  onSearchChange,
  originFilter,
  onOriginFilterChange,
  actionFilter,
  onActionFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  divergenceFilter,
  onDivergenceFilterChange,
  categories,
  hasFilters,
  onClearFilters,
  onResetPage,
}: HistoryListFilterBarProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Buscar por ID, beneficiário, procedimento ou analista..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onResetPage();
            }}
            sx={{ flex: 2, minWidth: 240 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Origem</InputLabel>
            <Select
              value={originFilter}
              label="Origem"
              onChange={(e) => {
                onOriginFilterChange(e.target.value as OriginFilter);
                onResetPage();
              }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="ia_automatica">IA Automática</MenuItem>
              <MenuItem value="analista">Analista</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Decisão</InputLabel>
            <Select
              value={actionFilter}
              label="Decisão"
              onChange={(e) => {
                onActionFilterChange(e.target.value as ActionFilter);
                onResetPage();
              }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="Aprovado">Aprovado</MenuItem>
              <MenuItem value="Negado">Negado</MenuItem>
              <MenuItem value="Aprovado Parcial">Aprovado Parcialmente</MenuItem>
              <MenuItem value="Devolutiva">Devolutiva</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoryFilter}
              label="Categoria"
              onChange={(e) => {
                onCategoryFilterChange(e.target.value);
                onResetPage();
              }}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Divergência IA</InputLabel>
            <Select
              value={divergenceFilter}
              label="Divergência IA"
              onChange={(e) => {
                onDivergenceFilterChange(e.target.value as DivergenceFilter);
                onResetPage();
              }}
            >
              <MenuItem value="Todas">Todas</MenuItem>
              <MenuItem value="divergiu">Apenas divergências</MenuItem>
            </Select>
          </FormControl>
          {hasFilters ? (
            <Button
              size="small"
              startIcon={<FilterListOffIcon />}
              onClick={onClearFilters}
              color="inherit"
              sx={{ fontSize: 12 }}
            >
              Limpar filtros
            </Button>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}
