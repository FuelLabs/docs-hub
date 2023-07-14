/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { Heading } from './Heading';

export function ExampleBox({
  children,
  error,
}: {
  children: ReactNode;
  error?: any;
}) {
  return (
    <Box.Stack gap="$2" css={styles.root}>
      <Heading as="h6">Check it working </Heading>
      <Box css={styles.content}>
        {error && <Text color="intentsError10">{error.message}</Text>}
        {children}
      </Box>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    mt: '$8',

    h6: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '$0',
      color: '$intentsBase10',
      gap: '$2',

      '& .fuel_icon': {
        color: 'currentColor',
      },
    },
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    padding: '$4',
    bg: '$overlayBg',
    borderRadius: '$md',
    border: '1px solid $border',
    maxWidth: '90vw',
    overflowWrap: 'break-word',
  }),
  alert: cssObj({
    maxWidth: '100%',
  }),
};
