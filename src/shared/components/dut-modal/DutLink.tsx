'use client';

import Link from '@mui/material/Link';

const DUT_NUMBER_REGEX = /DUT\s+(\d+)/i;

interface DutLinkProps {
  text: string;
  onDutClick: (dutNumber: number) => void;
}

export default function DutLink({ text, onDutClick }: DutLinkProps) {
  const match = DUT_NUMBER_REGEX.exec(text);
  const dutNumber = match ? Number(match[1]) : null;

  if (!dutNumber) {
    return <>{text}</>;
  }

  return (
    <Link
      component="button"
      variant="caption"
      onClick={() => {
        onDutClick(dutNumber);
      }}
      sx={{
        fontSize: 12,
        color: 'primary.main',
        textAlign: 'left',
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {text}
    </Link>
  );
}
