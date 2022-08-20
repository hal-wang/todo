import { Inject } from "@ipare/inject";
import { Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import { Todo } from "../../../decorators/todo";
import { CollectionService } from "../../../services/collection.service";

@ApiTags("todo")
@ApiDescription(`Get a todo's info`)
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
  Bearer: [],
})
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @Param("todoId")
  private readonly todoId!: string;

  async invoke(): Promise<void> {
    const getRes = await this.collectionService.todo.doc(this.todoId).get();
    this.ok(getRes.data[0]);
  }
}
