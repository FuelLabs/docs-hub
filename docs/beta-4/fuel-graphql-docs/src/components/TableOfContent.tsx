import { cssObj } from '@fuel-ui/css';
import { Box, Heading, Link, List, Text } from '@fuel-ui/react';
import { useDocContext } from '~/src/hooks/useDocContext';

export function TableOfContent() {
  const { doc } = useDocContext();
  const { headings } = doc;
  return (
    <Box css={styles.queries}>
      <Box css={styles.root}>
        <Heading as="h6">On this page</Heading>
        <List>
          {headings.map((heading) => (
            <List.Item key={heading.title}>
              <a className="page-link" href={`#${heading.id}`}>
                {heading.title}
              </a>
              {heading.children && (
                <List type="ordered">
                  {heading.children.map((heading) => (
                    <List.Item key={heading.title}>
                      <a className="page-link" href={`#${heading.id}`}>
                        {heading.title}
                      </a>
                    </List.Item>
                  ))}
                </List>
              )}
            </List.Item>
          ))}
        </List>
        <Text as="div" css={styles.feedback}>
          <Link
            isExternal
            href="https://github.com/FuelLabs/fuel-graphql-docs/issues/new/choose"
          >
            Questions? Give us a feedback
          </Link>
          <Link isExternal href={doc.pageLink}>
            Edit this page
          </Link>
        </Text>
      </Box>
    </Box>
  );
}

const LIST_ITEM = '.fuel_list > .fuel_list-item';

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
      mt: 0,
    },

    [LIST_ITEM]: {
      pb: '$2',
      a: {
        fontWeight: '$semibold',
        color: '$gray11',
      },
    },
    [`${LIST_ITEM} > ${LIST_ITEM}:nth-child(1)`]: {
      pt: '$2',
    },
    [`${LIST_ITEM} > ${LIST_ITEM}`]: {
      a: {
        fontWeight: '$normal',
        color: '$gray9',
      },
    },
  }),
  feedback: cssObj({
    display: 'flex',
    flexDirection: 'column',
    pt: '$3',
    borderTop: '1px dashed $gray4',
    fontSize: '$xs',

    'a, a:visited': {
      color: '$gray10',
    },
  }),
};
