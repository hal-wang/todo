import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";

const tsconfigBakPath = path.join(process.cwd(), "tsconfig.bak.json");
const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsconfig = require(tsconfigBakPath);
const outDir = process.argv[2];
if (!outDir) {
  throw new Error("The outDir is needed");
}
tsconfig.compilerOptions.outDir = outDir;

const str = prettier.format(JSON.stringify(tsconfig), {
  filepath: tsconfigPath,
});
fs.writeFileSync(tsconfigPath, str);
