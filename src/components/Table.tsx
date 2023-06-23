/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

export function Table(props: any) {
  return <Box as="table" {...props} css={styles.root} />;
}

const styles = {
  root: cssObj({
    py: '$3',
    px: '$4',
    mb: '$6',
    background: '$intentsBase1',
    borderRadius: '$lg',
    border: '1px solid $intentsBase3',
  }),
};
