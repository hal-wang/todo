import { Inject } from "@halsp/inject";
import { Query } from "@halsp/pipe";
import { Action } from "@halsp/router";
import { V } from "@halsp/validator";
import { Admin } from "../../../../../decorators/admin";
import { UserInfoDto } from "../../../dtos/user-info.dto";
import { CollectionService } from "../../../../../services/collection.service";

@V()
  .Summary(`Get a user info`)
  .Response(200, UserInfoDto)
  .ResponseDescription(200, "success")
  .ResponseHeaders(200, {
    actionPath: {
      description: `The action's real path`,
      schema: {
        type: "string",
      },
    },
  })
  .ResponseDescription(400, "Account format error")
  .Security({
    Bearer: [],
  })
@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @V().Description("email").Required().IsEmail()
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
