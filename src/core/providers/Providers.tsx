'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import EmotionRegistry from '@/core/theme/EmotionRegistry';
import theme from '@/core/theme/index';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider>
      <EmotionRegistry>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </EmotionRegistry>
    </Auth0Provider>
  );
}
