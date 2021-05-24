import { Action } from "@hal-wang/cloudbase-access";
import { Dbhelper } from "@hal-wang/cloudbase-access-middleware-dbhelper";
import Collections from "../../../../lib/Collections";

/**
 * @action todos
 *
 * get todo list
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body {array} todo list
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.query;

    const result = await this.ctx.getBag<Dbhelper>("dbhelper").getPageList(
      Collections.todo
        .where({
          uid: account,
        })
        .orderBy("update_at", "desc")
        .orderBy("create_at", "desc")
    );
    this.ok(result);
  }
}
