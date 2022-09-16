import { Inject } from "@ipare/inject";
import { Body, Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import { V } from "@ipare/validator";
import { Todo } from "../../../decorators/todo";
import { GetTodoDto } from "../../../dtos/get-todo.dto";
import { UpsertTodoDto } from "../../../dtos/upsert-todo.dto";
import { CollectionService } from "../../../services/collection.service";

@V()
  .Tags("todo")
  .Summary(`Update a todo's info`)
  .Response(200, GetTodoDto)
  .ResponseDescription(200, "New todo's info")
  .Security({
    Bearer: [],
  })
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;
  @Body
  private readonly dto!: UpsertTodoDto;

  @V().Description("Todo id").Required().IsString()
  @Param("todoId")
  private readonly todoId!: string;

  async invoke(): Promise<void> {
    const { content, schedule } = this.dto;

    await this.collectionService.todo.doc(this.todoId).update({
      content: content,
      schedule: schedule,
      update_at: new Date().valueOf(),
    });

    const getRes = await this.collectionService.todo.doc(this.todoId).get();
    this.ok(getRes.data[0]);
  }
}
