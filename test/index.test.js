import {parse} from '../src';
import find from 'unist-util-find';
import parents from 'unist-util-parents';


const simpleChangeLog = `
# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="8.2.0"></a>
# [8.2.0](https://github.com/bmonro/chast/compare/v8.2.0-rc.2...v8.2.0) (2018-02-23)


### Features

* Added a cool button [#179](https://github.com/bmonro/chast) [210f4fa](https://github.com/bmonro/chast/commit/210f4fa)



<a name="8.2.0-rc.2"></a>
# [8.2.0-rc.2](https://github.com/bmonro/chast/compare/v8.2.0-rc.1...v8.2.0-rc.2) (2018-02-21)


### Bug Fixes

* removed typeo from button text. [#178](https://github.com/bmonro/chast/issues/178) ([cc9ca61](https://github.com/bmonro/chast/commit/cc9ca61))

<a name="8.0.0-rc.0"></a>
# [8.0.0-rc.0](https://github.com/benmonro/chast/compare/v7.6.0-rc.1...v8.0.0-rc.0) (2018-01-11)


### Features

* static assets from multiple CDNs. ([#164](https://github.com/benmonro/chast/commit/7d32d77))


### BREAKING CHANGES

* UPDATED/REMOVED environment variables.
* feat: introducing NUI_USELOCALASSETSERVER env var to control how page requests shared assets ()part of s3 china sync work)

* work in progress

* no baseUrl in assets.json. Introducing getPublicPath

* remove commented code

* add __webpack_public_path__ as global var for jest to avoid jest failures

* removing getLessCdnUrl dependency

* do not use getLessCdnUrl  from ui-assets, use getCssUrl from nui-shell.

* updating package-lock.js
`;

describe("index", () => {
    let result;
    beforeEach(async()=> {
        result = parents(await parse(simpleChangeLog));
        return result;
    });
    test('exports parser', () => {
        expect(parse).toBeDefined();
    });

    test('returns title',  () => {
        const {title} = result;
        expect(title).toBe('Change Log');
    });

    test('returns 8.2.0 in first version', () => {
        const version = find(result, {type: 'versionEntry'});

        expect(version.semver).toBe("8.2.0");
    });

    test('returns Features in first version', () => {
        const {children:[firstChange]} = result;
        expect(firstChange.children.length).toBe(1);
        expect(find(firstChange, {type: "changeItem"}).text).toEqual('Added a cool button');
    });

    test('returns bug fixes in 2nd version',() => {
        const bugFixes = find((result), {type:'bugFixes'});
        expect(bugFixes.children.length).toBe(1);
        expect(bugFixes.children[0].text).toEqual('removed typeo from button text.');
    });


    test('returns breaking changes and features in 3rd version', () => {
        let breakingChanges = find(result, {type:"breakingChanges"});
        let features = find(breakingChanges.parent, {type:"features"});
        expect(features.children.length).toBe(1);
        expect(breakingChanges.children.length).toBe(9);
    });
})
