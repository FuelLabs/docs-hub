import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageName } = req.query
    if (!imageName || typeof imageName === "undefined") {
      res.status(500).end()
    } else {
      const rootDir = process.cwd()
      const realName =
        typeof imageName === "string"
          ? imageName!.replaceAll("&&", "/")
          : imageName[0]

      const imagePath = `${rootDir}/docs/fuels-wallet/packages/docs/public/${realName}.png`

      if (fs.existsSync(imagePath)) {
        res.setHeader("Content-Type", "image/png")
        fs.createReadStream(imagePath).pipe(res)
      } else {
        res.status(500).end()
      }
    }
  } catch (e) {
    res.json(e)
    res.status(500).end()
  }
}
