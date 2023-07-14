/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

export function Code(props: any) {
  return <Box as="code" css={styles.root} {...props} />;
}

const styles = {
  root: cssObj({
    padding: '$0 $1',
    borderRadius: '$md',
    fontFamily: 'monospace',
    background: '$intentsBase3',
    lineHeight: 1.3,
  }),
};
