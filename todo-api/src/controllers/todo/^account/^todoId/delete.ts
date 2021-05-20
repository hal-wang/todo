import { Action } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

/**
 * @action todo
 *
 * delete a todo item
 *
 * @input
 * @output
 * @@codes
 * @@@204 success
 */
export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async invoke(): Promise<void> {
    const { todoId } = this.httpContext.request.query;

    await Collections.todo.doc(todoId).remove();
    this.noContent();
  }
}
