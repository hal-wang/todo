import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";
import moment = require("moment");

/**
 * @action todo
 *
 * update a todo's info
 *
 * @input
 * @output
 * @@codes
 * @@@200 success
 * @@body {object} new todo's info
 */
export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.query;
    const { content, schedule } = this.ctx.req.body;

    await Collections.todo.doc(todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await Collections.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
