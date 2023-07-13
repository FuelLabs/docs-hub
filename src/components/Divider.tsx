import { cssObj } from "@fuel-ui/css"
import type { HTMLProps } from "@fuel-ui/react"
import { Box } from "@fuel-ui/react"

export function Divider(props: HTMLProps["hr"]) {
  return <Box as="hr" css={styles.root} {...props} />
}

const styles = {
  root: cssObj({
    my: "$8",
    border: 0,
    height: 1,
    bg: "$border",
  }),
}
