import { Inject } from "@ipare/inject";
import { Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
  DtoDescription,
} from "@ipare/swagger";
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

@ApiTags("todo")
@ApiDescription(`Delete a todo item`)
@ApiResponses({
  "204": {
    description: "success",
  },
})
@ApiSecurity({
  password: [],
})
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @DtoDescription("Todo id")
  @Param("todoId")
  private readonly todoId!: number;

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    await this.collectionService.todo.doc(todoId).remove();
    this.noContent();
  }
}
