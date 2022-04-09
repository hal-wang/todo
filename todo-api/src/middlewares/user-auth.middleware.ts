import { Middleware } from "@sfajs/core";
import { Inject } from "@sfajs/inject";
import { adminId } from "../global";
import { CollectionService } from "../services/collection.service";
import { UserService } from "../services/user.service";

export class UserAuthMiddleware extends Middleware {
  @Inject
  private readonly userService!: UserService;

  async invoke(): Promise<void> {
    const open: boolean | undefined = this.ctx.actionMetadata.open;
    if (open) {
      await this.next();
      return;
    }

    const account = this.ctx.req.headers.account as string;
    const password = this.ctx.req.headers.password as string;

    if (!(await this.userService.existUser(account, password))) {
      this.forbiddenMsg({ message: "error account or password" });
      return;
    }

    const admin: boolean = this.ctx.actionMetadata.admin;
    if (admin && account != adminId) {
      this.forbiddenMsg({ message: "not admin" });
      return;
    }
    if (
      !this.ctx.actionMetadata.roles ||
      !this.ctx.actionMetadata.roles.length
    ) {
      return await this.next();
    }

    await this.next();
  }
}
