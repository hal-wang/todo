import { Inject } from "@halsp/inject";
import { Query } from "@halsp/pipe";
import { Action } from "@halsp/router";
import { V } from "@halsp/validator";
import { Admin } from "../../../../decorators/admin";
import { PageParamsDto } from "../../../../dtos/page-params.dto";
import { UserInfoPageListDto } from "../../dtos/user-info-page-list.dto";
import { CollectionService } from "../../../../services/collection.service";
import { DbhelperService } from "../../../../services/dbhelper.service";

@V()
  .Summary(`Get all users' info`)
  .Response(200, UserInfoPageListDto)
  .ResponseDescription(200, "success")
  .Security({
    Bearer: [],
  })
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
