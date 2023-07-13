import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { videoName } = req.query
    if (!videoName || typeof videoName === "undefined") {
      res.status(500).end()
    } else {
      const rootDir = process.cwd()
      const realName =
        typeof videoName === "string"
          ? videoName!.replaceAll("&&", "/")
          : videoName[0]
      const videoPath = `${rootDir}/docs/fuels-wallet/packages/docs/public/${realName}.mp4`

      if (fs.existsSync(videoPath)) {
        res.setHeader("Content-Type", "video/mp4")
        fs.createReadStream(videoPath).pipe(res)
      } else {
        res.status(500).end()
      }
    }
  } catch (e) {
    res.json(e)
    res.status(500).end()
  }
}
