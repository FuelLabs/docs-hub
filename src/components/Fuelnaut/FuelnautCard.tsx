import { Card as FuelCard, Link as FuelLink } from '@fuel-ui/react';
import { use, useEffect, useState } from 'react';
import { styles } from '../Card';

interface FuelnautCardProps {
  link: string;
  title: string;
  status: boolean | undefined | null;
  mounted: boolean;
}

export function FuelnautCard({ link, title, status, mounted }: FuelnautCardProps) {
  return (
    <FuelLink href={link} css={styles.root}>
      <FuelCard css={styles.card}>
        <FuelCard.Body>
          <div>{title}</div>

          {mounted && status === null && <p>🚫 Not Registered</p>}

          {status === undefined && <p>🟠 Not Started</p>}

          {status === false && <p>🔵 Started</p>}

          {status === true && <p>✅ Completed</p>}
        </FuelCard.Body>
      </FuelCard>
    </FuelLink>
  );
}
