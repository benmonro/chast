[![npm][npm-img]][npm-url] [![CircleCI](https://circleci.com/gh/benmonro/chast.svg?style=svg)](https://circleci.com/gh/benmonro/chast)[![downloads][downloads-img]][npm-url]

semver and standard-version based changelog parser using remark.

[npm-img]: https://img.shields.io/npm/v/chast.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/chast
[downloads-img]: https://img.shields.io/npm/dm/chast.svg?style=flat-square

## Install

```
yarn install chast
```

## Usage

This module exports a single function. It supports both callbacks and promises.

```js
    import {parse} from 'chast';
    
    const changeLog = parse(`
# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


<a name="1.4.0"></a>
# 1.4.0 (2018-03-09)


### Bug Fixes

* migrated to 2.0 circle ([95a00c9](https://github.com/benmonro/chast/commit/95a00c9))
* moved circle to .circle folder ([677f46e](https://github.com/benmonro/chast/commit/677f46e))


### Features

* suport for simple changelog ([b925ca7](https://github.com/benmonro/chast/commit/b925ca7))
    `);

    const {versions} = changeLog;
    
    console.log(versions);
```

