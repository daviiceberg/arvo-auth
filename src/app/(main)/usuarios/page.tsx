'use client';
import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { defaultPermissions, mockUsers, roleLabels } from '@/data/usuarios';
import {
  type SystemUser,
  type UserPermissions,
  type UserRole,
  type UserStatus,
} from '@/types/usuario';

// ── Permission row (extracted from UserDialog to avoid creating components during render) ──
function PermRow({
  label,
  k,
  perms,
  onToggle,
}: {
  label: string;
  k: keyof UserPermissions;
  perms: UserPermissions;
  onToggle: (k: keyof UserPermissions) => void;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="body2" sx={{ fontSize: 13 }}>
        {label}
      </Typography>
      <Switch
        size="small"
        checked={perms[k]}
        onChange={() => {
          onToggle(k);
        }}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': { color: '#902B29' },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#902B29' },
        }}
      />
    </Box>
  );
}

// ── Role chip ─────────────────────────────────────────────────────────
const roleColors: Record<UserRole, { bg: string; color: string }> = {
  gestor: { bg: 'rgba(144,43,41,0.1)', color: '#902B29' },
  autorizador: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  auditor: { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
};

function RoleChip({ role }: { role: UserRole }) {
  const { bg, color } = roleColors[role];
  return (
    <Chip
      label={roleLabels[role]}
      size="small"
      sx={{ backgroundColor: bg, color, fontSize: 12, fontWeight: 700, height: 22 }}
    />
  );
}

function StatusChip({ status }: { status: UserStatus }) {
  return (
    <Chip
      label={status === 'ativo' ? 'Ativo' : 'Inativo'}
      size="small"
      sx={{
        backgroundColor: status === 'ativo' ? 'rgba(22,163,74,0.1)' : 'rgba(107,114,128,0.1)',
        color: status === 'ativo' ? '#16a34a' : '#6b7280',
        fontSize: 12,
        fontWeight: 700,
        height: 22,
      }}
    />
  );
}

function initials(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// ── Password validation (pure function) ──────────────────────────────
function validatePassword(password: string, isEditing: boolean): string {
  if (!isEditing && password.length === 0) return 'Senha é obrigatória';
  if (password.length > 0 && password.length < 8) return 'Mínimo 8 caracteres';
  if (password.length > 0 && !/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password))
    return 'Deve conter letras e números';
  return '';
}

// ── Password field (isolated to reduce UserDialog complexity) ────────
interface PasswordFieldProps {
  isEditing: boolean;
  senha: string;
  setSenha: (value: string) => void;
  senhaErro: string;
  onValidate: (value: string) => boolean;
}

function PasswordField({ isEditing, senha, setSenha, senhaErro, onValidate }: PasswordFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      label={isEditing ? 'Nova Senha' : 'Senha *'}
      type="password"
      value={senha}
      onChange={(e) => {
        setSenha(e.target.value);
        if (e.target.value) onValidate(e.target.value);
      }}
      error={!!senhaErro}
      helperText={senhaErro || (isEditing && !senha ? 'Deixe em branco para manter a atual' : '')}
      required={!isEditing}
    />
  );
}

// ── User Dialog ───────────────────────────────────────────────────────
interface DialogProps {
  open: boolean;
  user: SystemUser | null;
  onClose: () => void;
  onSave: (data: Partial<SystemUser>) => void;
}

function UserDialog({ open, user, onClose, onSave }: DialogProps) {
  const isEditing = user !== null;
  const [nome, setNome] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'autorizador');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'ativo');
  const [perms, setPerms] = useState(user?.permissions ?? { ...defaultPermissions.autorizador });
  const [senhaErro, setSenhaErro] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPerms({ ...defaultPermissions[newRole] });
  };

  const togglePerm = (key: keyof UserPermissions) => {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  };

  const validateSenha = (s: string): boolean => {
    const error = validatePassword(s, isEditing);
    setSenhaErro(error);
    return error === '';
  };

  const handleSubmit = () => {
    if (!nome || !email) return;
    if (!isEditing && !validateSenha(senha)) return;
    if (isEditing && senha && !validateSenha(senha)) return;
    onSave({ name: nome, email, role, status, permissions: perms });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={700}>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Fechar dialog">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        {/* Informações básicas */}
        <Typography
          variant="caption"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#902B29',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            mb: 1.5,
          }}
        >
          Informações Básicas
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nome completo *"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="E-mail *"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PasswordField
              isEditing={isEditing}
              senha={senha}
              setSenha={setSenha}
              senhaErro={senhaErro}
              onValidate={validateSenha}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Perfil *</InputLabel>
              <Select
                value={role}
                label="Perfil *"
                onChange={(e) => {
                  handleRoleChange(e.target.value as UserRole);
                }}
              >
                <MenuItem value="gestor">Gestor</MenuItem>
                <MenuItem value="autorizador">Autorizador</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status *</InputLabel>
              <Select
                value={status}
                label="Status *"
                onChange={(e) => {
                  setStatus(e.target.value as UserStatus);
                }}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Permissões */}
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="caption"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: '#902B29',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            mb: 1,
          }}
        >
          Permissões — {roleLabels[role]}
        </Typography>
        <Box sx={{ backgroundColor: '#faf6f2', borderRadius: 2, px: 2, py: 0.5 }}>
          <PermRow
            label="Pode aprovar solicitações"
            k="canApprove"
            perms={perms}
            onToggle={togglePerm}
          />
          <Divider />
          <PermRow
            label="Pode negar solicitações"
            k="canDeny"
            perms={perms}
            onToggle={togglePerm}
          />
          <Divider />
          <PermRow
            label="Pode visualizar relatórios"
            k="canViewReports"
            perms={perms}
            onToggle={togglePerm}
          />
          <Divider />
          <PermRow
            label="Pode visualizar histórico"
            k="canViewHistory"
            perms={perms}
            onToggle={togglePerm}
          />
          <Divider />
          <PermRow
            label="Pode criar e gerenciar usuários"
            k="canCreateUsers"
            perms={perms}
            onToggle={togglePerm}
          />
          <Divider />
          <PermRow
            label="Pode configurar o sistema"
            k="canConfigureSystem"
            perms={perms}
            onToggle={togglePerm}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
