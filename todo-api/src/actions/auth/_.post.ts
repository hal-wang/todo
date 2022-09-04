import { Inject } from "@ipare/inject";
import { Body } from "@ipare/pipe";
import { Action } from "@ipare/router";
import { Open } from "../../decorators/open";
import { UserEntity } from "../../entities/user.entity";
import { CollectionService } from "../../services/collection.service";
import { DbhelperService } from "../../services/dbhelper.service";
import { UserService } from "../../services/user.service";
import { V } from "@ipare/validator";
import { AuthTokenDto } from "../../dtos/auth-token.dto";

@V()
  .Tags("auth")
  .Description(`Login or signup with email and password`)
  .Response(200, AuthTokenDto)
  .ResponseDescription(200, "success")
  .ResponseDescription(400, "Format error or the account is existing")
@Open
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Inject
  private readonly userService!: UserService;
  @Inject
  private readonly dbhelperService!: DbhelperService;

  @V().IsEmail().Description("email")
  @Body("account")
  private readonly account!: string;

  @V().IsString().Length(6, 32).Description("password")
  @Body("password")
  private readonly password!: string;

  async invoke(): Promise<void> {
    if (await this.userService.existUser(this.account)) {
      const user = await this.userService.login(this.account, this.password);
      if (!user) {
        this.forbiddenMsg("Error password");
        return;
      }
    } else {
      await this.signup();
    }

    this.ok({
      token: await this.userService.createToken(this.account),
    });
  }

  private async signup() {
    await this.dbhelperService.add(this.collectionService.user, {
      _id: this.account,
      password: this.password,
      create_at: new Date().valueOf(),
    } as UserEntity);
  }
}
