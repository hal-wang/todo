import { Inject } from "@sfajs/inject";
import { Query } from "@sfajs/req-deco";
import { Action } from "@sfajs/router";
import { Admin } from "../../../decorators/admin";
import { PageParamsDto } from "../../../dtos/page-params.dto";
import { CollectionService } from "../../../services/collection.service";
import { DbhelperService } from "../../../services/dbhelper.service";

/**
 * @openapi
 * /user/admin:
 *   get:
 *     tags:
 *       - user
 *     description: Get all users' info
 *     parameters:
 *       - $ref: '#/components/parameters/headerAccount'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *       - password: []
 */

@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Inject
  private readonly dbhelperService!: DbhelperService;
  @Query
  private readonly query!: PageParamsDto;

  async invoke(): Promise<void> {
    const result = await this.dbhelperService.getPageList(this.query, () =>
      this.collectionService.user.field({
        password: false,
      })
    );

    this.ok(result);
  }
}
