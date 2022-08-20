import { Inject } from "@ipare/inject";
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
  password: [],
})
@Todo
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { todoId } = this.ctx.req.params;

    const getRes = await this.collectionService.todo.doc(todoId).get();
    this.ok(getRes.data[0]);
  }
}
