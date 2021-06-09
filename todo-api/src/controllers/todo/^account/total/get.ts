import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";

/**
 * @action user todo count
 *
 * get the count of user's all todos
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body
 * @@total {number} the count of user's all todos
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.query;

    const countRes = await Collections.todo
      .where({
        uid: account,
      })
      .count();

    this.ok({
      total: countRes.total,
    });
  }
}
