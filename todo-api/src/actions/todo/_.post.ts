import { Action } from "@ipare/router";
import Todo from "../../models/Todo";
import { CollectionService } from "../../services/collection.service";
import { Inject } from "@ipare/inject";
import { Body } from "@ipare/pipe";
import { UpsertTodoDto } from "../../dtos/upsert-todo.dto";
import { Account } from "../../decorators/account";
import { V } from "@ipare/validator";
import { GetTodoDto } from "../../dtos/get-todo.dto";

@V()
  .Tags("todo")
  .Description(`Add a new todo item`)
  .Response(200, GetTodoDto)
  .Security({
    Bearer: [],
  })
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Body
  private readonly dto!: UpsertTodoDto;

  @Account
  private readonly account!: string;

  async invoke(): Promise<void> {
    const now = new Date().valueOf();
    const newTodo = <Todo>{
      content: this.dto.content,
      schedule: this.dto.schedule,
      uid: this.account,
      create_at: now,
      update_at: now,
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
