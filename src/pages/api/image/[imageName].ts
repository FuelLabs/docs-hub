import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { VersionSet } from '~/src/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageName } = req.query;
    if (!imageName || typeof imageName === 'undefined') {
      res.status(500).end();
    } else {
      const rootDir = process.cwd();
      const realName =
        typeof imageName === 'string'
          ? imageName!.replaceAll('&&', '/')
          : imageName[0];

      let versionSet: VersionSet = 'default';
      if (req.headers.referer?.includes('/nightly/')) {
        versionSet = 'nightly';
      } else if (req.headers.referer?.includes('/beta-4/')) {
        versionSet = 'beta-4';
      }
      const imagePath = `${rootDir}/docs/${
        versionSet === 'default' ? '' : versionSet
      }fuels-wallet/packages/docs/public/${realName}.png`;

      if (fs.existsSync(imagePath)) {
        res.setHeader('Content-Type', 'image/png');
        fs.createReadStream(imagePath).pipe(res);
      } else {
        res.status(500).end();
      }
    }
  } catch (e) {
    res.json(e);
    res.status(500).end();
  }
}
