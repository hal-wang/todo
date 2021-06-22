import { Middleware } from "sfa";
import Collections from "./Collections";
import Global from "./Global";

export default class Auth extends Middleware {
  async invoke(): Promise<void> {
    this.ctx.res.headers.hds = JSON.stringify(this.ctx.req.headers);
    this.ctx.res.headers.qy = JSON.stringify(this.ctx.req.query);
    this.ctx.res.headers.pm = JSON.stringify(this.ctx.req.params);
    if (!this.ctx.actionRoles || !this.ctx.actionRoles.length) {
      return await this.next();
    }

    if (this.ctx.actionRoles.includes("ql")) {
      if (this.ctx.actionRoles.includes("admin") && !this.queryAdminAuth()) {
        this.forbiddenMsg({ message: "not admin" });
        return;
      }

      if (!(await this.queryLoginAuth())) {
        this.forbiddenMsg({ message: "error account or password" });
        return;
      }
    }

    if (this.ctx.actionRoles.includes("hl")) {
      if (this.ctx.actionRoles.includes("admin") && !this.headerAdminAuth()) {
        this.forbiddenMsg({ message: "not admin" });
        return;
      }

      if (!(await this.headerLoginAuth())) {
        this.forbiddenMsg({ message: "error account or password" });
        return;
      }
    }

    if (this.ctx.actionRoles.includes("todo") && !(await this.todoIdAuth())) {
      this.notFoundMsg({ message: "the todo item is not existing" });
      return;
    }

    await this.next();
  }

  private queryAdminAuth(): boolean {
    const { account } = this.ctx.req.query;
    return account == Global.adminId;
  }

  private headerAdminAuth(): boolean {
    const { account } = this.ctx.req.headers;
    return account == Global.adminId;
  }

  private async headerLoginAuth(): Promise<boolean> {
    const { account, password } = this.ctx.req.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account as string, password as string);
  }

  private async queryLoginAuth(): Promise<boolean> {
    const { account } = this.ctx.req.query;
    const { password } = this.ctx.req.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account, password as string);
  }

  private async loginAuth(account: string, password: string): Promise<boolean> {
    const countRes = await Collections.user
      .where({
        _id: account,
        password,
      })
      .count();
    return !!countRes.total;
  }

  private async todoIdAuth(): Promise<boolean> {
    const { todoId, account } = this.ctx.req.query;
    const countRes = await Collections.todo
      .where({
        _id: todoId,
        uid: account,
      })
      .count();
    return !!countRes.total;
  }
}
