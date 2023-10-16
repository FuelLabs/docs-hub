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

type CardInfo = {
  link: string;
  isExternal: boolean;
  heading: string;
  headingIcon?: string;
  body: string;
};

interface CardProps {
  guideInfo?: GuideInfo;
  cardInfo?: CardInfo;
  cardName: string;
}

export function Card({ guideInfo, cardInfo, cardName }: CardProps) {
  return (
    <FuelLink
      href={
        guideInfo ? `/guides/${cardName.replaceAll('_', '-')}` : cardInfo?.link
      }
      isExternal={cardInfo ? cardInfo.isExternal : false}
      css={styles.root}
    >
      <FuelCard css={styles.card}>
        <FuelCard.Body>
          {guideInfo && (
            <Box.Flex gap={'$3'}>
              {guideInfo.featured && (
                <Text css={styles.featured}>Featured</Text>
              )}
              <Text css={styles.date}>{guideInfo.last_updated}</Text>
            </Box.Flex>
          )}

          <Heading
            iconSize={24}
            leftIcon={cardInfo?.headingIcon ?? null}
            as="h4"
          >
            {cardInfo ? cardInfo.heading : guideInfo?.title}
          </Heading>
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
    </FuelLink>
  );
}

const styles = {
  root: cssObj({
    padding: '$3 $2',
    margin: 0,
    height: 'calc(100% - 26px)',
    width: 'calc(100% - 18px)',
    border: '1px solid $border',
    borderRadius: '6px',
    '&:hover': {
      textDecoration: 'none !important',
      border: '1px solid $intentsBase8',
    },
    backgroundImage:
      'linear-gradient($transparent, rgb(15, 15, 15)) !important',
    'html[class="fuel_light-theme"] &': {
      backgroundImage:
        'linear-gradient($transparent, rgb(245, 245, 245)) !important',
    },
  }),
  card: cssObj({
    width: '100%',
    border: 'none',
    bg: '$transparent',
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
    '&:hover': {
      bg: '$semanticGhostBaseBg !important',
    },
  }),
  badgeContainer: cssObj({
    marginTop: '$4',
  }),
};
