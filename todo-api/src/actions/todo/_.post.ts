import { Action } from "@ipare/router";
import Todo from "../../models/Todo";
import moment = require("moment");
import { CollectionService } from "../../services/collection.service";
import { Inject } from "@ipare/inject";
import { Body, Header } from "@ipare/pipe";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import { UpsertTodoDto } from "../../dtos/upsert-todo.dto";

@ApiTags("todo")
@ApiDescription(`Add a new todo item`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "object",
        },
      },
    },
  },
})
@ApiSecurity({
  password: [],
})
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Body
  private readonly dto!: UpsertTodoDto;

  @Header("account")
  private readonly account!: string;

  async invoke(): Promise<void> {
    const newTodo = <Todo>{
      content: this.dto.content,
      schedule: this.dto.schedule,
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
