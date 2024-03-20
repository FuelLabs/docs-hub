import { cssObj } from "@fuel-ui/css";
import type { LinkProps } from "@fuel-ui/react";
import { Link as FuelLink } from "@fuel-ui/react";
import NextLink from "next/link";

export function Link(props: LinkProps) {
  return props.href?.startsWith("http") ? (
    <FuelLink {...props} isExternal css={styles.link} />
  ) : (
    <NextLink
      href={props.href?.replace("//", "/") ?? ""}
      passHref
      legacyBehavior
    >
      <FuelLink {...props} css={styles.link} />
    </NextLink>
  );
}

const styles = {
  link: cssObj({
    'html[class="fuel_light-theme"] &': {
      color: "#009957 !important",
    },
    'html[class="fuel_dark-theme"] &': {
      color: "$semanticLinkPrimaryColor !important",
    },
    outline: "none",
  }),
};
