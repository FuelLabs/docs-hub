import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { globby } from 'globby';
import { cwd } from 'process';

const pathsAndUrls = new Map([
  [
    join(cwd(), 'docs/fuels-ts/apps/docs/src'),
    'https://fuels-ts-docs-api.vercel.app',
  ],
  [
    join(cwd(), 'docs/nightly/fuels-ts/apps/docs/src'),
    'https://fuels-ts-docs-api-nightly.vercel.app',
  ],
]);

for (const [docsPath, url] of pathsAndUrls) {
  const filepaths = await globby(['**.md'], {
    cwd: docsPath,
  });

  filepaths.forEach((filepath) => {
    const path = join(docsPath, filepath);
    const file = readFileSync(path).toString();

    writeFileSync(path, file.replace(/DOCS_API_URL/g, url));
  });
}
