import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, ButtonLink } from '@fuel-ui/react';
import { useDocContext } from '~/src/hooks/useDocContext';

import { styles as buttonStyles } from './Sidebar';
import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

interface DocSidebarProps {
  onClick?: ButtonLinkProps['onClick'];
}

export function DocSidebar({ onClick }: DocSidebarProps) {
  const ctx = useDocContext();
  const { links, doc, versions } = ctx;
  const version =
    doc && doc.docsConfig ? versions[doc.docsConfig.title]?.version : null;

  return (
    links && (
      <Box.Stack as="nav" css={styles.root} className="Sidebar">
        {doc.parent && (
          <ButtonLink
            href={doc.parent.link}
            intent={'base'}
            leftIcon={'ArrowNarrowLeft'}
            css={buttonStyles.button}
            size={'sm'}
          >
            {doc.parent.label}
          </ButtonLink>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {links.map((link: any, index: number) => {
          return link.slug ? (
            <Box key={link.slug}>
              <SidebarLink onClick={onClick} item={link} />
            </Box>
          ) : (
            <SidebarSubmenu
              onClick={onClick}
              key={link.subpath ? link.subpath + index : index}
              {...link}
            />
          );
        })}
        {version && (
          <Box css={{ fontSize: '$sm', padding: '20px 0 60px 0' }}>
            Version: {version}
          </Box>
        )}
      </Box.Stack>
    )
  );
}

const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
    lineHeight: '1.3',
  }),
};
