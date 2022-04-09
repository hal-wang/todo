import { Action } from "@sfajs/router";
import { testId } from "../../global";
import { Inject } from "@sfajs/inject";
import { CollectionService } from "../../services/collection.service";

/**
 * @openapi
 * /user/{account}:
 *   delete:
 *     tags:
 *       - user
 *     description: Delete a user
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     responses:
 *       204:
 *         description: success
 *       404:
 *         description: can't delete the test user
 *     security:
 *       - password: []
 */

export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const account = this.ctx.req.headers.account as string;
    if (account == testId) {
      this.badRequestMsg({ message: "can't delete the test user" });
      return;
    }

    await this.collectionService.todo
      .where({
        uid: account,
      })
      .remove();
    await this.collectionService.user.doc(account).remove();

    this.noContent();
  }
}
