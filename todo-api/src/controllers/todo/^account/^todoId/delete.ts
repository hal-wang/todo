import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";

/**
 * @openapi
 * /todo/{account}/{todoId}:
 *   delete:
 *     tags:
 *       - todo
 *     description: Delete a todo item
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *       - $ref: '#/components/parameters/queryTodo'
 *     responses:
 *       204:
 *         description: success
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["pl", "todo"]);
  }

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    await Collections.todo.doc(todoId).remove();
    this.noContent();
  }
}
