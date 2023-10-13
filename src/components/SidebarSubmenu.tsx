import { cssObj } from '@fuel-ui/css';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { Box, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState, useEffect, forwardRef } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

interface SidebarSubmenuProps extends SidebarLinkItem {
  onClick?: ButtonLinkProps['onClick'];
  submenuRefs: React.RefObject<HTMLDivElement>[];
}

export const SidebarSubmenu = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: SidebarSubmenuProps, ref: any) => {
    const pathname = usePathname();
    const [isOpened, setIsOpened] = useState<boolean>();
    const thisItem = {
      label: props.label,
      slug: props.submenu![0].slug,
      isExternal: props.isExternal,
    };

    useEffect(() => {
      if (pathname.includes('/guides/')) {
        setIsOpened(true);
      } else {
        const actualSlug = `/${thisItem.slug}/`;
        const active = pathname.startsWith(actualSlug);
        setIsOpened(active);
      }
    }, [pathname]);

    return (
      <Box.Flex css={styles.root}>
        <SidebarLink
          intent="base"
          onClick={props.onClick}
          item={thisItem}
          isActiveMenu={isOpened}
          ref={ref}
        />
        {isOpened && (
          <List css={styles.list}>
            {props.submenu?.map((item, index) => (
              <List.Item key={index}>
                <SidebarLink
                  onClick={props.onClick}
                  item={item}
                  data-submenu
                  ref={props.submenuRefs[index]}
                />
              </List.Item>
            ))}
          </List>
        )}
      </Box.Flex>
    );
  }
);

// export const SidebarSubmenu = forwardRef(function SidebarSubmenu(
//   {
//     label,
//     isExternal,
//     hasIndex,
//     submenu,
//     onClick,
//     submenuRefs,
//   }: SidebarSubmenuProps,
//   ref
// ) {

//   return (
//     <Box.Flex css={styles.root}>
//       <SidebarLink
//         intent="base"
//         onClick={onClick}
//         item={thisItem}
//         isActiveMenu={isOpened}
//         ref={ref}
//       />

//       {isOpened && (
//         <List css={styles.list}>
//           {submenu?.map((item, index) => {
//             if (!hasIndex || index > 0) {
//               return (
//                 <List.Item key={index}>
//                   <SidebarLink
//                     onClick={onClick}
//                     item={item}
//                     data-submenu
//                     ref={submenuRefs[index]}
//                   />
//                 </List.Item>
//               );
//             }
//           })}
//         </List>
//       )}
//     </Box.Flex>
//   );
// });

const styles = {
  root: cssObj({
    flexDirection: 'column',
  }),
  list: cssObj({
    pl: '$4',
  }),
};
