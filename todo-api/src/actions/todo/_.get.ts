import { Action } from "@halsp/router";
import { DbhelperService } from "../../services/dbhelper.service";
import { Inject } from "@halsp/inject";
import { CollectionService } from "../../services/collection.service";
import { Header, Query } from "@halsp/pipe";
import { PageParamsDto } from "../../dtos/page-params.dto";
import { Account } from "../../decorators/account";
import { V } from "@halsp/validator";
import { TodoPageListDto } from "../../dtos/todo-page-list.dto";

@V()
  .Tags("todo")
  .Summary(`Get todo list`)
  .Response(200, TodoPageListDto)
  .ResponseDescription(400, "account format error")
  .Security({
    Bearer: [],
  })
export default class extends Action {
  @Inject
  private readonly dbhelperService!: DbhelperService;
  @Inject
  private readonly collectionService!: CollectionService;
  @Query
  private readonly query!: PageParamsDto;
  @Account
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
