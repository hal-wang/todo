import { Inject } from "@sfajs/inject";
import { Action } from "@sfajs/router";
import moment = require("moment");
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

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
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;
    const { content, schedule } = this.ctx.req.body;

    await this.collectionService.todo.doc(todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await this.collectionService.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
