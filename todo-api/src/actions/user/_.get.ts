import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { V } from "@ipare/validator";
import { UserService } from "../../services/user.service";
import { Account } from "../../decorators/account";

@V()
  .Tags("user")
  .Summary(`Get user info`)
  .ResponseDescription(200, "success")
  .Security({
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
