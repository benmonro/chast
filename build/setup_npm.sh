#!/bin/bash

set -o nounset
set -o errexit

npm cache clean -f 
npm config set @concur:registry=https://artifactory.concurtech.net/artifactory/api/npm/npm-release-local/
npm login --registry https://artifactory.concurtech.net/artifactory/api/npm/npm-release-local/ --scope=@concur --always-auth << !
${ARTIFACTORY_USERNAME}
${ARTIFACTORY_PASSWORD}
platform-UIInfrastructure@concur.com
!

git config --global user.email "nui-build@github.com"
git config --global user.name "nui-build"
