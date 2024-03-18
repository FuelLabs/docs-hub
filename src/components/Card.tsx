import { cssObj } from '@fuel-ui/css';
import {
  Badge,
  Box,
  Card as FuelCard,
  Link as FuelLink,
  Heading,
  Text,
} from '@fuel-ui/react';

import type { GuideInfo } from '../pages/guides';
import type { VersionSet } from '../types';

export type CardInfo = {
  link: string;
  nightlyLink?: string;
  beta4Link?: string;
  isExternal: boolean;
  heading: string;
  headingIcon?: string;
  body: string;
};

interface CardProps {
  guideInfo?: GuideInfo;
  cardInfo?: CardInfo;
  cardName: string;
  versionSet: VersionSet;
}

export function Card({ guideInfo, cardInfo, cardName, versionSet }: CardProps) {
  let href = '';
  if (guideInfo) {
    href = `/guides/${cardName.replaceAll('_', '-')}`;
  } else if (versionSet === 'nightly' && cardInfo?.nightlyLink) {
    href = cardInfo?.nightlyLink;
  } else if (versionSet === 'beta-4' && cardInfo?.beta4Link) {
    href = cardInfo?.beta4Link;
  } else {
    href = cardInfo?.link ?? '';
  }
  return (
    <FuelLink
      href={href}
      isExternal={cardInfo ? cardInfo.isExternal : false}
      css={styles.root}
    >
      <FuelCard css={styles.card}>
        <FuelCard.Body>
          {guideInfo?.featured && <Text css={styles.featured}>Featured</Text>}

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
      backgroundImage:
        'linear-gradient($transparent, rgb(15, 15, 15)) !important',
      'html[class="fuel_light-theme"] &': {
        backgroundImage:
          'linear-gradient($transparent, rgb(245, 245, 245)) !important',
      },
    },
    '@sm': {
      padding: '$3 $6 $3 $2',
      width: 'calc(100% - 26px)',
    },
  }),
  card: cssObj({
    width: '100%',
    border: 'none',
    bg: '$transparent',
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
