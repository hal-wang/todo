import { Startup } from "@ipare/core";
import "@ipare/router";
import "@ipare/swagger";
import "@ipare/inject";
import "@ipare/filter";
import "@ipare/env";
import "@ipare/jwt";
import "@ipare/validator";
import "@ipare/logger";
import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@ipare/inject";
import { AuthFilter } from "./filters/auth.filter";
import { TodoFilter } from "./filters/todo.filter";
import { getVersion } from "@ipare/env";

export default <T extends Startup = Startup>(startup: T, mode: string) => {
  return startup
    .useVersion()
    .useEnv(mode)
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
      path: "",
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
            url: "/" + (mode == "production" ? process.env.API_NAME : ""),
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
    .useRouterParser()
    .useJwtVerify(
      (ctx) => {
        if (!ctx.actionMetadata || ctx.actionMetadata.open) {
          return true;
        }
        return false;
      },
      (ctx, err) => {
        if (!ctx.jwtToken) {
          ctx.unauthorizedMsg("Please login");
        } else {
          ctx.unauthorizedMsg(err.message);
        }
      }
    )
    .useGlobalFilter(AuthFilter)
    .useGlobalFilter(TodoFilter)
    .useRouter();
};
