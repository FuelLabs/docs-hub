import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Icon, List } from '@fuel-ui/react';

import { useDocContext } from '~/src/hooks/useDocContext';

export function TableOfContent() {
  const { doc, activeHistory } = useDocContext();
  const { headings } = doc;
  const lastActive = activeHistory?.at(activeHistory.length - 1);

  return (
    <Box css={styles.queries}>
      <Box css={styles.root}>
        <Heading as="h6">
          <Icon
            icon={Icon.is('ListDetails')}
            size={14}
            stroke={1}
            color="textSubtext"
          />
          On this page
        </Heading>
        <List>
          {headings.map((heading) => (
            <List.Item
              key={heading.title}
              data-active={heading.id === lastActive}
            >
              <a href={`#${heading.id}`}>{heading.title}</a>
              {heading.children && (
                <List>
                  {heading.children.map((heading) => (
                    <List.Item
                      key={heading.title}
                      data-active={heading.id === lastActive}
                    >
                      <a href={`#${heading.id}`}>{heading.title}</a>
                    </List.Item>
                  ))}
                </List>
              )}
            </List.Item>
          ))}
        </List>
      </Box>
    </Box>
  );
}

const LIST_ITEM = '.fuel_List > .fuel_ListItem';

const styles = {
  queries: cssObj({
    display: 'none',

    '@xl': {
      display: 'block',
    },
  }),
  root: cssObj({
    position: 'sticky',
    top: 0,
    py: '$8',
    pr: '$8',

    h6: {
      display: 'flex',
      alignItems: 'center',
      gap: '$2',
      mt: 0,
      mb: '$3',
    },

    '.fuel_List .fuel_List': {
      mt: '$2',
      borderLeft: '1px solid $border',
    },

    [LIST_ITEM]: {
      mb: '$2',
      lineHeight: 1.4,
      fontSize: '$xs',

      a: {
        color: '$intentsBase11',
      },
    },
    [`${LIST_ITEM} > ${LIST_ITEM}`]: {
      pl: '$3',
      a: {
        fontWeight: '$normal',
        color: '$intentsBase9',
      },
    },

    [`${LIST_ITEM}[data-active="true"] a`]: {
      color: '$brand !important',
    },
  }),
};
