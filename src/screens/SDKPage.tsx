import { Box, Card, Heading } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';

import { styles } from './HomePage';

const sdkNavigation = {
  parent: {
    label: 'All Docs',
    link: '/',
  },
  navigation: [
    {
      label: 'Rust',
      slug: 'docs/fuels-rs',
      isExternal: false,
    },
    {
      label: 'TypeScript',
      slug: 'docs/fuels-ts',
      isExternal: false,
    },
    {
      label: 'Wallet',
      slug: 'docs/wallet',
      isExternal: false,
    },
  ],
};

export function SDKScreen() {
  return (
    <>
      <Box css={styles.sidebar}>
        <Box css={styles.sidebarContainer}>
          <Sidebar nav={sdkNavigation} />
        </Box>
      </Box>
      <Box as="section" css={styles.section} className="Layout--section">
        <Box className="Layout--pageContent">
          <Box.Stack>
            <Heading as="h3">References</Heading>
            <Card>
              <Card.Header></Card.Header>
              <Card.Body>body</Card.Body>
            </Card>
          </Box.Stack>
        </Box>
      </Box>
    </>
  );
}
