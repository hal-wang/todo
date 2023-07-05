import { defineModule } from "@halsp/router";
import { V } from "@halsp/validator";

export default defineModule({
  prefix: "user",
  decorators: [V.Tags("User")],
  deepDir: "actions",
});
