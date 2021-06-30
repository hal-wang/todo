# just test

set -e

sh scripts/build.sh $1

cd ..

tcb login

tcb fn deploy $1 --force