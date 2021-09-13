import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";

/**
 * @openapi
 * /todo/{account}/total:
 *   get:
 *     tags:
 *       - todo
 *     description: Get the count of user's all todos
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The count of user's all todos
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super();
    this.metadata.roles = ["pl"];
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;

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
