import { Inject } from "@halsp/inject";
import { Param } from "@halsp/pipe";
import { Action } from "@halsp/router";
import { V } from "@halsp/validator";
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

@V()
  .Tags("todo")
  .Summary(`Delete a todo item`)
  .ResponseDescription(204, "success")
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
    await this.collectionService.todo.doc(this.todoId).remove();
    this.noContent();
  }
}
