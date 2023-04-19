import "@halsp/router";
import "@halsp/swagger";
import "@halsp/inject";
import "@halsp/filter";
import "@halsp/env";
import "@halsp/jwt";
import "@halsp/validator";
import "@halsp/logger";
import "@halsp/static";
import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@halsp/inject";
import { AuthFilter } from "./filters/auth.filter";
import { TodoFilter } from "./filters/todo.filter";
import { getVersion } from "@halsp/env";
import { HttpStartup } from "@halsp/http";

export default <T extends HttpStartup = HttpStartup>(startup: T) => {
  return startup
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
          ctx.res.unauthorizedMsg("Please login");
        } else {
          ctx.res.unauthorizedMsg(err.message);
        }
      }
    )
    .useGlobalFilter(AuthFilter)
    .useGlobalFilter(TodoFilter)
    .useRouter()
    .useStatic({
      dir: "web",
      listDir: false,
      useIndex: true,
      method: "GET",
      useExt: true,
      use404: true,
    });
};
