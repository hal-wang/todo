import { HttpContext } from "@ipare/core";
import { AuthorizationFilter } from "@ipare/filter";
import { Inject } from "@ipare/inject";
import { Header, Param } from "@ipare/pipe";
import { CollectionService } from "../services/collection.service";

export class TodoFilter implements AuthorizationFilter {
  @Inject
  private readonly collectionService!: CollectionService;

  @Param("todoId")
  private readonly todoId!: string;
  @Header("account")
  private readonly account!: string;

  async onAuthorization(ctx: HttpContext): Promise<boolean> {
    const todo: boolean | undefined = ctx.actionMetadata.todo;
    if (!todo) {
      return true;
    }

    return await this.todoAuth(ctx);
  }

  private async todoAuth(ctx: HttpContext): Promise<boolean> {
    const countRes = await this.collectionService.todo
      .where({
        _id: this.todoId,
        uid: this.account,
      })
      .count();
    if (!countRes.total) {
      ctx.notFoundMsg("the todo item is not existing");
      return false;
    }

    return true;
  }
}
