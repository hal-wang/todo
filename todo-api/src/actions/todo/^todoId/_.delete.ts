import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

/**
 * @openapi
 * /todo/{todoId}:
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
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    await this.collectionService.todo.doc(todoId).remove();
    this.noContent();
  }
}
