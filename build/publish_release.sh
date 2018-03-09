#!/bin/bash

rcVersion=$(grep '\"version\":' package.json | grep -c "\-rc.")
[ "$rcVersion" = "0" ] && echo "Not rc code" && exit 0

set -o errexit

newVersion=$(echo $CIRCLE_TAG | sed 's/release\-//')
git checkout master
git pull origin master

npm version $newVersion --no-git-tag-version

head -n 3 CHANGELOG.md > CHANGELOG1.md
echo >> CHANGELOG1.md
echo "<a name=\""${CIRCLE_TAG}"\"></a>" >> CHANGELOG1.md
echo "## ["${CIRCLE_TAG}"]("${CIRCLE_REPOSITORY_URL}"/releases/tag/"${CIRCLE_TAG}") ("$(date  +'%Y-%m-%d')")" >> CHANGELOG1.md
echo >> CHANGELOG1.md
echo "### Release"  >> CHANGELOG1.md
echo >> CHANGELOG1.md
echo "See details at "${CIRCLE_REPOSITORY_URL}"/releases/tag/"${CIRCLE_TAG} >> CHANGELOG1.md
echo >> CHANGELOG1.md
tail -n +4 CHANGELOG.md >> CHANGELOG1.md
mv CHANGELOG1.md CHANGELOG.md

git config --global push.default matching
git commit -a -m "chore(release): "${CIRCLE_TAG}" [ci skip]"
git tag -f -a ${CIRCLE_TAG} -m "chore(release): switching release tag for "${CIRCLE_TAG}" [ci skip]"
git push
# we need this second push to fix tag on release commit
git push -f origin ${CIRCLE_TAG}
npm publish
