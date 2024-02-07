/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Heading as FuelHeading } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export function Heading({ children, ...props }: any) {
  const [link, setLink] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (typeof children == 'string') {
      setLink(children.replace(/[\s_]+/g, '-').toLowerCase());
    } else if (typeof children == 'object' && children.props) {
      setLink(children.props.children.replace(/[\s_]+/g, '-').toLowerCase());
    }
  }, [children]);

  return (
    <FuelHeading as={props['data-rank']} {...props} css={styles.root}>
      <Link
        href={link && router ? `${router.asPath.split('#')[0]}#${link}` : ''}
      >
        {children}
      </Link>
    </FuelHeading>
  );
}

const styles = {
  root: cssObj({
    '&[data-rank=h1]': {
      mb: '$6',
      color: '$gray12',
    },
    '&[data-rank=h2]': {
      mt: '$12',
      mb: '$5',
      pb: '$2',
      color: '$gray12',
      borderBottom: '1px dashed $gray3',
    },
    '&[data-rank=h3]': {
      mt: '$8',
      mb: '$4',
      color: '$gray11',
    },
    '&[data-rank=h4], &[data-rank=h5], &[data-rank=h6]': {
      mt: '$6',
      mb: '$2',
      color: '$gray11',
    },
  }),
};
