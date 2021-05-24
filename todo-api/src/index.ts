import { Response, Startup } from "@hal-wang/cloudbase-access";
import Auth from "./lib/Auth";
import AppMiddleware from "@hal-wang/cloudbase-access-middleware-app";
import DbhelperMiddleware from "@hal-wang/cloudbase-access-middleware-dbhelper";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", event, context);
  setHeaders();

  return await new Startup(event, context)
    .use(() => new AppMiddleware())
    .use(() => new DbhelperMiddleware())
    .useRouter({
      authFunc: () => new Auth(),
    })
    .invoke();
};

function setHeaders(): void {
  const config = <Record<string, unknown>>require("./package.json");
  Response.baseHeaders.version = config.version as string;
  Response.baseHeaders.demo = "todo";
}
