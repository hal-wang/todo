import Auth from "./lib/Auth";
import "@sfajs/router";
import "@sfajs/cloudbase";
import SfaCloudbase from "@sfajs/cloudbase";
import Collections from "./lib/Collections";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("env", event, context);
  return await new SfaCloudbase(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.version = require("./package.json").version;
      ctx.res.headers.demo = "todo";

      await next();
    })
    .useCloudbaseApp()
    .useCloudbaseDbhelper()
    .use(async (ctx, next) => {
      Collections.ctx = ctx;
      await next();
    })
    .useRouter({
      authFunc: () => new Auth(),
    })
    .run();
};

function getPairs<T>(map: unknown): { key: string; value: T }[] {
  if (!map) return [];

  return Object.keys(map as Record<string, T>[]).map((key) => ({
    key: key,
    value: (map as Record<string, T>)[key],
  }));
}
