import { Inject } from "@halsp/inject";
import { Param } from "@halsp/pipe";
import { Action } from "@halsp/router";
import { V } from "@halsp/validator";
import { GetTodoCountDto } from "../../../dtos/get-todo-count.dto";
import { CollectionService } from "../../../../../services/collection.service";

@V()
  .Summary(`Get the count of user's all todos`)
  .Response(200, GetTodoCountDto)
  .ResponseDescription(`The count of user's all todos`)
  .Security({
    Bearer: [],
  })
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @Param("account")
  @V().Required().IsString()
  private readonly account!: string;

  async invoke(): Promise<void> {
    const countRes = await this.collectionService.todo
      .where({
        uid: this.account,
      })
      .count();

    this.ok({
      total: countRes.total,
    });
  }
}
