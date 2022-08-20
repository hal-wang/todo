import { Inject } from "@ipare/inject";
import { Body } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiTags,
  ApiSecurity,
  DtoDescription,
} from "@ipare/swagger";
import { Open } from "../../decorators/open";
import { UserEntity } from "../../entities/user.entity";
import { CollectionService } from "../../services/collection.service";
import { DbhelperService } from "../../services/dbhelper.service";
import { UserService } from "../../services/user.service";
import { IsEmail, IsString, Length } from "class-validator";

@ApiTags("user")
@ApiDescription(`Signup a account with email`)
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
  "400": {
    description: "Format error or the account is existing",
  },
})
@ApiSecurity({
  Bearer: [],
})
@Open
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Inject
  private readonly userService!: UserService;
  @Inject
  private readonly dbhelperService!: DbhelperService;

  @IsEmail()
  @DtoDescription("email")
  @Body("account")
  private readonly account!: string;

  @IsString()
  @Length(6, 32)
  @DtoDescription("password")
  @Body("password")
  private readonly password!: string;

  async invoke(): Promise<void> {
    let user: UserEntity | undefined;
    if (await this.userService.existUser(this.account)) {
      user = await this.userService.login(this.account, this.password);
      if (!user) {
        this.forbiddenMsg("Error password");
        return;
      }
    } else {
      user = await this.signup();
    }

    this.ok({
      ...user,
      password: undefined,
      token: await this.userService.createToken(this.account),
    });
  }

  private async signup() {
    return await this.dbhelperService.add(this.collectionService.user, {
      _id: this.account,
      password: this.password,
      create_at: new Date().valueOf(),
    } as UserEntity);
  }
}
