import { Link as FuelLink, Card as FuelCard } from '@fuel-ui/react';
import { styles } from '../Card';

interface FuelnautCardProps {
  link: string;
  title: string;
  status: boolean | undefined | null;
}

export function FuelnautCard({ link, title, status }: FuelnautCardProps) {
  return (
    <FuelLink href={link} css={styles.root}>
      <FuelCard css={styles.card}>
        <FuelCard.Body>
          <div>{title}</div>

          {status === null && <p>🚫 Not Registered</p>}

          {status === undefined && <p>🟠 Not Started</p>}

          {status === false && <p>🔵 Started</p>}

          {status === true && <p>✅ Completed</p>}
        </FuelCard.Body>
      </FuelCard>
    </FuelLink>
  );
}
