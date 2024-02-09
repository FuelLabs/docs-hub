/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';

export function ExampleBox({
  children,
  error,
}: {
  children: ReactNode;
  error?: any;
}) {
  return (
    <Box.Stack gap="$4" css={{ mt: '$8' }}>
      <Box css={styles.root}>
        {error && <Text css={{ color: 'red' }}>{error.message}</Text>}
        {children}
      </Box>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4',
    borderRadius: '$md',
    border: '1px dashed $gray3',
    maxWidth: '90vw',
    overflowWrap: 'break-word',
    '@xl': {
      maxWidth: '55vw',
    },
    h6: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '$0',
      color: '$gray10',
      gap: '$2',

      '& .fuel_icon': {
        color: 'currentColor',
      },
    },
  }),
  alert: cssObj({
    maxWidth: '100%',
  }),
};
