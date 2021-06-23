import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";

/**
 * @openapi
 * /todo/total:
 *   get:
 *     tags:
 *       - todo
 *     description: Get the count of all todos
 *     parameters:
 *       - $ref: '#/components/parameters/headerAccount'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The count of all todos
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async invoke(): Promise<void> {
    const countRes = await Collections.todo.count();
    this.ok({
      total: countRes.total,
    });
  }
}
