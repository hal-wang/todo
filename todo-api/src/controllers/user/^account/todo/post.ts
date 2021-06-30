import { Action } from "@sfajs/router";
import Collections from "../../../../lib/Collections";
import Todo from "../../../../models/Todo";
import moment = require("moment");

/**
 * @openapi
 * /user/{account}/todo:
 *   post:
 *     tags:
 *       - todo
 *     description: Add a new todo item
 *     parameters:
 *       - $ref: '#/components/parameters/queryAccount'
 *     requestBody:
 *       description: Todo info
 *       content: 
 *         application/json:
 *           schema:
 *             properties:
 *               content:
 *                 type: string
 *                 description: todo content
 *               schedule:
 *                 type: timestamp
 *                 description: todo schedule
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *     security:
 *       - password: []
 */
export default class extends Action {
  constructor() {
    super(["pl"]);
  }

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;
    const { content, schedule } = this.ctx.req.body;

    const newTodo = <Todo>{
      content: content,
      schedule: schedule,
      uid: account,
      create_at: moment().valueOf(),
      update_at: moment().valueOf(),
    };
    const addRes = await Collections.todo.add(newTodo);
    if (!addRes.id) {
      this.errRequest();
      return;
    }

    newTodo._id = addRes.id;
    this.ok(newTodo);
  }
}
