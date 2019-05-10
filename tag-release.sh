#!/bin/bash
TAG=${1:-facelift_demo}

if git rev-parse ${TAG}

then
    git tag -d ${TAG} && git push --delete origin ${TAG}
else
    echo "Tag not found"
fi

git tag ${TAG} && git push origin ${TAG}