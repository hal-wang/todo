import "@halsp/router";
import "@halsp/swagger";
import "@halsp/inject";
import "@halsp/filter";
import "@halsp/env";
import "@halsp/jwt";
import "@halsp/validator";
import "@halsp/logger";
import "@halsp/static";
import "@halsp/lambda";
import { InjectType } from "@halsp/inject";
import { getVersion } from "@halsp/env";
import { Startup } from "@halsp/core";

import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { AuthFilter } from "./filters/auth.filter";
import { TodoFilter } from "./filters/todo.filter";

import type native from "@halsp/native";
import type body from "@halsp/body";

const startup = new Startup()
  .useHttp()
  .call(
    () => process.env.NODE_ENV != "local",
    (_) => _.useLambda()
  )
  .call(
    () => process.env.NODE_ENV == "local",
    (_) => {
      require("@halsp/native");
      require("@halsp/body");
      _.useNative({
        port: 9504,
      });
    }
  )
  .use(async (ctx, next) => {
    ctx.res.set("version", (await getVersion()) ?? "");
    await next();
  })
  .useEnv()
  .useInject()
  .inject(CollectionService, InjectType.Singleton)
  .inject(DbhelperService, InjectType.Singleton)
  .inject(CbappService, InjectType.Singleton)
  .useConsoleLogger()
  .use(async (ctx, next) => {
    const logger = await ctx.getLogger();
    logger.info("event: " + JSON.stringify(ctx.lambdaEvent));
    logger.info("context: " + JSON.stringify(ctx.lambdaContext));
    await next();
  })
  .useSwagger({
    path: "swagger",
    builder: async (builder) =>
      builder
        .addInfo({
          title: "Todo",
          description: "一个简易的 todo 项目，包含后端和前端",
          version: (await getVersion(process.cwd())) ?? "",
          license: {
            name: "MIT",
          },
          contact: {
            email: "hi@hal.wang",
          },
        })
        .addServer({
          url: "/",
        })
        .addSecurityScheme("Bearer", {
          type: "http",
          description:
            'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
          scheme: "Bearer",
          bearerFormat: "JWT",
        }),
  })
  .useValidator()
  .useJwt({
    secret: process.env.JWT_SECRET,
  })
  .useGlobalFilter(AuthFilter)
  .useGlobalFilter(TodoFilter)
  .useRouter()
  .useStatic({
    dir: "web",
    listDir: false,
    useIndex: true,
    method: "GET",
    use404: true,
    useExt: true,
  })
  .call(
    () => process.env.NODE_ENV == "local",
    (_) => _.listen()
  );

export const main = (e: any, c: any) => startup.run(e, c);
