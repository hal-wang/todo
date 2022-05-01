import { Middleware, NotFoundException } from "@sfajs/core";
import { Inject } from "@sfajs/inject";
import { Header, Param } from "@sfajs/pipe";
import { CollectionService } from "../services/collection.service";

export class TodoAuthMiddleware extends Middleware {
  @Inject
  private readonly collectionService!: CollectionService;

  @Param("todoId")
  private readonly todoId!: string;
  @Header("account")
  private readonly account!: string;

  async invoke(): Promise<void> {
    const todo: boolean | undefined = this.ctx.actionMetadata.todo;
    if (!todo) {
      await this.next();
      return;
    }

    const countRes = await this.collectionService.todo
      .where({
        _id: this.todoId,
        uid: this.account,
      })
      .count();
    if (!countRes.total) {
      this.notFoundMsg("the todo item is not existing");
      return;
    }

    await this.next();
  }
}
