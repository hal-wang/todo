import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { V } from "@ipare/validator";
import { Admin } from "../../../decorators/admin";
import { GetTodoCountDto } from "../../../dtos/get-todo-count.dto";
import { CollectionService } from "../../../services/collection.service";

@V()
  .Tags("todo")
  .Summary(`Get the count of all todos`)
  .ResponseDescription(200, "success")
  .Response(200, GetTodoCountDto)
  .Security({
    Bearer: [],
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
