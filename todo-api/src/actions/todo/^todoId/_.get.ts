import { Inject } from "@ipare/inject";
import { Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import { V } from "@ipare/validator";
import { Todo } from "../../../decorators/todo";
import { GetTodoDto } from "../../../dtos/get-todo.dto";
import { CollectionService } from "../../../services/collection.service";

@V()
  .Tags("todo")
  .Summary(`Get a todo's info`)
  .Response(200, GetTodoDto)
  .Security({
    Bearer: [],
  })
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @V().Description("Todo id").Required().IsString()
  @Param("todoId")
  private readonly todoId!: string;

  async invoke(): Promise<void> {
    const getRes = await this.collectionService.todo.doc(this.todoId).get();
    this.ok(getRes.data[0]);
  }
}
