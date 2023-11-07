import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import NextLink from 'next/link';

import { useDocContext } from '../hooks/useDocContext';
import { capitalize } from '../lib/str';

type LabelProps = {
  label: string;
};

function Label({ label }: LabelProps) {
  return <Text as="span">{capitalize(label.replaceAll(/[_-]/g, ' '))}</Text>;
}

export function Breadcrumb() {
  const ctx = useDocContext();
  const { docLink } = ctx;
  const breadcrumbs = docLink.breadcrumbs;

  return (
    <Box.Flex wrap={'wrap'} css={styles.root}>
      {breadcrumbs &&
        breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.link) {
            return (
              <Box css={styles.label} key={`${breadcrumb.label}`}>
                <NextLink href={breadcrumb.link}>
                  <Label label={breadcrumb.label} />
                </NextLink>
                {index < breadcrumbs.length - 1 && ' / '}
              </Box>
            );
          } else {
            return (
              <Box key={`${index}-${breadcrumb.label}`}>
                <Label label={breadcrumb.label} />
                {index < breadcrumbs.length - 1 && ' / '}
              </Box>
            );
          }
        })}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    alignItems: 'center',
    mt: '$4',
    gap: '$2',
    '@lg': {
      display: 'none',
    },

    span: {
      color: '$intentsBase11',
      fontSize: '$sm',
    },
    '& > span:last-of-type': {
      color: '$intentsBase9',
    },
  }),
  label: cssObj({
    'a:hover': {
      textDecoration: 'none !important',
    },
    '.fuel_Text': {
      '&:hover': {
        color: '$semanticLinkPrimaryColor !important',
      },
    },
  }),
};
