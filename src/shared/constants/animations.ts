export const SPIN_KEYFRAMES = {
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;

export const SPIN_ANIMATION = 'spin 1.5s linear infinite';
