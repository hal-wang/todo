import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";

/**
 * @action user info
 *
 * get a user info
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @@@400 account format error
 * @@body {object} user info
 * @@headers
 * @@@realPath {string} the action's real path
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.query;
    if (typeof account != "string") {
      this.badRequestMsg();
      return;
    }

    const accRes = await Collections.user.doc(account).get();
    const result = this.ok(accRes.data[0]);
    result.headers.realPath = this.ctx.actionPath || "";
    result;
  }
}
