/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading, Icon } from '@fuel-ui/react';

export function Heading({ children, ...props }: any) {
  const isLatest = props['data-latest'];
  const paddingStyles = cssObj({
    [head([1])]: {
      pt: isLatest ? '$24' : '$20',
    },
    [head([2, 3, 4])]: {
      pt: isLatest ? '108px' : '$16',
    },
    // [head([3])]: {
    //   pt: isLatest ? '$16' : '$12',
    // },
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
      position: 'relative',
      textSize: '5xl',

      '& a': {
        position: 'relative',
      },
    },
    [head([1, 2])]: {
      mb: '$5',
      pb: '$2',
      borderBottom: '1px solid $border',
    },
    [head([3])]: {
      mb: '$4',
      textSize: '2xl',
    },
    [head([4, 5, 6])]: {
      pt: '$6',
      mb: '$2',
      textSize: 'xl',
    },

    [`${head([1, 2, 3, 4, 5, 6])} a, ${head([1, 2, 3, 4, 5, 6])} a:visited`]: {
      color: '$intentsBase12',
    },
    // [`${head([1, 2])} a, ${head([1, 2, 3, 4, 5, 6])} a:visited`]: {
    //   color: '$intentsBase12',
    // },

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
