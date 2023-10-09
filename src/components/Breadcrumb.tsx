import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import NextLink from 'next/link';
import type { DocType, SidebarLinkItem } from '~/src/types';

import { capitalize } from '../lib/str';

type BreadcrumbProps = {
  doc: DocType;
  navLinks: SidebarLinkItem[];
};

type LabelProps = {
  label: string;
};

function Label({ label }: LabelProps) {
  return <Text as="span">{capitalize(label.replaceAll(/[_-]/g, ' '))}</Text>;
}

export function Breadcrumb({ doc, navLinks }: BreadcrumbProps) {
  const split = doc.slug.split('/');
  return (
    <Box.Flex css={styles.root}>
      {split.map((label, index) => {
        let link;
        if (index === 0) link = '/';
        if (index === 1) link = `/docs/${split[1]}`;
        if (index === 2 && split.length > 3) {
          const category = split[2];
          const linkItem = navLinks.find((link) => {
            return link.label && link.label.toLowerCase() === category;
          });
          link = linkItem && linkItem.submenu ? linkItem.submenu[0].slug : null;
        }

        if (link) {
          return (
            <Box key={`${index}-${label}`}>
              <NextLink href={link}>
                <Label label={label} />
              </NextLink>
              {index < split.length - 1 && ' / '}
            </Box>
          );
        }

        return (
          <div key={`${index}-${label}`}>
            <Label label={label} />
            {index < split.length - 1 && ' / '}
          </div>
        );
      })}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    alignItems: 'center',
    gap: '$2',

    span: {
      color: '$intentsBase11',
      fontSize: '$sm',
    },
    '& > span:last-of-type': {
      color: '$intentsBase9',
    },
  }),
};
