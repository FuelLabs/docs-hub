/* eslint-disable @typescript-eslint/no-explicit-any */
import { EOL } from "os"
import type { Root } from "remark-gfm"

export function handleScriptLink(
  tree: Root,
  versions: {
    FORC: string
    FUELS: string
    FUEL_CORE: string
  }
) {
  let url = ""
  let paragraphIndex
  let linkStartIndex
  const newTree = tree as any
  const firstNode = tree.children[0] as any
  const lines = firstNode.value.split(EOL)
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart()
    if (trimmed.startsWith("http")) {
      url = trimmed.replace("${forc}", versions.FORC)
    }
  }
  if (url !== "") {
    for (let i = 1; i < tree.children.length; i++) {
      const node = tree.children[i] as any
      if (node.type === "paragraph" && node.children) {
        paragraphIndex = i
        for (let idx = 1; idx < node.children.length; idx++) {
          const el = node.children[idx]
          if (el.type === "html" && el.value.includes(':href="url"')) {
            linkStartIndex = idx
          }
        }
        break
      }
      if (paragraphIndex && linkStartIndex) {
        const linkNode =
          newTree.children[paragraphIndex].children[linkStartIndex]
        linkNode.type = "link"
        linkNode.title = null
        linkNode.url = url
        linkNode.value = null
        linkNode.children = [
          newTree.children[paragraphIndex].children[linkStartIndex + 1],
        ]
        newTree.children[paragraphIndex].children[linkStartIndex] = linkNode
        newTree.children[paragraphIndex].children.splice(
          linkStartIndex + 1,
          linkStartIndex + 2
        )
      }
    }
  }
  return newTree
}
