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
              b.target.getBoundingClientRect().top
          )
          .map((entry) => entry.target.getAttribute('id'))
          .filter((id): id is string => id !== null)?.[0];

        if (iEntries.current) {
          setActiveHistory(iEntries.current);
        }
      },
      { rootMargin: '0px', threshold: 1.0 }
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
      <a href={`#${props.id}`}>{children}</a>
    </FuelHeading>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',

    '&[data-rank=h1]': {
      mb: '$6',
      color: '$intentsBase12',
    },
    '&[data-rank=h2]': {
      mt: '$12',
      mb: '$5',
      pb: '$2',
      color: '$intentsBase12',
      borderBottom: '1px dashed $intentsBase3',
    },
    '&[data-rank=h3]': {
      mt: '$8',
      mb: '$4',
      color: '$intentsBase11',
    },
    '&[data-rank=h4], &[data-rank=h5], &[data-rank=h6]': {
      mt: '$6',
      mb: '$2',
      color: '$intentsBase11',
    },

    '& a': {
      color: 'currentColor',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },

    '.fuel_Icon': {
      visibility: 'hidden',
      position: 'absolute',
      top: '50%',
      left: '-15px',
      transform: 'translateY(-50%)',
    },
    '&:hover .fuel_Icon': {
      visibility: 'visible',
    },
  }),
};
