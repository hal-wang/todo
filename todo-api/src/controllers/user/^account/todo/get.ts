import { Action } from "@sfajs/router";
import { Dbhelper } from "@sfajs/cloudbase";
import Collections from "../../../../lib/Collections";

/**
 * @openapi
 * /user/{account}/todo:
 *   get:
 *     tags:
 *       - todo
 *     description: Get todo list
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
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
 *                 $ref: '#/components/schemas/Todo'
 *       400:
 *         description: account format error
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["pl"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;

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
