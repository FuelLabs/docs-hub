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
      const walletPath = 'fuels-wallet/packages/docs';
      const tsPath = 'fuels-ts/apps/docs/src';
      const imagePath = `${rootDir}/docs/${
        versionSet === 'default' ? '' : versionSet
      }/${
        req.headers.referer?.includes('/fuels-ts/') ? tsPath : walletPath
      }/public/${realName}.png`;

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
