import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { CollectionService } from "../../../../services/collection.service";

/**
 * @openapi
 * /todo/admin/{account}/total:
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
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;

    const countRes = await this.collectionService.todo
      .where({
        uid: account,
      })
      .count();

    this.ok({
      total: countRes.total,
    });
  }
}
