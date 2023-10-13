/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton } from '@fuel-ui/react';
import type { ButtonLinkProps } from '@fuel-ui/react';
import { createRef, useRef, useState } from 'react';

import type { Versions } from '../pages/[...slug]';

import { SidebarLink } from './SidebarLink';
import { SidebarSubmenu } from './SidebarSubmenu';

type SectionProps = {
  links: any;
  onClick?: ButtonLinkProps['onClick'];
  book: string;
  docSlug: string | undefined;
  versions?: Versions;
};

function combineFunctions<T extends (...args: any[]) => any>(
  fn1?: T,
  fn2?: T
): T | undefined {
  if (!fn1 && !fn2) return undefined;
  if (!fn1) return fn2;
  if (!fn2) return fn1;

  return ((...args: Parameters<T>) => {
    fn1(...args);
    fn2(...args);
  }) as T;
}

// export function SidebarSection({
//   links,
//   onClick,
//   book,
//   docSlug,
// }: SectionProps) {
//   const [activeSlug, setActiveSlug] = useState('');

//   console.log('DOC SLUG:', docSlug);

//   // const allLinks: any[] = [];

//   // links.forEach((link: any) => {
//   //   if (link.submenu) {
//   //     link.submenu.forEach((subLink: any) => {
//   //       allLinks.push(subLink);
//   //     });
//   //   } else {
//   //     allLinks.push(link);
//   //   }
//   // });
//   // // eslint-disable-next-line react-hooks/rules-of-hooks
//   // const refs = allLinks.map(() => useRef<any>(null));

//   const refs = useRef<Record<string, RefObject<HTMLDivElement>>>({});

//   links.forEach((link: any) => {
//     if (link.slug) {
//       refs.current[link.slug] = createRef();
//     } else if (link.submenu) {
//       link.submenu.forEach((subLink: any) => {
//         refs.current[subLink.slug] = createRef();
//       });
//     }
//   });

//   function updateRef(slug: string) {
//     console.log('SLUG:', slug);
//     setActiveSlug(slug);
//   }

export function SidebarSection({
  links,
  onClick,
  book,
  docSlug,
}: SectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | undefined>(docSlug);
  const refs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const [isOpened, setIsOpened] = useState<boolean | undefined>(
    book === 'guides' || docSlug?.includes(book.toLowerCase())
  );
  const isGuide = book === 'guides';
  const bookHasIndex =
    book?.toLowerCase().replaceAll(/[_-]/g, ' ') ===
    links[0].label.toLowerCase().replaceAll(/[_-]/g, ' ');

  function toggle() {
    setIsOpened((s) => !s);
  }

  const allLinks: any[] = [];
  links.forEach((link: any) => {
    if (link.submenu) {
      link.submenu.forEach((subLink: any) => {
        allLinks.push(subLink);
      });
    } else {
      allLinks.push(link);
    }
  });

  allLinks.forEach((link) => {
    if (!refs.current[link.slug]) {
      refs.current[link.slug] = createRef();
    }
  });

  function updateRef(slug: string) {
    setActiveSlug(slug);
  }

  return (
    <>
      {!isGuide && (
        <Box.Flex justify={'space-between'}>
          <SidebarLink
            intent="base"
            size="md"
            onClick={onClick}
            item={{
              slug: links[0].slug,
              isExternal: false,
              label: book,
            }}
            isActiveMenu={false}
          />
          <IconButton
            size="xs"
            aria-label="Button"
            intent="base"
            variant="link"
            onClick={toggle}
            icon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
          />
        </Box.Flex>
      )}

      {(isGuide || isOpened) && (
        <Box css={styles.listContainer}>
          <Box css={styles.line} />
          <Box
            css={styles.activeLine}
            style={{
              top: `${
                refs.current[activeSlug ?? '']?.current?.offsetTop || 0
              }px`,
              height: `${
                refs.current[activeSlug ?? '']?.current?.offsetHeight || 0
              }px`,
            }}
          />
          <Box.VStack gap="0" css={styles.sectionContainer}>
            {/* {links.map((link: any, index: number) => {
              if (!bookHasIndex || index > 0) {
                if (link.slug) {
                  return (
                    <SidebarLink
                      onClick={combineFunctions(
                        () => updateRef(link.slug),
                        onClick
                      )}
                      key={link.slug}
                      item={link}
                      ref={refs.current[link.slug]}
                    />
                  );
                } else if (link.submenu) {
                  return (
                    <SidebarSubmenu
                      key={link.submenu[0].label}
                      onClick={combineFunctions(
                        () => updateRef(link.slug),
                        onClick
                      )}
                      ref={refs.current[link.submenu[0].slug]}
                      {...link}
                      submenuRefs={link.submenu.map(
                        (subLink: { slug: string | number }) =>
                          refs.current[subLink.slug]
                      )}
                      // submenuRefs={refs.slice(
                      //   index + 1,
                      //   index + 1 + link.submenu.length
                      // )}
                    />
                  );
                }
              }
            })} */}
            {links.map((link: any, index: number) => {
              if (!bookHasIndex || index > 0) {
                if (link.slug) {
                  return (
                    <SidebarLink
                      onClick={combineFunctions(
                        () => updateRef(link.slug),
                        onClick
                      )}
                      key={link.slug}
                      item={link}
                      ref={refs.current[link.slug]}
                    />
                  );
                } else if (link.submenu) {
                  return (
                    <SidebarSubmenu
                      key={link.submenu[0].slug}
                      onClick={combineFunctions(
                        () => updateRef(link.submenu[0].slug),
                        onClick
                      )}
                      {...link}
                      submenuRefs={link.submenu.map(
                        (subLink: any) => refs.current[subLink.slug]
                      )}
                    />
                  );
                }
              }
            })}
          </Box.VStack>
        </Box>
        //     {/* {version && (
        //         <Box css={{ fontSize: '$sm', padding: '20px 0 20px 0' }}>
        //           Version: {version.version}
        //         </Box>
        //       )} */}
        //   </Box.VStack>
      )}
    </>
  );
}

const styles = {
  sectionContainer: cssObj({
    pb: '$6',
    pl: '$4',
  }),
  listContainer: cssObj({
    position: 'relative',
  }),
  listItem: cssObj({
    position: 'relative',
    listStyleType: 'none',
  }),
  line: cssObj({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '10px',
    width: '1px',
    backgroundColor: '$gray8',
  }),
  activeLine: cssObj({
    position: 'absolute',
    left: '9.5px',
    width: '2px',
    backgroundColor: '$green8',
    transition: 'top 0.3s ease',
  }),
};
