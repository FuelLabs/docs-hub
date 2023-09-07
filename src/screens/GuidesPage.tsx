import { cssObj } from '@fuel-ui/css';
import {
  Link as FuelLink,
  Box,
  Badge,
  Text,
  Card,
  Button,
} from '@fuel-ui/react';
import { useState } from 'react';
import { TAG_CATEGORIES } from '~/docs/guides/docs/categories';

import { Heading } from '../components/Heading';
import type { GuideInfo } from '../pages/guides';

interface GuidesPageProps {
  guides: { [key: string]: GuideInfo };
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
      <Box.Stack>
        {Object.keys(guides).map((guideName) => {
          const guideInfo = guides[guideName];
          if (active === 'all' || guideInfo.tags.includes(active)) {
            return (
              <Card css={styles.card} key={guideName}>
                <Card.Body>
                  <Box.Flex gap={'$3'}>
                    {guideInfo.featured && (
                      <Text css={styles.featured}>Featured</Text>
                    )}
                    <Text css={styles.date}>{guideInfo.last_updated}</Text>
                  </Box.Flex>
                  <FuelLink href={`/guides/${guideName.replaceAll('_', '-')}`}>
                    <Heading as="h4">{guideInfo.title}</Heading>
                  </FuelLink>
                  <Text>{guideInfo.description}</Text>
                  <Box.Flex gap={'$2'} css={styles.badgeContainer}>
                    {guideInfo.tags.map((tag) => (
                      <Badge key={tag} variant="ghost" css={styles.badge}>
                        {tag}
                      </Badge>
                    ))}
                  </Box.Flex>
                </Card.Body>
              </Card>
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
  card: cssObj({
    marginBottom: '$6',
    padding: '$3 $2',
  }),
  featured: cssObj({
    color: '$intentsPrimary11',
    fontSize: '$sm',
  }),
  date: cssObj({
    fontSize: '$sm',
  }),
  separator: cssObj({
    background: '$intentsBase7',
    height: '20px',
    width: '2px',
  }),
  badge: cssObj({
    fontSize: '$xs',
  }),
  badgeContainer: cssObj({
    marginTop: '$4',
  }),
  categoryContainer: cssObj({
    marginBottom: '$10',
  }),
  category: cssObj({
    '&:hover': {
      border: '1px solid $intentsPrimary7 !important',
    },
    '&[data-active="true"]': {
      border: '1px solid $intentsPrimary7',
    },
  }),
};
