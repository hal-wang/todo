import { Inject } from "@ipare/inject";
import { Body, Header, Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import moment = require("moment");
import { Todo } from "../../../decorators/todo";
import { UpsertTodoDto } from "../../../dtos/upsert-todo.dto";
import { CollectionService } from "../../../services/collection.service";

@ApiTags("todo")
@ApiDescription(`Update a todo's info`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          description: `New todo's info`,
          type: "object",
        },
      },
    },
  },
})
@ApiSecurity({
  password: [],
})
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Body
  private readonly dto!: UpsertTodoDto;

  @Param("todoId")
  private readonly todoId!: string;

  async invoke(): Promise<void> {
    const { content, schedule } = this.dto;

    await this.collectionService.todo.doc(this.todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await this.collectionService.todo.doc(this.todoId).get();
    this.ok(getRes.data[0]);
  }
}
