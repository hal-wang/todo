import { Startup } from "@ipare/core";
import "@ipare/router";
import "@ipare/swagger";
import "@ipare/inject";
import "@ipare/filter";
import "@ipare/env";
import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@ipare/inject";
import { AuthFilter } from "./filters/auth.filter";
import { TodoFilter } from "./filters/todo.filter";
import { getVersion } from "@ipare/env";

export default <T extends Startup>(startup: T, mode: string) => {
  return startup
    .useVersion()
    .useEnv(mode)
    .useInject()
    .inject(CollectionService, InjectType.Singleton)
    .inject(DbhelperService, InjectType.Singleton)
    .inject(CbappService, InjectType.Singleton)
    .useSwagger({
      builder: (builder) =>
        builder
          .addInfo({
            title: "Todo",
            description: "一个简易的 todo 项目，包含后端和前端",
            version: getVersion(process.cwd()) ?? "",
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
          .addSecurityScheme("admin", {
            type: "apiKey",
            in: "header",
            name: "password",
          }),
    })
    .useGlobalFilter(AuthFilter)
    .useGlobalFilter(TodoFilter)
    .useRouter();
};
