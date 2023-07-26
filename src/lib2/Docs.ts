import { allMdDocs } from 'contentlayer/generated';

export class Docs {
  static getAllPaths() {
    return allMdDocs.map((doc) => {
      const path = doc.slug;
      const slug = path.split('/');
      return {
        params: {
          slug,
          path,
        },
      };
    });
  }
}
