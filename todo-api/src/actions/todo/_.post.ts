import { Action } from "@sfajs/router";
import Todo from "../../models/Todo";
import moment = require("moment");
import { CollectionService } from "../../services/collection.service";
import { Inject } from "@sfajs/inject";
import { Header } from "@sfajs/req-deco";

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
  @Inject
  private readonly collectionService!: CollectionService;

  @Header("account")
  private readonly account!: string;

  async invoke(): Promise<void> {
    const { content, schedule } = this.ctx.req.body;

    const newTodo = <Todo>{
      content: content,
      schedule: schedule,
      uid: this.account,
      create_at: moment().valueOf(),
      update_at: moment().valueOf(),
    };
    const addRes = await this.collectionService.todo.add(newTodo);
    if (!addRes.id) {
      this.internalServerErrorMsg();
      return;
    }

    newTodo._id = addRes.id;
    this.ok(newTodo);
  }
}
