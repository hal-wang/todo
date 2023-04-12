import { Context } from "@halsp/core";
import { AuthorizationFilter } from "@halsp/filter";
import { Inject } from "@halsp/inject";
import { UserService } from "../services/user.service";
import { adminId } from "../global";
import { Account } from "../decorators/account";

export class AuthFilter implements AuthorizationFilter {
  @Inject
  private readonly userService!: UserService;
  @Account
  private readonly account!: string;

  async onAuthorization(ctx: Context): Promise<boolean> {
    const open: boolean | undefined = ctx.actionMetadata.open;
    if (open) {
      return true;
    }
    if (!ctx.actionMetadata.roles || !ctx.actionMetadata.roles.length) {
      return true;
    }

    if (!this.account) {
      ctx.res.forbiddenMsg();
      return false;
    }

    if (!this.account || !(await this.userService.existUser(this.account))) {
      ctx.res.notFoundMsg({ message: "The account is not existing" });
      return false;
    }

    const admin: boolean = ctx.actionMetadata.admin;
    if (admin && this.account != adminId) {
      ctx.res.forbiddenMsg({ message: "Not admin" });
      return false;
    }

    return true;
  }
}
