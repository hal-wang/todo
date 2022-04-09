import { Inject } from "@sfajs/inject";
import { Action } from "@sfajs/router";
import { Admin } from "../../../../decorators/admin";
import { CollectionService } from "../../../../services/collection.service";

/**
 * @openapi
 * /user/admin/{account}
 *   get:
 *     tags:
 *       - user
 *     description: Get a user info
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *         headers:
 *           actionPath:
 *             description: the action's real path
 *             schema:
 *               type: string
 *       400:
 *         description: account format error
 *     security:
 *       - password: []
 */

@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;
    if (typeof account != "string") {
      this.badRequestMsg();
      return;
    }

    const accRes = await this.collectionService.user.doc(account).get();
    this.ok(accRes.data[0]);
  }
}
