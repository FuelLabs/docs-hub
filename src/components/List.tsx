import { cssObj } from '@fuel-ui/css';
import { List } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny:
export function UL({ children, ...props }: any) {
  return (
    <List {...props} type="unordered" css={styles.root}>
      {children
        // biome-ignore lint/suspicious/noExplicitAny:
        .map((child: any, idx: number) => {
          if (!child?.type) return null;
          return <List.Item key={idx}>{child.props.children}</List.Item>;
        })
        .filter(Boolean)}
    </List>
  );
}

// biome-ignore lint/suspicious/noExplicitAny:
export function OL({ children, ...props }: any) {
  return (
    <List {...props} type="ordered" css={styles.root}>
      {children
        // biome-ignore lint/suspicious/noExplicitAny:
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
      wordWrap: 'break-word',
      'html[class="fuel_light-theme"] &': {
        color: '$intentsBase12 !important',
        '&::marker': {
          color: '$intentsBase12',
        },
      },
      '&::marker': {
        color: '$intentsBase11',
      },
    },
  }),
};
