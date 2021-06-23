import { Dbhelper } from "@sfajs/cloudbase";
import { Action } from "@sfajs/router";
import Collections from "../../lib/Collections";

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - user
 *     description: Get all users' info
 *     parameters:
 *       - $ref: '#/components/parameters/headerAccount'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async invoke(): Promise<void> {
    const result = await this.ctx.bag<Dbhelper>("CB_DBHELPER").getPageList(
      Collections.user.field({
        password: false,
      })
    );

    this.ok(result);
  }
}
