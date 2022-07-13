import { Startup } from "@ipare/core";
import "@ipare/router";
import "@ipare/swagger";
import "@ipare/inject";
import "@ipare/filter";
import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@ipare/inject";
import { swaggerJSDoc } from "@ipare/swagger";
import * as fs from "fs";
import { AuthFilter } from "./filters/auth.filter";
import { TodoFilter } from "./filters/todo.filter";

export default <T extends Startup>(startup: T, mode?: string) =>
  startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("version", version);
      ctx.res.setHeader("demo", "todo");
      await next();
    })
    .useInject()
    .inject(CollectionService, InjectType.Singleton)
    .inject(DbhelperService, InjectType.Singleton)
    .inject(CbappService, InjectType.Singleton)
    .useSwagger({
      docOptions: getSwaggerOptions(mode),
    })
    .useGlobalFilter(AuthFilter)
    .useGlobalFilter(TodoFilter)
    .useRouter();

function getSwaggerOptions(mode?: string) {
  return <swaggerJSDoc.Options>{
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Todo",
        description: "一个简易的 todo 项目，包含后端和前端",
        version: version,
        license: {
          name: "MIT",
        },
        contact: {
          email: "hi@hal.wang",
        },
      },
      servers: [
        {
          url: "/" + (mode == "development" ? "" : process.env.API_NAME),
        },
      ],
      schemes: ["https"],
      tags: [
        {
          name: "user",
        },
        {
          name: "todo",
        },
        {
          name: "bing",
          description: "bing images",
        },
      ],
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "Automatically generated ID",
              },
              password: {
                type: "string",
                description: "Plaintext password",
              },
              create_at: {
                type: "integer",
                format: "timestamp",
                description: "When was user created",
              },
            },
          },
          Todo: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "Automatically generated ID",
              },
              uid: {
                type: "string",
                description: "todo's owner",
              },
              content: {
                type: "string",
              },
              create_at: {
                type: "integer",
                format: "timestamp",
                description: "When was todo created",
              },
              update_at: {
                type: "integer",
                format: "timestamp",
                description: "When was todo edited",
              },
              schedule: {
                type: "integer",
                format: "timestamp",
              },
            },
          },
        },
        securitySchemes: {
          password: {
            type: "apiKey",
            in: "header",
            name: "password",
          },
        },
        parameters: {
          headerAccount: {
            in: "header",
            required: true,
            name: "account",
            schema: {
              type: "string",
            },
          },
          queryAccount: {
            in: "path",
            required: true,
            name: "account",
            schema: {
              type: "string",
            },
          },
          queryTodo: {
            in: "path",
            required: true,
            name: "todoId",
            schema: {
              type: "string",
            },
          },
          page: {
            in: "query",
            required: false,
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          limit: {
            in: "query",
            required: false,
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
              default: 20,
            },
          },
        },
      },
    },
    apis: ["actions/**/*.js"],
  };
}

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();
