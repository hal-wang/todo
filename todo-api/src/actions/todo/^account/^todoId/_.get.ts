import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";

/**
 * @openapi
 * /todo/{account}/{todoId}:
 *   get:
 *     tags:
 *       - todo
 *     description: Get a todo's info
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *       - $ref: '#/components/parameters/queryTodo'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super();
    this.metadata.roles = ["pl", "todo"];
  }

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    const getRes = await Collections.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
