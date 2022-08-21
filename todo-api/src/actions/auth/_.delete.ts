import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiTags,
  ApiSecurity,
} from "@ipare/swagger";

@ApiTags("auth")
@ApiDescription(`Logout`)
@ApiResponses({
  "204": {
    description: "success",
  },
})
@ApiSecurity({
  Bearer: [],
})
export default class extends Action {
  async invoke(): Promise<void> {
    this.ctx.res.cookies.Token = {
      value: "",
      path: "/",
    };
    this.noContent();
  }
}
