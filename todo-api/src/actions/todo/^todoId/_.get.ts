import { Inject } from "@sfajs/inject";
import { Action } from "@sfajs/router";
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

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
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    const getRes = await this.collectionService.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
