import { readFileSync } from "node:fs"
import { join } from "node:path"

import { DOCS_DIRECTORY } from "../constants"

export function removeDocsPath(path: string) {
  // update paths based on paths.json config
  const configPath = join(DOCS_DIRECTORY, `../src/paths.json`)
  const pathsConfig = JSON.parse(readFileSync(configPath, "utf8"))
  let newPath = path
  Object.keys(pathsConfig).forEach((key) => {
    newPath = newPath.replaceAll(key, pathsConfig[key])
  })

  // handle mdbooks folders that use a same name file instead of index.md
  const paths = newPath.split("/")
  const length = paths.length - 1
  const last = paths[length].split(".")[0]
  const cat = paths[length - 1]
  if (last === cat) {
    paths.pop()
    newPath = `${paths.join("/")}/`
  }

  // move forc docs to their own section
  if (path.includes("/forc/")) {
    newPath = newPath.replace("sway/", "")
  }

  return newPath
}
