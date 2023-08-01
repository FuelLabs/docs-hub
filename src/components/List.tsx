/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { List } from '@fuel-ui/react';

export function UL({ children, ...props }: any) {
  return (
    <List {...props} type="unordered" css={styles.root}>
      {children
        .map((child: any, idx: number) => {
          if (!child?.type) return null;
          return <List.Item key={idx}>{child.props.children}</List.Item>;
        })
        .filter(Boolean)}
    </List>
  );
}

export function OL({ children, ...props }: any) {
  return (
    <List {...props} type="ordered" css={styles.root}>
      {children
        .map((child: any, idx: number) => {
          if (!child?.type) return null;
          return <List.Item key={idx}>{child.props.children}</List.Item>;
        })
        .filter(Boolean)}
    </List>
  );
}

const styles = {
  root: cssObj({
    my: '$6',
    pl: '$4',

    '&[class*=unordered]': {
      listStyle: 'outside',
    },

    li: {
      pl: '$1',
      lineHeight: '1.7',
    },

    '& li > p': {
      display: 'inline',
    },
  }),
};
