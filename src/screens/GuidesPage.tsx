import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';
import { useState } from 'react';
import { TAG_CATEGORIES } from '~/docs/guides/docs/categories';

import { Card } from '../components/Card';
import { Heading } from '../components/Heading';
import type { GuideInfo } from '../pages/guides';

interface GuidesPageProps {
  guides: { [key: string]: GuideInfo };
  isLatest: boolean;
}

export function GuidesPage({ guides }: GuidesPageProps) {
  const [active, setActive] = useState<string>('all');

  return (
    <Box.Stack css={styles.root}>
      <Heading as="h1" data-rank="h1" id="fuel-guides">
        Guides
      </Heading>
      <Box.Flex gap={'$3'} wrap={'wrap'} css={styles.categoryContainer}>
        <Button
          data-active={active === 'all'}
          onClick={() => setActive('all')}
          variant={'outlined'}
          intent={'base'}
          css={styles.category}
          size={'sm'}
        >
          All Categories
        </Button>
        <Box.Centered>
          <Box css={styles.separator}>&nbsp;</Box>
        </Box.Centered>
        {TAG_CATEGORIES.map((category) => (
          <Button
            key={category}
            data-active={active === category}
            onClick={() => setActive(category)}
            variant={'outlined'}
            intent={'base'}
            css={styles.category}
            size={'sm'}
          >
            {category}
          </Button>
        ))}
      </Box.Flex>
      <Box.Stack gap="$8">
        {Object.keys(guides).map((guideName) => {
          const guideInfo = guides[guideName];
          if (active === 'all' || guideInfo.tags.includes(active)) {
            return (
              <Card
                key={guideName}
                guideInfo={guideInfo}
                cardName={guideName}
              />
            );
          }
        })}
      </Box.Stack>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    padding: '$2 $10 $10 $10',
    '@md': {
      padding: '$4 $40 $20 $40',
    },
  }),
  separator: cssObj({
    background: '$semanticLinkPrimaryColor',
    height: '20px',
    width: '1.5px',
  }),
  categoryContainer: cssObj({
    marginBottom: '$10',
  }),
  category: cssObj({
    '&:hover': {
      border: '1px solid $semanticLinkPrimaryColor !important',
    },
    '&[data-active="true"]': {
      border: '1px solid $semanticLinkPrimaryColor',
    },
  }),
};
