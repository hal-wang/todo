import { Inject } from "@ipare/inject";
import { Query } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import { Admin } from "../../../decorators/admin";
import { PageParamsDto } from "../../../dtos/page-params.dto";
import { CollectionService } from "../../../services/collection.service";
import { DbhelperService } from "../../../services/dbhelper.service";

@ApiTags("user")
@ApiDescription(`Get all users' info`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "object",
        },
      },
    },
  },
})
@ApiSecurity({
  password: [],
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
