import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import remark from 'remark';
import report from 'vfile-reporter';
import { valid } from 'semver';
import {camelCase} from 'lodash';

let regeneratorRuntime = require('regenerator-runtime');
const versionRegEx = /<a +name="(.*)">/i;


export const parse = (content) => {
    return new Promise((resolve, reject) => {
        const ast = remark.parse(content);

        let versions = ast.children.reduce((prev, curr, i) => {

            let { children: [{ type, value }] } = curr;
            if (type === 'html') {
                let [, version] = value.match(versionRegEx);
                if (version && valid(version)) {

                    let items = {};
                    let nextVersion = ast.children.slice(i + 1).findIndex(({ children: [{ type, value }] }) => {
                        return type === 'html' && value.match(versionRegEx);
                    });

                    if (nextVersion < 0) {
                        nextVersion = ast.children.length - 1;
                    } else {
                        nextVersion += i + 1;
                    }

                    for (let j = i + 1; j < nextVersion; j++) {

                        let { type: childType, depth, children: [value] } = ast.children[j];

                        if (depth === 3) {

                            const { children: [{ value: name }] } = ast.children[j];

                            const list = ast.children[j + 1];

                            items[camelCase(name)] = list.children.map(({ children: [{ children: [{ value }] }] }) => value.trim());

                        }
                        // console.log(ast.children[j]);
                    }


                    return [...prev, { version, ...items }]
                }

            }
            return [...prev];
        }, [])

        let { children: [{ children: [{ value: title }] }] } = ast;
        resolve({ title, versions });

    })
}
