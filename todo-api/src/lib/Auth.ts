import { Authority } from "@hal-wang/cloudbase-access";
import Collections from "./Collections";
import Global from "./Global";

export default class Auth extends Authority {
  async invoke(): Promise<void> {
    if (!this.roles || !this.roles.length) {
      return await this.next();
    }

    if (this.roles.includes("ql")) {
      if (this.roles.includes("admin") && !this.queryAdminAuth()) {
        this.forbiddenMsg({ message: "not admin" });
        return;
      }

      if (!(await this.queryLoginAuth())) {
        this.forbiddenMsg({ message: "error account or password" });
        return;
      }
    }

    if (this.roles.includes("hl")) {
      if (this.roles.includes("admin") && !this.headerAdminAuth()) {
        this.forbiddenMsg({ message: "not admin" });
        return;
      }

      if (!(await this.headerLoginAuth())) {
        this.forbiddenMsg({ message: "error account or password" });
        return;
      }
    }

    if (this.roles.includes("todo") && !(await this.todoIdAuth())) {
      this.notFoundMsg({ message: "the todo item is not existing" });
      return;
    }

    await this.next();
  }

  private queryAdminAuth(): boolean {
    const { account } = this.httpContext.request.query;
    return account == Global.adminId;
  }

  private headerAdminAuth(): boolean {
    const { account } = this.httpContext.request.headers;
    return account == Global.adminId;
  }

  private async headerLoginAuth(): Promise<boolean> {
    const { account, password } = this.httpContext.request.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account, password);
  }

  private async queryLoginAuth(): Promise<boolean> {
    const { account } = this.httpContext.request.query;
    const { password } = this.httpContext.request.headers;
    if (!account || !password) return false;
    return await this.loginAuth(account, password);
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
    const { todoId, account } = this.httpContext.request.query;
    const countRes = await Collections.todo
      .where({
        _id: todoId,
        uid: account,
      })
      .count();
    return !!countRes.total;
  }
}
