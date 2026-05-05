/**
 * Outline padrão dos `<Alert>` no produto.
 *
 * Regra: TODO Alert renderizado in-page (não Snackbar/inline-form) deve ter
 * borda visível na cor correspondente à severity. Snackbars e Alerts dentro
 * de modais/drawers ficam sem borda — visual já é destacado pelo container.
 *
 * Uso:
 *   <Alert severity="warning" sx={{ borderRadius: 2, border: alertOutlines.warning }}>
 */
export const alertOutlines = {
  error: '1px solid rgba(212,24,61,0.3)',
  warning: '1px solid rgba(245,158,11,0.35)',
  info: '1px solid rgba(37,99,235,0.3)',
  success: '1px solid rgba(22,163,74,0.3)',
} as const;
