import { Action } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";
import Validate from "../../lib/Validate";
import moment = require("moment");
import User from "../../models/User";

/**
 * @action add user
 *
 * signup a account with email
 *
 * @input
 * @@body
 * @@@account {string} email
 * @@@password {string} password
 * @output
 * @@codes
 * @@@200 success
 * @@@400 format error or the account is existing
 * @@body {object} user info
 */
export default class extends Action {
  async invoke(): Promise<void> {
    const { account, password } = this.ctx.req.data;
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
