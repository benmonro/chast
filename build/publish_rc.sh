#!/bin/bash

set -o errexit


npm run std-version -- --prerelease rc
git push --follow-tags origin ${CIRCLE_BRANCH}
npm publish --tag prerelease

# kick out nui-example beta every time beta package is published
curl -X POST --header "Content-Type: application/json" -d '{
 "build_parameters": {
     "DEPLOY_BUILD": "rc"
 }
}
' https://circleci.concur.com/api/v1/project/nui/nui-example/tree/master?circle-token=${NUI_EXAMPLE_BUILD_TOKEN}
