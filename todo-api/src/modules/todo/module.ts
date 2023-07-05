import { defineModule } from "@halsp/router";
import { V } from "@halsp/validator";

export default defineModule({
  prefix: "todo",
  decorators: [V.Tags("Todo")],
  deepDir: "actions",
});
