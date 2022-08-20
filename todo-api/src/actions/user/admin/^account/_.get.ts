import { Inject } from "@ipare/inject";
import { Query } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
  DtoDescription,
} from "@ipare/swagger";
import { Admin } from "../../../../decorators/admin";
import { CollectionService } from "../../../../services/collection.service";

@ApiTags("user")
@ApiDescription(`Get a user info`)
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
    headers: {
      actionPath: {
        description: `The action's real path`,
        schema: {
          type: "string",
        },
      },
    },
  },
  "400": {
    description: "Account format error",
  },
})
@ApiSecurity({
  password: [],
})
@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @DtoDescription("email")
  @Query("account")
  private readonly account!: string;

  async invoke(): Promise<void> {
    if (typeof this.account != "string") {
      this.badRequestMsg();
      return;
    }

    const accRes = await this.collectionService.user.doc(this.account).get();
    this.ok(accRes.data[0]);
  }
}
