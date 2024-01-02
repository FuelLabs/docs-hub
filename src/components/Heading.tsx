/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading, Icon } from '@fuel-ui/react';

export function Heading({ children, ...props }: any) {
  const isNightly = props['data-nightly'];
  const paddingStyles = cssObj({
    [head([1])]: {
      scrollMarginTop: isNightly ? '$24' : '$20',
    },
    [head([2, 3, 4])]: {
      scrollMarginTop: isNightly ? '108px' : '$16',
    },
  });
  return (
    <FuelHeading {...props} css={{ ...styles.root, ...paddingStyles }}>
      <Icon icon={'Link'} />
      {props.id ? <a href={`#${props.id}`}>{children}</a> : children}
    </FuelHeading>
  );
}

function head(rank: number[]) {
  return `&:is(${rank.map((r) => `[data-rank="h${r}"]`).join(', ')})`;
}

const styles = {
  root: cssObj({
    position: 'relative',
    fontFamily: '$display',
    fontWeight: '$medium',

    [`${head([1])}:first-of-type`]: {
      mb: '$8',
      pt: '39px',
      position: 'relative',
      textSize: '5xl',

      '& a': {
        position: 'relative',
      },
    },
    [head([1, 2])]: {
      pt: '$6',
      mb: '$5',
      pb: '$2',
      borderBottom: '1px solid $border',
    },
    [head([3])]: {
      pt: '$4',
      mb: '$4',
      textSize: 'xl',
    },
    [head([4, 5, 6])]: {
      pt: '$2',
      mb: '$2',
      textSize: 'lg',
    },

    [`${head([1, 2, 3, 4, 5, 6])} a, ${head([1, 2, 3, 4, 5, 6])} a:visited`]: {
      color: '$intentsBase12',
    },

    '& a': {
      color: 'currentColor',
    },
    '&:is([id]) a:hover': {
      textDecoration: 'none',
    },

    '.fuel_Icon': {
      visibility: 'hidden',
      position: 'absolute',
      top: '50%',
      left: '-15px',
      transform: 'translateY(-50%)',
    },
    '&:is([id]):hover .fuel_Icon': {
      visibility: 'visible',
    },
  }),
};
