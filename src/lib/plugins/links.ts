import { readFileSync } from "node:fs"
import { join } from "node:path"
import { DOCS_DIRECTORY } from "~/src/constants"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleLinks(node: any, dirname: string) {
  let newUrl: string | null = null
  if (!node.url.includes("http")) {
    newUrl = node.url
      .replace(".md", "")
      .replace("/index", "")
      .replace(".html", "")

    const configPath = join(DOCS_DIRECTORY, `../src/paths.json`)
    const pathsConfig = JSON.parse(readFileSync(configPath, "utf8"))

    let dir = dirname
    Object.keys(pathsConfig).forEach((key) => {
      dir = dir.replaceAll(key, pathsConfig[key])
    })

    if (node.url.startsWith("../")) {
      const folder = dirname.split("/").pop()
      newUrl = `/${dir.replace(folder!, "")}${newUrl!.replace("../", "")}`
    } else if (node.url.startsWith("./") && !node.url.includes("index")) {
      newUrl = `/${dir.endsWith("/") ? dir : `${dir}/`}${newUrl!.replace(
        "./",
        ""
      )}`
    } else if (/^[a-zA-Z]/.test(node.url)) {
      newUrl = `/${dir}/${newUrl}`
    }
    newUrl = newUrl!.replace("/sway/forc/", "/forc/")
  } else if (
    node.url.endsWith("CONTRIBUTING") &&
    node.url.includes("github.com")
  ) {
    newUrl = `${node.url}.md`
  }
  return newUrl
}
