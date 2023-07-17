/* eslint-disable @typescript-eslint/naming-convention */
import { cssObj } from '@fuel-ui/css';
import { Tabs, Box, Heading } from '@fuel-ui/react';

export type CodeExamplesProps = {
  file: string;
  ts_lines?: number[];
  apollo_lines?: number[];
  urql_lines?: number[];
  ts_testCase?: string;
  apollo_testCase?: string;
  urql_testCase?: string;
  ts_title?: string;
  apollo_title?: string;
  urql_title?: string;
  __ts_content: string;
  __apollo_content: string;
  __urql_content: string;
  __ts_language: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  // __filepath: string;
  // __filename: string;
  // __ts_lineStart: number;
  // __apollo_lineStart: number;
  // __urql_lineStart: number;
  // __ts_lineEnd?: number;
  // __apollo_lineEnd?: number;
  // __urql_lineEnd?: number;
};

export function GraphQLCodeExample(props: CodeExamplesProps) {
  interface TabContentProps {
    value: string;
    content: string;
  }

  const TabContent = ({ value, content }: TabContentProps) => {
    return (
      <Tabs.Content css={styles.codeContainer} value={value}>
        <Box css={styles.box}> {content} </Box>
      </Tabs.Content>
    );
  };

  return (
    <Box.Stack css={styles.root}>
      <Tabs defaultValue="ts" css={styles.tabs}>
        <Tabs.List css={styles.tabsList} aria-label="Using the query in an app">
          <Heading as="h4" leftIcon="Code">
            Code Example:
          </Heading>
          <Tabs.Trigger css={styles.tabsTrigger} value="ts">
            TypeScript
          </Tabs.Trigger>
          <Tabs.Trigger css={styles.tabsTrigger} value="apollo">
            Apollo Client
          </Tabs.Trigger>
          <Tabs.Trigger css={styles.tabsTrigger} value="urql">
            urql
          </Tabs.Trigger>
        </Tabs.List>
        <TabContent value="ts" content={props.children[0]} />
        <TabContent value="apollo" content={props.children[1]} />
        <TabContent value="urql" content={props.children[2]} />
      </Tabs>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    my: '$8',

    '& h4': {
      flex: 1,
      mb: '$2',
      fontSize: '$md',
      color: '$textSubtext',
    },
  }),
  box: cssObj({
    'div > div': {
      padding: '$3 0',
    },
  }),
  tabsTrigger: cssObj({
    fontSize: '$sm',
    height: '$6',
    padding: '$0 $3',
    borderRadius: '$default',
    border: '1px solid $border',

    '&[data-state=active]:after': {
      bg: 'transparent',
    },
    '&[data-state=active]': {
      bg: '$overlayBg',
    },
  }),
  tabs: cssObj({
    margin: '0',
    bg: 'transparent',

    '& pre': {
      margin: '0 !important',
    },
  }),
  tabsList: cssObj({
    alignItems: 'center',
    bg: 'transparent',
    margin: '0',
    mb: '$2',
    gap: '$2',
  }),
  codeContainer: cssObj({
    maxHeight: '500px',
    overflow: 'scroll',
  }),
  filename: cssObj({
    '&, &:visited': {
      fontSize: '$sm',
      color: '$gray9',
    },
    '&:hover': {
      color: '$gray11',
      textDecoration: 'none',
    },
  }),
};
