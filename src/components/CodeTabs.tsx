// @ts-nocheck

import { cssObj } from '@fuel-ui/css';
import { Tabs } from '@fuel-ui/react';

interface CodeTabsProps {
  children: React.ReactNode;
}

export function CodeTabs(props: CodeTabsProps) {
  if (props.children) {
    let order = [props.children[0], props.children[1]];
    const firstChildCode =
      props.children[0].props.children.props.__code ??
      props.children[0].props.__code;
    if (firstChildCode && !firstChildCode.includes('pnpm')) {
      order = [props.children[1], props.children[0]];
    }
    return (
      <Tabs css={styles.root} defaultValue='pnpm'>
        <Tabs.List css={styles.tabStyles} aria-label='Choose npm or pnpm.'>
          <Tabs.Trigger value='pnpm'>pnpm</Tabs.Trigger>
          <Tabs.Trigger value='npm'>npm</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='pnpm'>{order[0]}</Tabs.Content>
        <Tabs.Content value='npm'>{order[1]}</Tabs.Content>
      </Tabs>
    );
  }
}

const styles = {
  root: cssObj({
    borderRadius: '$sm',
    padding: '$1',
    mt: '$2',
  }),
  tabStyles: cssObj({
    mb: '0',
    button: {
      fontSize: '$base',
      '&[data-state=active]:after': {
        background: '$indigo10',
      },
      '&:hover': {
        color: '$indigo10',
      },
    },
  }),
};
