import { Action } from "@sfajs/router";
import Collections from "../../lib/Collections";

/**
 * @action users
 *
 * get all users' info
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @@body {array} user list
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async invoke(): Promise<void> {
    const accsRes = await Collections.user
      .field({
        password: false,
      })
      .get();

    this.ok(accsRes.data);
  }
}
