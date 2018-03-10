#!/bin/bash


yarn install --production
yarn std-version
git push --follow-tags origin ${CIRCLE_BRANCH}
npm publish
