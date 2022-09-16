import { Inject } from "@ipare/inject";
import { Param } from "@ipare/pipe";
import { Action } from "@ipare/router";
import { V } from "@ipare/validator";
import { GetTodoCountDto } from "../../../../dtos/get-todo-count.dto";
import { CollectionService } from "../../../../services/collection.service";

@V()
  .Tags("todo")
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
