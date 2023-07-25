import { cssObj } from '@fuel-ui/css';
import { Box, Link, List, Text } from '@fuel-ui/react';

import { Heading } from '../components/Heading';
import { capitalize } from '../lib/str';

type VersionItem = {
  version: string;
  name: string;
  category: string;
  url: string;
};

export type VersionsPageProps = {
  versions: {
    wallet: VersionItem;
    tsSDK: VersionItem;
    rust: VersionItem;
  };
};

export function VersionPage({ versions }: VersionsPageProps) {
  return (
    <Box css={styles.root}>
      <Heading as="h1" data-rank="h1" id="fuel-docs">
        Versions
      </Heading>
      <Text>
        Here, you will find a comprehensive list of the versions of each tool
        when we release this docs:
      </Text>
      <List css={styles.list}>
        {Object.entries(versions).map(([key, value]) => (
          <List.Item key={key}>
            <Text>
              <span>{capitalize(value.category)}:</span>
              <code>
                <Link
                  href={`${value.url.replace('#readme', '')}/releases/tag/v${
                    value.version
                  }`}
                  isExternal
                >
                  {value.name}
                </Link>{' '}
                ({value.version})
              </code>
            </Text>
          </List.Item>
        ))}
      </List>
    </Box>
  );
}

const styles = {
  root: cssObj({
    py: '$10',
    px: '$6',

    '@xl': {
      px: '$14',
    },
  }),
  list: cssObj({
    mt: '$4',

    '.fuel_Text': {
      display: 'flex',
      gap: '$3',
      alignItems: 'center',
      lineHeight: '$8',
    },
    '.fuel_Text span': {
      color: '$intentsBase11',
      fontWeight: '$bold',
    },
  }),
};
