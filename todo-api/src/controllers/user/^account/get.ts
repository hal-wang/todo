import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";

/**
 * @openapi
 * /user/{account}:
 *   get:
 *     tags:
 *       - user
 *     description: Get a user info
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *         headers:
 *           actionPath:
 *             description: the action's real path
 *             schema:
 *               type: string
 *       400:
 *         description: account format error
 *     security:
 *       - password: []
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
    this.ok(accRes.data[0]).setHeader("actionPath", this.ctx.actionPath ?? "");
  }
}
