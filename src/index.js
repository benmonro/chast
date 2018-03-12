import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import remark from "remark";
import report from "vfile-reporter";
import { valid } from "semver";
import { camelCase } from "lodash";
import find from "unist-util-find";
import findAfter from "unist-util-find-after";
import findAllBetween from "unist-util-find-all-between";
import findAllAfter from "unist-util-find-all-after";
import visitChildren from "unist-util-visit-children";
import parents from 'unist-util-parents';
import { isLink, isHtml, isList } from "remark-helpers";
import inspect from "unist-util-inspect";
import u from 'unist-builder';

let regeneratorRuntime = require("regenerator-runtime");
const versionRegEx = /<a +name="(.*)">/i;

const isVersionLink = node => {
  if (!node.children || node.children.length == 0) {
    return false;
  }
  let child = node.children[0];
  return isHtml(child) && child.value.match(versionRegEx);
};
export const parse = content => {
    const ast = parents(remark.parse(content));
    let versions = [];
    let currVersion = find(ast, isVersionLink);
    do {
      let nextVersion = findAfter(ast, currVersion, isVersionLink);

      let [, version] = currVersion.children[0].value.match(versionRegEx);

      let nodesBetween;

      if (nextVersion === null) {
        nodesBetween = [currVersion, ...findAllAfter(ast, currVersion)];
      } else {
        nodesBetween = findAllBetween(
          ast,
          currVersion,
          nextVersion || ast.children[ast.children.length - 1]
        );
      }
      let categories = {};
      for (let i = 2; i < nodesBetween.length; i += 2) {
        const category = (nodesBetween[i].children[0].value);
        let list = [];
        const nextNode = nodesBetween[i + 1];
        if (nextNode && isList(nextNode)) {
          const visit = visitChildren(node => {
            let textNode = find(node, { type: "text" });
            let rest = findAllAfter(textNode.parent, textNode);
            let text = textNode.value.trim();
            
            if(text.endsWith('(')) {
              rest = [u('text', {value:'('}), ...rest];
              text = text.slice(0,-1);
            }
            list.push(u('changeItem',{text}, rest));
          });
          visit(nextNode);
        }
        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(...list);
      }
      versions.push(
          u('versionEntry', {semver:version}, Object.keys(categories).map(category => u(camelCase(category),{text:category}, categories[category])))
      );

      currVersion = nextVersion;
    } while (currVersion);

    let { children: [{ children: [{ value: title }] }] } = ast;

    return u('changeLog', {title}, versions);

    

};
