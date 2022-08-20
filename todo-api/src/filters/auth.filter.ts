import { HttpContext } from "@ipare/core";
import { AuthorizationFilter } from "@ipare/filter";
import { Inject } from "@ipare/inject";
import { UserService } from "../services/user.service";
import { adminId } from "../global";
import { Account } from "../decorators/account";

export class AuthFilter implements AuthorizationFilter {
  @Inject
  private readonly userService!: UserService;
  @Account
  private readonly account!: string;

  async onAuthorization(ctx: HttpContext): Promise<boolean> {
    const open: boolean | undefined = ctx.actionMetadata.open;
    if (open) {
      return true;
    }
    if (!ctx.actionMetadata.roles || !ctx.actionMetadata.roles.length) {
      return true;
    }

    if (!this.account) {
      ctx.forbiddenMsg();
      return false;
    }

    if (!this.account || !(await this.userService.existUser(this.account))) {
      ctx.notFoundMsg({ message: "The account is not existing" });
      return false;
    }

    const admin: boolean = ctx.actionMetadata.admin;
    if (admin && this.account != adminId) {
      ctx.forbiddenMsg({ message: "Not admin" });
      return false;
    }

    return true;
  }
}
