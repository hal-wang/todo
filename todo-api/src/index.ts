import { LambdaStartup } from "@halsp/lambda";
import startup from "./startup";

const app = startup(new LambdaStartup(), "production");
export const main = (event, context) => app.run(event, context);
