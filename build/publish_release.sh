#!/bin/bash


npm install --production
npm run std-version
git push --follow-tags origin ${CIRCLE_BRANCH}
npm publish
