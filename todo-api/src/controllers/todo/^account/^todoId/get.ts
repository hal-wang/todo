import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";

/**
 * @action todo
 *
 * get a todo's info
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @@body {object} todo's info
 */
export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.query;

    const getRes = await Collections.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
