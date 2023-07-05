import { defineModule } from "@halsp/router";
import { V } from "@halsp/validator";

export default defineModule({
  prefix: "bing",
  decorators: [V.Tags("Bing")],
  deepDir: "actions",
});
