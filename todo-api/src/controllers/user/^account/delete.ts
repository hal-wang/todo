import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";
import Global from "../../../lib/Global";

/**
 * @openapi
 * /user/{account}:
 *   delete:
 *     tags:
 *       - user
 *     description: Delete a user
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     responses:
 *       204:
 *         description: success
 *       404:
 *         description: can't delete the test user
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["pl"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;
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
