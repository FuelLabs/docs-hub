/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Root } from 'remark-gfm';
import type { Highlighter } from 'shiki';
import { visit } from 'unist-util-visit';

function getLangFromNode(node: any) {
  if (node.type === 'mdxJsxFlowElement') {
    return node.attributes.find((attr: any) => attr.name === '__language')
      ?.value;
  }
  const lang = node.lang?.includes(',') ? node.lang.split(',')[0] : node.lang;
  return lang === 'sway' ? 'rust' : lang;
}

function getValueFromNode(node: any) {
  if (node.type === 'mdxJsxFlowElement') {
    return node.attributes.find((attr: any) => attr.name === '__content')
      ?.value;
  }
  return node.value;
}

function setValueOnNode(node: any, cb: (value: string) => string) {
  if (node.type === 'mdxJsxFlowElement') {
    const idx = node.attributes.findIndex(
      (attr: any) => attr.name === '__content',
    );
    if (idx !== -1) {
      const value = node.attributes[idx].value;
      node.attributes.push({ ...node.attributes[idx], value: cb(value) });
      return;
    }
    return;
  }
  node.value = cb(node.value);
  return;
}

function addIndexToLines(html: string, idx = 0) {
  const match = html.matchAll(/<span class="line">(?<inner>.*)<\/span>/g);
  const m = match.next().value;
  if (m) {
    const inner = m.groups?.inner ?? '';
    const start = m.index ?? 0;
    const end = start + m[0].length;
    const line = html.slice(start, end);
    const lineNum = `<span class="linenumber">${idx + 1}</span>`;
    const rest = `<span class="line code">${inner}</span>`;
    html = html.replace(line, `${lineNum}${rest}`);
    return addIndexToLines(html, idx + 1);
  }
  return html;
}

export function codeHighlight(highlighter: Highlighter, fullpath: string) {
  const isSway = fullpath.includes('sway');
  const isFuelsTs = fullpath.includes('fuels-ts');
  return () =>
    function transformer(tree: Root) {
      visit(tree, '', (node: any) => {
        if (!node) return;

        if (['code', 'mdxJsxFlowElement'].includes(node.type)) {
          const lang = getLangFromNode(node);
          const value = getValueFromNode(node);
          if (!value) return;

          setValueOnNode(node, (value) => {
            if (
              node.type === 'code' &&
              ['rust', 'ts', 'typescript'].includes(lang)
            ) {
              const lines = value.split('\n');
              const newLines = lines
                // parsing code tabs/spaces in Fuels-TS code blocks
                .map((line: string) => {
                  if (isSway) {
                    return line.replace(/\s{4}/g, '\t');
                  }
                  return line;
                })
                .map((line: string) => {
                  if (!isFuelsTs) return line;
                  return line.replace(/\s{4}/g, '\t').replace(/^\t/g, '');
                })
                // parsing code blocks with 8 spaces indentation
                .map((line: string) => {
                  if (isSway) return line;
                  if (line.match(/^\s{8}/)) {
                    return line.replace(/^\s{8}/, '');
                  }
                  return line;
                })
                // parsing code blocks with 2 spaces indentation
                .map((line: string) => {
                  if (isSway) return line;
                  if (line.match(/^\s{2}([^\s].*)/)) {
                    return line.replace(/^\s{2}/, '\t');
                  }
                  return line;
                })
                .join('\n');

              value = newLines;
            }

            let html = '';
            try {
              html = highlighter.codeToHtml(value, { lang });
            } catch (err) {
              console.log(err);
              html = value;
            }

            return JSON.stringify({
              __isHighlight: true,
              raw: value,
              html: addIndexToLines(html),
            });
          });
        }
      });
    };
}
