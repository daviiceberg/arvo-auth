import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#902B29', dark: '#6e1f1d', contrastText: '#ffffff' },
    warning: { main: '#902B29', dark: '#6e1f1d', light: '#b03533', contrastText: '#ffffff' },
    error: { main: '#d4183d' },
    background: { default: '#FAF6F2', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#5a6070' },
    divider: 'rgba(0,0,0,0.08)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0.2 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 6, boxShadow: 'none', '&:hover': { boxShadow: 'none' } } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.07)' } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 16 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 6 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&.Mui-selected': {
            backgroundColor: '#902B29',
            color: '#ffffff',
            '& .MuiListItemIcon-root': { color: '#ffffff' },
            '& .MuiListItemText-primary': { color: '#ffffff' },
            '&:hover': { backgroundColor: '#7a2422' },
          },
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { boxShadow: 'none', borderRight: 'none' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: '#5a6070', backgroundColor: '#faf6f2' } } },
    MuiTableRow: { styleOverrides: { root: { '&:hover': { backgroundColor: 'rgba(144,43,41,0.03) !important' }, cursor: 'pointer' } } },
  },
})

export default theme
