import Auth from "./lib/Auth";
import "@sfajs/router";
import "@sfajs/swagger";
import SfaCloudbase from "@sfajs/cloudbase";
import Collections from "./lib/Collections";
import { swaggerJSDoc } from "@sfajs/swagger";
import * as fs from "fs";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("env", event, context);
  return await new SfaCloudbase(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.version = version;
      ctx.res.headers.demo = "todo";
      await next();
    })
    .useSwagger({
      options: swaggerOptions,
    })
    .useCloudbaseApp()
    .useCloudbaseDbhelper()
    .use(async (ctx, next) => {
      Collections.ctx = ctx;
      await next();
    })
    .useRouterParser()
    .add(() => new Auth())
    .useRouter()
    .run();
};

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();

export const swaggerOptions = <swaggerJSDoc.Options>{
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Todo",
      description:
        "一个简易的 todo 项目，包含后端和前端，详情请查看 https://todo.hal.wang/docs/",
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
        url: "/" + process.env.API_NAME,
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
  apis: ["controllers/**/*.js"],
};
