import { Inject } from "@ipare/inject";
import { Body } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiTags,
  DtoDescription,
} from "@ipare/swagger";
import { Open } from "../../decorators/open";
import { UserEntity } from "../../entities/user.entity";
import { CollectionService } from "../../services/collection.service";
import { DbhelperService } from "../../services/dbhelper.service";
import { UserService } from "../../services/user.service";
import { IsEmail, IsString, Length } from "class-validator";

@ApiTags("auth")
@ApiDescription(`Login or signup with email and password`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            token: {
              type: "string",
            },
          },
        },
      },
    },
  },
  "400": {
    description: "Format error or the account is existing",
  },
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
