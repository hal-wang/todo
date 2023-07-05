import { Context } from "@halsp/core";
import { AuthorizationFilter } from "@halsp/filter";
import { Inject } from "@halsp/inject";
import { UserService } from "../services/user.service";
import { adminId } from "../global";
import { getAccountFromToken } from "../decorators/account";
import { JwtService } from "@halsp/jwt";

export class AuthFilter implements AuthorizationFilter {
  @Inject
  private readonly userService!: UserService;
  @Inject
  private readonly jwtService!: JwtService;

  async onAuthorization(ctx: Context): Promise<boolean> {
    if (!ctx.actionMetadata || ctx.actionMetadata.open) {
      return true;
    }

    if (!ctx.jwtToken) {
      ctx.res.unauthorizedMsg("Please login");
      return false;
    }

    try {
      await this.jwtService.verify();
    } catch (err) {
      const error = err as Error;
      ctx.res.unauthorizedMsg(error.message);
      return false;
    }

    const account = await getAccountFromToken(ctx);
    if (!account) {
      ctx.res.forbiddenMsg();
      return false;
    }

    if (!(await this.userService.existUser(account))) {
      ctx.res.notFoundMsg({ message: "The account is not existing" });
      return false;
    }

    const admin: boolean = ctx.actionMetadata.admin;
    if (admin && account != adminId) {
      ctx.res.forbiddenMsg({ message: "Not admin" });
      return false;
    }

    return true;
  }
}
