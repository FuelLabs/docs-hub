import { cssObj } from "@fuel-ui/css";
import { Box } from "@fuel-ui/react";
import { Layout } from "../components/Layout";

export default function Home(props: any) {
  return (
    <Layout title={"Documentation Hub"}>
      <Box as="section" css={styles.section}>
        <h1>Hi</h1>
      </Box>
    </Layout>
  );
}

const styles = {
  sidebar: cssObj({
    display: 'none',
    padding: '$8 $0 $0 $6',
    position: 'sticky',
    top: 20,

    '@xl': {
      display: 'block',
    },
  }),
  section: cssObj({
    py: '$4',
    px: '$4',

    '@md': {
      px: '$10',
    },

    '@xl': {
      py: '$8',
      px: '$0',
    },
  }),
};
