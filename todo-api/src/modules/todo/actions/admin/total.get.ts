import { Inject } from "@halsp/inject";
import { Action } from "@halsp/router";
import { V } from "@halsp/validator";
import { Admin } from "../../../../decorators/admin";
import { GetTodoCountDto } from "../../dtos/get-todo-count.dto";
import { CollectionService } from "../../../../services/collection.service";

@V()
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
