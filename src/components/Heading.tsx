/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading, Icon } from '@fuel-ui/react';
import { useRef, useEffect } from 'react';

import { useDocContext } from '../hooks/useDocContext';

export function Heading({ children, ...props }: any) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { setActiveHistory } = useDocContext();
  const iEntries = useRef<string | null>();

  useEffect(() => {
    if (props['data-rank'] === 'h1') return;
    const watch = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        iEntries.current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          )
          .map((entry) => entry.target.getAttribute('id'))
          .filter((id): id is string => id !== null)?.[0];

        if (iEntries.current) {
          setActiveHistory(iEntries.current);
        }
      },
      { rootMargin: '0px', threshold: 1.0 },
    );
    watch && observer.observe(watch);

    // Make sure to unobserve on component unmount.
    return () => {
      watch && observer.unobserve(watch);
    };
  }, []);

  return (
    <FuelHeading ref={ref} as={props['data-rank']} {...props} css={styles.root}>
      <Icon icon={Icon.is('Link')} />
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

    [head([1])]: {
      mb: '$8',
      position: 'relative',
      textSize: '5xl',

      '& a': {
        position: 'relative',
      },

      '& a:after': {
        position: 'absolute',
        content: '""',
        bottom: '-4px',
        left: 0,
        height: '3px',
        backgroundColor: '$brand',
        display: 'block',
        width: '60%',
      },
    },
    [head([2])]: {
      mt: '$12',
      mb: '$5',
      pb: '$2',
      borderBottom: '1px solid $border',
    },
    [head([3])]: {
      mt: '$8',
      mb: '$4',
    },
    [head([4, 5, 6])]: {
      mt: '$6',
      mb: '$2',
    },

    [`${head([1, 2])} a, ${head([1, 2])} a:visited`]: {
      color: '$intentsBase12',
    },
    [`${head([3, 4, 5, 6])} a, ${head([3, 4, 5, 6])} a:visited`]: {
      color: '$intentsBase11',
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
