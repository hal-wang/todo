set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi
mkdir ./dist

tsc

find dist -name "*.d.ts" |xargs rm -rf

if [ ! -d "../todo-docs/docs/api" ]; then
  mkdir ../todo-docs/docs/api
fi

cba-doc dist/controllers ../todo-docs/docs/api/README.md docConfigs/base.json
rm -rf dist