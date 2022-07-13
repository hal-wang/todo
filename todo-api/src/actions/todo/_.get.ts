import { Action } from "@ipare/router";
import { DbhelperService } from "../../services/dbhelper.service";
import { Inject } from "@ipare/inject";
import { CollectionService } from "../../services/collection.service";
import { Header, Query } from "@ipare/pipe";
import { PageParamsDto } from "../../dtos/page-params.dto";

/**
 * @openapi
 * /todo:
 *   get:
 *     tags:
 *       - todo
 *     description: Get todo list
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
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
 *                 $ref: '#/components/schemas/Todo'
 *       400:
 *         description: account format error
 *     security:
 *       - password: []
 */
export default class extends Action {
  @Inject
  private readonly dbhelperService!: DbhelperService;
  @Inject
  private readonly collectionService!: CollectionService;
  @Query
  private readonly query!: PageParamsDto;
  @Header("account")
  private readonly account!: string;

  async invoke(): Promise<void> {
    const result = await this.dbhelperService.getPageList(this.query, () =>
      this.collectionService.todo
        .where({
          uid: this.account,
        })
        .orderBy("update_at", "desc")
        .orderBy("create_at", "desc")
    );
    this.ok(result);
  }
}
