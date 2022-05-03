import { UserAuthMiddleware } from "./middlewares/user-auth.middleware";
import "@sfajs/router";
import "@sfajs/swagger";
import "@sfajs/inject";
import { SfaCloudbase } from "@sfajs/cloudbase";
import { swaggerJSDoc } from "@sfajs/swagger";
import * as fs from "fs";
import { CollectionService } from "./services/collection.service";
import { DbhelperService } from "./services/dbhelper.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@sfajs/inject";
import { Startup } from "@sfajs/core";
import * as dotenv from "dotenv";
import { TodoAuthMiddleware } from "./middlewares/todo-auth.middleware";

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();

function getSwaggerOptions(dev: boolean) {
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
          url: "/" + (dev ? "" : process.env.API_NAME),
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
    apis: dev ? ["src/actions/**/*.ts"] : ["actions/**/*.js"],
  };
}

export function setStartup<T extends Startup>(startup: T, dev: boolean): T {
  if (dev) {
    dotenv.config({
      path: "./.env.local",
    });
  }

  return startup
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
      options: getSwaggerOptions(dev),
    })
    .add(UserAuthMiddleware)
    .add(TodoAuthMiddleware)
    .useRouter({
      dir: dev ? "src/actions" : "actions",
    });
}

const startup = setStartup(new SfaCloudbase(), false);
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", JSON.stringify(event));
  console.log("context", JSON.stringify(context));

  return await startup.run(event, context);
};
