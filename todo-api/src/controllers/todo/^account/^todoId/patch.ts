import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";
import moment = require("moment");

/**
 * @openapi
 * /todo/{account}/{todoId}:
 *   patch:
 *     tags:
 *       - todo
 *     description: Update a todo's info
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *       - $ref: '#/components/parameters/queryTodo'
 *     requestBody:
 *       description: Todo info
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               content:
 *                 type: string
 *                 description: todo content
 *               schedule:
 *                 type: timestamp
 *                 description: todo schedule
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               description: New todo's info
 *               $ref: '#/components/schemas/Todo'
 *     security:
 *       - password: []
 */

export default class extends Action {
  constructor() {
    super(["pl", "todo"]);
  }

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;
    const { content, schedule } = this.ctx.req.body;

    await Collections.todo.doc(todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await Collections.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
