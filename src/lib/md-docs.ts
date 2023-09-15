import type { MdDoc } from '../../.contentlayer/generated/types';

export class Docs {
  static getAllPaths(mdDocs: MdDoc[]) {
    const paths = mdDocs
      .map((doc) => {
        const path = doc.slug;
        let slug = path.split('/').filter((s) => s.length);

        if (slug.length === 1) {
          return null;
        }
        if (slug.slice(-1)[0] === 'index') {
          slug = slug.slice(0, -1);
        }

        return {
          params: {
            slug,
            path,
          },
        };
      })
      .filter(Boolean);

    return Array.from(new Set(paths));
  }

  static findDoc(slug: string[], mdDocs: MdDoc[]) {
    const path = slug.join('/');

    // if (slug.includes('guides')) {
    //   console.log('PATH:', path);
    // }
    const item = mdDocs.find((doc) => {
      return (
        doc.slug === path ||
        doc.slug === `${path}/index` ||
        doc.slug === `${path}/`
      );
    });

    if (!item) {
      throw new Error(`${slug} not found`);
    }

    return item;
  }
}
