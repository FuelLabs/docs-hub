import { DocSearch } from '@docsearch/react';
import type { DocSearchHit } from '@docsearch/react/dist/esm/types';
import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import docsearch from '~/docsearch.json';

import { NAVIGATION } from '../config/constants';

function filter(items: DocSearchHit[], isLatest?: boolean) {
  const slugs: string[] = [];
  const newItems: DocSearchHit[] = [];
  const filtered = items.filter((item) => {
    if (
      (!isLatest && item.url.includes('/latest/')) ||
      (isLatest && !item.url.includes('/latest/'))
    ) {
      return false;
    }
    if (item.type === 'lvl0') {
      if (!slugs.includes(item.hierarchy.lvl0)) {
        slugs.push(item.hierarchy.lvl0);
        const newItem = makeNewItem(item);
        newItems.push(newItem);
      }
      return false;
    }
    return true;
  });

  return [...newItems, ...filtered];
}

function getItemData(item: DocSearchHit): string[] {
  for (const obj of NAVIGATION) {
    if (item.hierarchy.lvl0.includes(obj.name) && obj.link) {
      return [obj.name, obj.link];
    } else if (obj.menu) {
      for (const subObj of obj.menu) {
        if (
          item.hierarchy.lvl0.includes(
            subObj.name.replace('TypeScript', 'TS').replace('API', '')
          ) &&
          subObj.link
        ) {
          return [subObj.name, subObj.link];
        }
      }
    }
  }
  return ['', 'https://docs.fuel.network/'];
}

function makeNewItem(item: DocSearchHit) {
  const newItem = item;
  newItem.type = 'lvl1';
  const [newLvl1, newUrl] = getItemData(item);
  newItem.hierarchy.lvl1 = newLvl1;
  newItem.url = newUrl;
  return newItem;
}

export default function Search({
  title,
  isLatest,
}: {
  title?: string;
  isLatest?: boolean;
}) {
  const transformItems = (items: DocSearchHit[]) => filter(items, isLatest);

  return (
    <Box.Flex css={styles.container}>
      <DocSearch
        indexName={docsearch.index_name}
        appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
        apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!}
        disableUserPersonalization={true}
        transformItems={transformItems}
        searchParameters={
          title
            ? {
                optionalFilters: [`hierarchy.lvl0:${title}`],
              }
            : {}
        }
      />
      <Box css={styles.textContainer}>
        <Text>⌘K</Text>
      </Box>
    </Box.Flex>
  );
}

const styles = {
  container: cssObj({
    width: '120px',
    '@sm': {
      width: '150px',
    },

    '.DocSearch-Button': {
      backgroundColor: '#151718',
      'html[class="fuel_light-theme"] &': {
        backgroundColor: '$gray4',
      },
    },
  }),
  textContainer: cssObj({
    position: 'relative',
    left: '-40px',
    display: 'grid',
    placeItems: 'center',
    border: '1px solid $border',
    height: '24px',
    borderRadius: '8px',
    px: '$1',
    my: 'auto',
    fontSize: '$xs',
    '@sm': {
      fontSize: '$sm',
    },
  }),
};
