import { cssObj } from '@fuel-ui/css';
import {
  Link as FuelLink,
  Box,
  Badge,
  Text,
  Heading,
  Card as FuelCard,
} from '@fuel-ui/react';

import type { GuideInfo } from '../pages/guides';
import type { CardInfo } from '../screens/CategoryPage';

interface CardProps {
  guideInfo?: GuideInfo;
  cardInfo?: CardInfo;
  cardName: string;
}

export function Card({ guideInfo, cardInfo, cardName }: CardProps) {
  return (
    <FuelCard css={styles.card}>
      <FuelCard.Body>
        {guideInfo && (
          <Box.Flex gap={'$3'}>
            {guideInfo.featured && <Text css={styles.featured}>Featured</Text>}
            <Text css={styles.date}>{guideInfo.last_updated}</Text>
          </Box.Flex>
        )}
        <FuelLink
          href={
            guideInfo
              ? `/guides/${cardName.replaceAll('_', '-')}`
              : cardInfo?.link
          }
          isExternal={cardInfo ? cardInfo.isExternal : false}
        >
          <Heading
            iconSize={24}
            leftIcon={cardInfo?.headingIcon ?? null}
            as="h4"
          >
            {cardInfo ? cardInfo.heading : guideInfo?.title}
          </Heading>
        </FuelLink>
        <Text>{cardInfo ? cardInfo.body : guideInfo?.description}</Text>
        {guideInfo && (
          <Box.Flex gap={'$2'} css={styles.badgeContainer}>
            {guideInfo.tags.map((tag) => (
              <Badge key={tag} variant="ghost" css={styles.badge}>
                {tag}
              </Badge>
            ))}
          </Box.Flex>
        )}
      </FuelCard.Body>
    </FuelCard>
  );
}

const styles = {
  card: cssObj({
    padding: '$3 $2',
    margin: 0,
    height: 'calc(100% - 26px)',
  }),
  date: cssObj({
    fontSize: '$sm',
  }),
  featured: cssObj({
    color: '$intentsPrimary11',
    fontSize: '$sm',
  }),
  badge: cssObj({
    fontSize: '$xs',
  }),
  badgeContainer: cssObj({
    marginTop: '$4',
  }),
};
