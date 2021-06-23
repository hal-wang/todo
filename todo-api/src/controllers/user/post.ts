import { Action } from "@sfajs/router";
import Collections from "../../lib/Collections";
import Validate from "../../lib/Validate";
import moment = require("moment");
import User from "../../models/User";

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
export default class extends Action {
  async invoke(): Promise<void> {
    const { account, password } = this.ctx.req.body;
    if (typeof account != "string" || !Validate.isEmail(account)) {
      this.badRequestMsg({ message: "account format error" });
      return;
    }

    if (typeof password != "string" || !/\w{6,16}/.test(password)) {
      this.badRequestMsg({ message: "password format error" });
      return;
    }

    const accCountRes = await Collections.user
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
    await Collections.user.doc(account).set({
      password: password,
      create_at: newUser.create_at,
    });

    this.ok(newUser);
    return;
  }
}
