/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Link,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { capitalize } from '../lib/str';

import { Heading } from './Heading';


export function ExampleBox({
  children,
  error,
}: {
  children: ReactNode;
  error?: any;
}) {
  
  return (
    <Stack gap="$4" css={{ mt: '$8' }}>
      {/* {errorMsg && (
        <Alert css={styles.alert} status="error">
          <Alert.Description>{capitalize(errorMsg)}</Alert.Description>
        </Alert>
      )} */}
      <Box css={styles.root}>
        <Heading as="h6">
          Check it working{' '}
          {/* {notDetected && !error && (
            <Tooltip content={downloadContent} side="left">
              <Tag size="xs" color="amber" variant="ghost" leftIcon="Warning">
                Not working
              </Tag>
            </Tooltip>
          )}
          {error && !notDetected && (
            <Tag size="xs" color="red" variant="ghost" leftIcon="X">
              Failed
            </Tag>
          )}
          {!notDetected && !error && (
            <Tag size="xs" color="accent" variant="ghost">
              Wallet Detected
            </Tag>
          )} */}
        </Heading>
        {error && <Text color="red10">{error.message}</Text>}
        {children}
      </Box>
    </Stack>
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
