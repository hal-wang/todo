import { Action } from "@hal-wang/cloudbase-access";
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
    const { todoId } = this.httpContext.request.query;
    const { content, schedule } = this.httpContext.request.data;

    await Collections.todo.doc(todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await Collections.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
