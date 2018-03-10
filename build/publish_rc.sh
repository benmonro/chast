#!/bin/bash

set -o errexit

yarn install --production
yarn std-version --prerelease beta
git push --follow-tags origin ${CIRCLE_BRANCH}
npm publish --tag prerelease

