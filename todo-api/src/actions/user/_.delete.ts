import { Action } from "@ipare/router";
import { testId } from "../../global";
import { Inject } from "@ipare/inject";
import { CollectionService } from "../../services/collection.service";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";

@ApiTags("user")
@ApiDescription(`Delete a user`)
@ApiResponses({
  "200": {
    description: "success",
  },
  "404": {
    description: "Can't delete the test user",
  },
})
@ApiSecurity({
  Bearer: [],
})
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
