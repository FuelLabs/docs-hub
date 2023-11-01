import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import NextLink from 'next/link';
import type { DocType, SidebarLinkItem } from '~/src/types';

import { capitalize } from '../lib/str';

type BreadcrumbProps = {
  doc: DocType;
  navLinks: SidebarLinkItem[];
  isLatest: boolean;
};

type LabelProps = {
  label: string;
};

function Label({ label }: LabelProps) {
  return <Text as="span">{capitalize(label.replaceAll(/[_-]/g, ' '))}</Text>;
}

export function Breadcrumb({ doc, navLinks, isLatest }: BreadcrumbProps) {
  const split = doc.slug.split('/');
  return (
    <Box.Flex css={styles.root}>
      {split.map((label, index) => {
        if (!isLatest || index !== 1) {
          let link;
          const num = isLatest ? 3 : 2;
          if (index === 0) link = '/';
          if (index === num - 1)
            link = `/${split[0]}${isLatest ? '/latest' : ''}/${split[num - 1]}`;
          if (index === num && split.length > num + 1) {
            const category = split[num];
            const linkItem = navLinks.find((link) => {
              return link.label && link.label.toLowerCase() === category;
            });
            link =
              linkItem && linkItem.submenu ? linkItem.submenu[0].slug : null;
          }

          if (link) {
            return (
              <Box css={styles.label} key={`${index}-${label}`}>
                <NextLink href={link}>
                  <Label label={label} />
                </NextLink>
                {index < split.length - 1 && ' / '}
              </Box>
            );
          }

          return (
            <Box key={`${index}-${label}`}>
              <Label label={label} />
              {index < split.length - 1 && ' / '}
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
