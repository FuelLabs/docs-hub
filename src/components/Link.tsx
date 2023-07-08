/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LinkProps } from '@fuel-ui/react';
import { Box, Link as FuelLink } from '@fuel-ui/react';
import NextLink from 'next/link';

export function Link(props: LinkProps) {
  return props.href?.startsWith('http') ? (
    <FuelLink {...props} isExternal css={{ color: '$textLink !important' }} />
  ) : (
    <Box
      as={NextLink}
      css={{ color: '$textLink !important' }}
      {...(props as any)}
    />
  );
}
