'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SaveIcon from '@mui/icons-material/Save'

export default function MeuPerfilPage() {
  // Personal info state
  const [nome, setNome] = useState('Ana Paula Santos')
  const [perfil, setPerfil] = useState('Autorizador')
  const [operadora, setOperadora] = useState('Athena Saúde')

  // Security state
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }))

  const handleSavePerfil = () => {
    setSnackbar({ open: true, message: 'Perfil atualizado com sucesso!', severity: 'success' })
  }

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      setSnackbar({ open: true, message: 'As senhas não coincidem', severity: 'error' })
      return
    }
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
    setSnackbar({ open: true, message: 'Senha alterada com sucesso!', severity: 'success' })
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ fontSize: 22, mb: 0.5 }}>
          Meu Perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Gerencie suas informações pessoais e configurações de segurança
        </Typography>
      </Box>

      {/* Card 1 — Informações Pessoais */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Card header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: 'rgba(144,43,41,0.08)',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.2 }}>
                Informações Pessoais
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Seus dados de identificação no sistema
              </Typography>
            </Box>
          </Box>

          {/* Form grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
              mt: 2.5,
            }}
          >
            <TextField
              label="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="E-mail"
              value="ana.santos@athena.com.br"
              disabled
              size="small"
              fullWidth
              helperText="O e-mail não pode ser alterado"
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Perfil</InputLabel>
              <Select
                label="Perfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
              >
                <MenuItem value="Gestor">Gestor</MenuItem>
                <MenuItem value="Autorizador">Autorizador</MenuItem>
                <MenuItem value="Auditor">Auditor</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Operadora</InputLabel>
              <Select
                label="Operadora"
                value={operadora}
                onChange={(e) => setOperadora(e.target.value)}
              >
                <MenuItem value="Athena Saúde">Athena Saúde</MenuItem>
                <MenuItem value="Unimed">Unimed</MenuItem>
                <MenuItem value="SulAmérica Saúde">SulAmérica Saúde</MenuItem>
                <MenuItem value="Bradesco Saúde">Bradesco Saúde</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Save button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon sx={{ fontSize: 17 }} />}
              onClick={handleSavePerfil}
              sx={{ fontWeight: 600, px: 2.5 }}
            >
              Salvar Alterações
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Card 2 — Segurança */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Card header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: 'rgba(144,43,41,0.08)',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.2 }}>
                Segurança
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Atualize sua senha de acesso
              </Typography>
            </Box>
          </Box>

          {/* Password form grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2.5,
              mt: 2.5,
            }}
          >
            <TextField
              label="Senha Atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              size="small"
              fullWidth
              autoComplete="current-password"
            />
            <TextField
              label="Nova Senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              size="small"
              fullWidth
              autoComplete="new-password"
            />
            <TextField
              label="Confirmar Nova Senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              size="small"
              fullWidth
              autoComplete="new-password"
            />
          </Box>

          {/* Submit button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<LockOutlinedIcon sx={{ fontSize: 17 }} />}
              onClick={handleAlterarSenha}
              sx={{ fontWeight: 600, px: 2.5 }}
            >
              Alterar Senha
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
