import { defineModule } from "@halsp/router";
import { V } from "@halsp/validator";

export default defineModule({
  prefix: "auth",
  decorators: [V.Tags("Auth")],
  deepDir: "actions",
});
