import { Startup } from "@hal-wang/cloudbase-access";
import Auth from "./lib/Auth";
import AppMiddleware from "@hal-wang/cloudbase-access-middleware-app";
import DbhelperMiddleware from "@hal-wang/cloudbase-access-middleware-dbhelper";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("env", event, context);
  return await new Startup(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.version = require("./package.json").version;
      ctx.res.headers.demo = "todo";
      await next();
    })
    .use(() => new AppMiddleware())
    .use(() => new DbhelperMiddleware())
    .useRouter({
      authFunc: () => new Auth(),
    })
    .invoke();
};
