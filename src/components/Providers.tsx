'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import EmotionRegistry from '@/theme/EmotionRegistry'
import theme from '@/theme/index'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  )
}
