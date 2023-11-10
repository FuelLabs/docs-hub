/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

export function Table(props: any) {
  return (
    <Box css={styles.root}>
      <Box as="table" {...props} css={styles.table} />
    </Box>
  );
}

export function TD(props: any) {
  return (
    <Box as="td" {...props} css={styles.td}>
      <Box as="div" css={styles.tdContainer}>
        {props.children}
      </Box>
    </Box>
  );
}

export function TH(props: any) {
  return (
    <Box as="th" {...props} css={styles.td}>
      <Box as="div" css={styles.thContainer}>
        {props.children}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    maxWidth: '100%',
    wordWrap: 'anywhere',
  }),
  table: cssObj({
    mb: '$6',
    'html[class="fuel_light-theme"] &': {
      color: 'black',
    },
    tableLayout: 'fixed',
    borderRadius: '$sm',
    boxSizing: 'border-box',
    border: '1px solid $border',
    borderSpacing: '0px',
    width: '100%',
    overflow: 'hidden',
    td: {
      borderTop: '1px solid $border',
      py: '$1',
      px: '$2',
    },
    thead: {
      tr: {
        'html[class="fuel_light-theme"] &': {
          background: '$intentsBase8 !important',
        },
        background: '$intentsBase4 !important',
      },
      th: {
        py: '$1',
        px: '$2',
        fontSize: '16px',
      },
    },
    'tr:nth-child(even)': {
      'html[class="fuel_light-theme"] &': {
        background: '$intentsBase3',
      },
      background: 'rgb(26, 26, 26)',
    },
    'tr:nth-child(odd)': {
      'html[class="fuel_light-theme"] &': {
        background: '$transparent',
      },
      background: 'rgb(16, 16, 16)',
    },
  }),
  td: cssObj({
    py: '$2',
    px: '$3',
    wordWrap: 'break-word',
  }),
  tdContainer: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }),
  thContainer: cssObj({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '$2',
    justifyContent: 'space-between',
    height: '100%',
  }),
};
