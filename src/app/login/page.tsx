'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FAF6F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, p: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              Arvo Auth
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Athena Saúde
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700 }}>
            Bem-vindo de volta
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Acesse o painel de autorização
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ 'aria-label': 'E-mail' }}
            />
            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ 'aria-label': 'Senha' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              aria-label="Entrar no sistema"
              sx={{ minHeight: 48, fontSize: 16 }}
            >
              Entrar
            </Button>
          </Box>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            Acesso restrito a operadores autorizados
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
