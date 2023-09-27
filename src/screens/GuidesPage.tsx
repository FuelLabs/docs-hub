import { cssObj } from '@fuel-ui/css';
import { Link as FuelLink, Box, Icon, Text } from '@fuel-ui/react';

import { Heading } from '../components/Heading';
import type { GuideInfo } from '../pages/guides';

interface GuidesPageProps {
  guides: { [key: string]: GuideInfo };
  isLatest: boolean;
}

interface GuideCardProps {
  guideName: string;
  guideInfo: GuideInfo;
  // isLatest: boolean;
}

export function GuideCard({ guideName, guideInfo }: GuideCardProps) {
  const cleanGuideName = guideName.replaceAll('_', '-');
  return (
    <Box key={guideName} css={styles.card}>
      <Icon icon="Code" size={40} stroke={0.7} />
      <Box.Stack>
        <FuelLink href={`/guides/${cleanGuideName}`}>
          <Heading as="h3">{guideInfo.title}</Heading>
        </FuelLink>
        <Text>{guideInfo.description}</Text>
      </Box.Stack>
    </Box>
  );
}

export function GuidesPage({ guides }: GuidesPageProps) {
  return (
    <Box css={styles.root}>
      <Heading as="h1" data-rank="h1" id="fuel-docs">
        Fuel Guides
      </Heading>
      <Box css={styles.cardList}>
        {Object.keys(guides).map((guideName) => {
          const guideInfo = guides[guideName];
          return (
            <GuideCard
              key={guideName}
              guideName={guideName}
              guideInfo={guideInfo}
              // isLatest={isLatest}
            />
          );
        })}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    py: '$6',
    px: '$6',

    '@xl': {
      px: '$14',
    },
  }),
  cardList: cssObj({
    display: 'grid',
    gap: '$6',
    py: '$8',

    '@xl': {
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
  }),
  card: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$6',
    padding: '$4 $6 $6',
    border: '1px solid $border',
    borderRadius: '$md',

    '& > .fuel_Icon': {
      mt: '3px',
      color: '$intentsBase8',
    },

    h3: {
      m: '$0',
      pt: '$2',
    },

    '.fuel_List': {
      mt: '$2',
    },

    '.fuel_ListItem a': {
      color: '$textLink',
    },
  }),
};
