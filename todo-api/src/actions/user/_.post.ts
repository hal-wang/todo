import { Inject } from "@sfajs/inject";
import { Body } from "@sfajs/pipe";
import { Action } from "@sfajs/router";
import moment = require("moment");
import { Open } from "../../decorators/open";
import { UserEntity } from "../../entities/user.entity";
import { CollectionService } from "../../services/collection.service";
import { DbhelperService } from "../../services/dbhelper.service";
import { UserService } from "../../services/user.service";
import { isEmail } from "../../utils/validate";

/**
 * @openapi
 * /user/{account}:
 *   post:
 *     tags:
 *       - user
 *     description: signup a account with email
 *     requestBody:
 *       description: User info
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               account:
 *                 type: string
 *                 description: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: format error or the account is existing
 *     security:
 *       - password: []
 */
@Open
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Inject
  private readonly userService!: UserService;
  @Inject
  private readonly dbhelperService!: DbhelperService;

  @Body("account")
  private readonly account!: string;
  @Body("password")
  private readonly password!: string;

  async invoke(): Promise<void> {
    if (typeof this.account != "string") {
      this.badRequestMsg({ message: "account format error" });
      return;
    }
    if (typeof this.password != "string") {
      this.badRequestMsg({ message: "password format error" });
      return;
    }

    const existUser = await this.userService.getUser(
      this.account,
      this.password
    );
    if (existUser) {
      this.ok(existUser);
      return;
    }

    await this.signup();
  }

  private async signup() {
    if (!isEmail(this.account)) {
      this.badRequestMsg({ message: "account format error" });
      return;
    }

    if (!/\w{6,16}/.test(this.password)) {
      this.badRequestMsg({ message: "password format error" });
      return;
    }

    const user = await this.dbhelperService.add(this.collectionService.user, {
      _id: this.account,
      password: this.password,
      create_at: moment().valueOf(),
    } as UserEntity);
    this.ok(user);
  }
}
