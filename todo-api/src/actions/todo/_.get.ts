import { Action } from "@ipare/router";
import { DbhelperService } from "../../services/dbhelper.service";
import { Inject } from "@ipare/inject";
import { CollectionService } from "../../services/collection.service";
import { Header, Query } from "@ipare/pipe";
import { PageParamsDto } from "../../dtos/page-params.dto";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";

@ApiTags("todo")
@ApiDescription(`Get todo list`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "array",
        },
      },
    },
  },
  "400": {
    description: "account format error",
  },
})
@ApiSecurity({
  password: [],
})
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
