'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import QueryProvider from '@/core/providers/QueryProvider';
import EmotionRegistry from '@/core/theme/EmotionRegistry';
import theme from '@/core/theme/index';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </EmotionRegistry>
  );
}
