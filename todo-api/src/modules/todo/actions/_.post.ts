import { Action } from "@halsp/router";
import { CollectionService } from "../../../services/collection.service";
import { Inject } from "@halsp/inject";
import { Body } from "@halsp/pipe";
import { UpsertTodoDto } from "../dtos/upsert-todo.dto";
import { Account } from "../../../decorators/account";
import { V } from "@halsp/validator";
import { GetTodoDto } from "../dtos/get-todo.dto";
import { TodoEntity } from "../../../entities/todo.entity";

@V().Summary(`Add a new todo item`).Response(200, GetTodoDto).Security({
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
    const newTodo = {
      content: this.dto.content,
      schedule: this.dto.schedule,
      uid: this.account,
      create_at: now,
      update_at: now,
    } as TodoEntity;
    const addRes = await this.collectionService.todo.add(newTodo);
    if (!addRes.id) {
      this.internalServerErrorMsg();
      return;
    }

    newTodo._id = addRes.id;
    this.ok(newTodo);
  }
}
