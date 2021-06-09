import { Action } from "@sfajs/router";
import Collections from "../../../lib/Collections";

/**
 * @action todo count
 *
 * get the count of all todos
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @body
 * @@total {number} the count of all todos
 */
export default class extends Action {
  constructor() {
    super(["hl", "admin"]);
  }

  async invoke(): Promise<void> {
    const countRes = await Collections.todo.count();
    this.ok({
      total: countRes.total,
    });
  }
}
