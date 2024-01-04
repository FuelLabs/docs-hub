import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import type { ReactNode } from 'react';

export function QuickstartCallout({ children }: { children: ReactNode }) {
  return (
    <Box css={styles.container}>
      <Box.Flex gap={'$2'}>
        <Icon icon={'Bulb'} color={'indigo10'} size={42} />
        Want to skip this guide and just get started? Try our new scaffold CLI
        tool to generate a full-stack counter dApp in seconds:
      </Box.Flex>
      {children}
    </Box>
  );
}

const styles = {
  container: cssObj({
    border: '2px solid $indigo10',
    borderRadius: '$md',
    padding: '$4',
    'html[class="fuel_light-theme"] &': {
      background: '$indigo3',
      color: 'black',
    },
  }),
};
