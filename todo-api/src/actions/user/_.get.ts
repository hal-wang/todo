import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiTags,
  ApiSecurity,
} from "@ipare/swagger";
import { UserService } from "../../services/user.service";
import { Account } from "../../decorators/account";

@ApiTags("user")
@ApiDescription(`Get user info`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "object",
        },
      },
    },
  },
})
@ApiSecurity({
  Bearer: [],
})
export default class extends Action {
  @Inject
  private readonly userService!: UserService;

  @Account
  private readonly account!: string;

  async invoke(): Promise<void> {
    const user = await this.userService.getUser(this.account);
    this.ok({
      ...user,
      password: undefined,
    });
  }
}
