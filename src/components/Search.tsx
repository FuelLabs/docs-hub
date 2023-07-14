import { DocSearch } from '@docsearch/react';
import type { DocSearchHit } from '@docsearch/react/dist/esm/types';
import docsearch from '~/docsearch.json';

import { NAVIGATION } from '../constants';

export function Search() {
  const transformItems = (items: DocSearchHit[]) =>
    filterLevelZeroResults(items);

  function getItemData(item: DocSearchHit): string[] {
    for (const obj of NAVIGATION) {
      if (item.hierarchy.lvl0.includes(obj.name) && obj.link) {
        return [obj.name, obj.link];
      } else if (obj.menu) {
        for (const subObj of obj.menu) {
          if (
            item.hierarchy.lvl0.includes(
              subObj.name.replace('TypeScript', 'TS').replace('API', ''),
            ) &&
            subObj.link
          ) {
            return [subObj.name, subObj.link];
          }
        }
      }
    }
    return ['', 'http://localhost:3000/'];
  }

  function makeNewItem(item: DocSearchHit) {
    const newItem = item;
    newItem.type = 'lvl1';
    const [newLvl1, newUrl] = getItemData(item);
    newItem.hierarchy.lvl1 = newLvl1;
    newItem.url = newUrl;
    return newItem;
  }

  function filterLevelZeroResults(items: DocSearchHit[]) {
    const slugs: string[] = [];
    const newItems: DocSearchHit[] = [];
    const filtered = items.filter((item) => {
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

  return (
    <DocSearch
      indexName={docsearch.index_name}
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!}
      disableUserPersonalization={true}
      transformItems={transformItems}
    />
  );
}
