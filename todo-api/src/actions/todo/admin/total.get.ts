import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { Admin } from "../../../decorators/admin";
import { CollectionService } from "../../../services/collection.service";

/**
 * @openapi
 * /todo/admin/total:
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

@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const countRes = await this.collectionService.todo.count();
    this.ok({
      total: countRes.total,
    });
  }
}
