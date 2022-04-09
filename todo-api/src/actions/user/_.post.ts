import { Inject } from "@sfajs/inject";
import { Action } from "@sfajs/router";
import moment = require("moment");
import { Open } from "../../decorators/open";
import User from "../../models/User";
import { CollectionService } from "../../services/collection.service";
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

  async invoke(): Promise<void> {
    const { account, password } = this.ctx.req.body;
    if (typeof account != "string" || !isEmail(account)) {
      this.badRequestMsg({ message: "account format error" });
      return;
    }

    if (typeof password != "string" || !/\w{6,16}/.test(password)) {
      this.badRequestMsg({ message: "password format error" });
      return;
    }

    const accCountRes = await this.collectionService.user
      .where({
        _id: account,
      })
      .count();
    if (accCountRes.total) {
      this.badRequestMsg({ message: "the account is existing" });
      return;
    }

    const newUser = <User>{
      _id: account,
      password: password,
      create_at: moment().valueOf(),
    };
    await this.collectionService.user.doc(account).set({
      password: password,
      create_at: newUser.create_at,
    });

    this.ok(newUser);
    return;
  }
}
