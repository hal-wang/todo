set -e

if [ -d "../todo-web/public/docs" ]; then
  rm -rf ../todo-web/public/docs
fi

mv docs/.vuepress/dist ../todo-web/public/docs