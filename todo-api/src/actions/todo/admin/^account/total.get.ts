import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import {
  ApiDescription,
  ApiResponses,
  ApiSecurity,
  ApiTags,
} from "@ipare/swagger";
import { CollectionService } from "../../../../services/collection.service";

@ApiTags("todo")
@ApiDescription(`Get the count of user's all todos`)
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
              description: "The count of user's all todos",
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
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const { account } = this.ctx.req.params;

    const countRes = await this.collectionService.todo
      .where({
        uid: account,
      })
      .count();

    this.ok({
      total: countRes.total,
    });
  }
}
