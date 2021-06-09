import { Action } from "@sfajs/router";
import { Dbhelper } from "@sfajs/cloudbase";
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

    const result = await this.ctx.bag<Dbhelper>("CB_DBHELPER").getPageList(
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
