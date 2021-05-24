import { Action } from "@hal-wang/cloudbase-access";
import Collections from "../../../lib/Collections";
import Global from "../../../lib/Global";

/**
 * @action user
 *
 * delete a user
 *
 * @input
 * @output
 * @@codes
 * @@@204 success
 * @@@404 can't delete the test user
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.query;
    if (account == Global.testId) {
      this.badRequestMsg({ message: "can't delete the test user" });
      return;
    }

    await Collections.todo
      .where({
        uid: account,
      })
      .remove();
    await Collections.user.doc(account).remove();

    this.noContent();
  }
}
