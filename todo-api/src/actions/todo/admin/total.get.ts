import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import { Admin } from "../../../decorators/admin";
import { CollectionService } from "../../../services/collection.service";

@ApiTags("todo")
@ApiDescription(`Get the count of all todos`)
@ApiResponses({
  "200": {
    description: "success",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            total: {
              type: "number",
              description: "The count of all todos",
            },
          },
        },
      },
    },
  },
})
@ApiSecurity({
  password: [],
})
@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const countRes = await this.collectionService.todo.count();
    this.ok({
      total: countRes.total,
    });
  }
}