export default function UsuariosPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Todos' | UserRole>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | UserStatus>('Todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<SystemUser | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'Todos' || u.role === roleFilter;
    const matchStatus = statusFilter === 'Todos' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const hasFilters = search !== '' || roleFilter !== 'Todos' || statusFilter !== 'Todos';

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ativo' ? 'inativo' : 'ativo' } : u,
      ),
    );
  };

  const handleSave = (data: Partial<SystemUser>) => {
    if (selected) {
      setUsers((prev) => prev.map((u) => (u.id === selected.id ? { ...u, ...data } : u)));
    } else {
      if (!data.name || !data.email || !data.role || !data.status || !data.permissions) return;
      const { name, email, role, status, permissions } = data;
      setUsers((prev) => [
        ...prev,
        {
          id: `u-${String(Date.now())}`,
          name,
          email,
          role,
          status,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          permissions,
        },
      ]);
    }
    setDialogOpen(false);
    setSelected(null);
  };

  const openCreate = () => {
    setSelected(null);
    setDialogOpen(true);
  };
  const openEdit = (u: SystemUser) => {
    setSelected(u);
    setDialogOpen(true);
  };

  // Summary counts
  const ativos = users.filter((u) => u.status === 'ativo').length;
  const gestores = users.filter((u) => u.role === 'gestor').length;
  const autorizadores = users.filter((u) => u.role === 'autorizador').length;
  const auditores = users.filter((u) => u.role === 'auditor').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Usuários
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
            Administração de acessos, perfis e permissões do sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ mt: 0.5, minHeight: 44 }}
        >
          Novo Usuário
        </Button>
      </Box>

      {/* KPI strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total de Usuários', value: users.length },
          { label: 'Usuários Ativos', value: ativos, color: '#16a34a' },
          { label: 'Gestores', value: gestores, color: '#902B29' },
          { label: 'Autorizadores', value: autorizadores, color: '#2563eb' },
          { label: 'Auditores', value: auditores, color: '#475569' },
        ].map((k) => (
          <Card key={k.label} sx={{ flex: 1, minWidth: 120 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                  fontWeight: 600,
                  display: 'block',
                  mb: 0.75,
                }}
              >
                {k.label}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: 26,
                  lineHeight: 1,
                  color: k.color ?? 'text.primary',
                }}
              >
                {k.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              sx={{ flex: 2, minWidth: 220 }}
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
              <InputLabel>Perfil</InputLabel>
              <Select
                value={roleFilter}
                label="Perfil"
                onChange={(e) => {
                  setRoleFilter(e.target.value as typeof roleFilter);
                }}
              >
                <MenuItem value="Todos">Todos os perfis</MenuItem>
                <MenuItem value="gestor">Gestor</MenuItem>
                <MenuItem value="autorizador">Autorizador</MenuItem>
                <MenuItem value="auditor">Auditor</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter);
                }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
            {hasFilters ? (
              <Button
                size="small"
                startIcon={<FilterListOffIcon />}
                color="inherit"
                sx={{ fontSize: 12 }}
                onClick={() => {
                  setSearch('');
                  setRoleFilter('Todos');
                  setStatusFilter('Todos');
                }}
              >
                Limpar filtros
              </Button>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  color: 'text.secondary',
                },
              }}
            >
              <TableCell>Usuário</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Último Acesso</TableCell>
              <TableCell>Criado em</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow
                  key={u.id}
                  sx={{
                    cursor: 'default',
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.03)' },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 12,
                          fontWeight: 700,
                          bgcolor: roleColors[u.role].bg,
                          color: roleColors[u.role].color,
                        }}
                      >
                        {initials(u.name)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                        {u.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RoleChip role={u.role} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={u.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {u.lastAccess ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {u.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                        onClick={() => {
                          openEdit(u);
                        }}
                        sx={{ fontSize: 12, py: 0.25, px: 1.25, minHeight: 28 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<PowerSettingsNewIcon sx={{ fontSize: 14 }} />}
                        onClick={() => {
                          handleToggleStatus(u.id);
                        }}
                        color={u.status === 'ativo' ? 'error' : 'success'}
                        sx={{ fontSize: 12, py: 0.25, px: 1.25, minHeight: 28 }}
                      >
                        {u.status === 'ativo' ? 'Inativar' : 'Ativar'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <UserDialog
        key={`${String(dialogOpen)}-${selected?.id ?? 'new'}`}
        open={dialogOpen}
        user={selected}
        onClose={() => {
          setDialogOpen(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
}
