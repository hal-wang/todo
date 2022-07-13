import { HttpContext } from "@ipare/core";
import { AuthorizationFilter } from "@ipare/filter";
import { Inject } from "@ipare/inject";
import { UserService } from "../services/user.service";
import { adminId } from "../global";

export class AuthFilter implements AuthorizationFilter {
  @Inject
  private readonly userService!: UserService;

  async onAuthorization(ctx: HttpContext): Promise<boolean> {
    const open: boolean | undefined = ctx.actionMetadata.open;
    if (open) {
      return true;
    }
    if (!ctx.actionMetadata.roles || !ctx.actionMetadata.roles.length) {
      return true;
    }

    const account = ctx.req.headers.account as string;
    const password = ctx.req.headers.password as string;
    if (
      !account ||
      !password ||
      !(await this.userService.existUser(account, password))
    ) {
      ctx.forbiddenMsg({ message: "error account or password" });
      return false;
    }

    const admin: boolean = ctx.actionMetadata.admin;
    if (admin && account != adminId) {
      ctx.forbiddenMsg({ message: "not admin" });
      return false;
    }

    return true;
  }
}
