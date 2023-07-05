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
    <Box.Stack gap="$4" css={{ mt: '$8' }}>
      <Box css={styles.root}>
        <Heading as="h6">Check it working </Heading>
        {error && <Text color="intentsError10">{error.message}</Text>}
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
    border: '1px dashed $intentsBase3',
    maxWidth: '90vw',
    overflowWrap: 'break-word',
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
  alert: cssObj({
    maxWidth: '100%',
  }),
};
