import { Action } from "@halsp/router";
import { testId } from "../../../global";
import { Inject } from "@halsp/inject";
import { CollectionService } from "../../../services/collection.service";
import { V } from "@halsp/validator";
import { Account } from "../../../decorators/account";

@V()
  .Summary(`Delete a user`)
  .ResponseDescription(200, "success")
  .ResponseDescription(403, "Can't delete the test user")
  .Security({
    Bearer: [],
  })
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @Account
  private readonly account!: string;

  async invoke(): Promise<void> {
    if (this.account == testId) {
      this.forbiddenMsg("can't delete the test user");
      return;
    }

    await this.collectionService.todo
      .where({
        uid: this.account,
      })
      .remove();
    await this.collectionService.user.doc(this.account).remove();

    this.noContent();
  }
}
