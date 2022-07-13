import { Inject } from "@ipare/inject";
import { Header, Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import moment = require("moment");
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

/**
 * @openapi
 * /todo/{todoId}:
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

  @Param("todoId")
  private readonly todoId!: string;

  async invoke(): Promise<void> {
    const { content, schedule } = this.ctx.req.body;

    await this.collectionService.todo.doc(this.todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await this.collectionService.todo.doc(this.todoId).get();
    this.ok(getRes.data[0]);
  }
}
