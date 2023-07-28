import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Plyr from 'plyr-react';
import type { PlyrProps } from 'plyr-react';

type PlayerProps = PlyrProps & {
  src: string;
};

export default function Player({ src, ...props }: PlayerProps) {
  return (
    <Box css={styles.root}>
      <Plyr
        {...props}
        source={
          props.source || {
            type: 'video',
            sources: [{ src, type: 'video/mp4', size: 720 }],
          }
        }
      />
    </Box>
  );
}

const styles = {
  root: cssObj({
    my: '$8',
    fontFamily: '$sans',

    '.video-react-duration, .video-react-current-time': {
      fontFamily: '$sans',
    },
  }),
};
