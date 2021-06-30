set -e

ts-node scripts/changeOutDir.ts ./dist/$1

npm run sfa-router-build