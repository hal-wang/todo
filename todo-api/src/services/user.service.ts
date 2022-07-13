import { Inject } from "@ipare/inject";
import { UserEntity } from "../entities/user.entity";
import { CollectionService } from "./collection.service";

export class UserService {
  @Inject
  private readonly collectionService!: CollectionService;

  async existUser(account: string, password: string): Promise<boolean> {
    const res = await this.collectionService.user
      .where({
        _id: account,
        password,
      })
      .count();
    return !!res.total;
  }

  async getUser(account: string, password: string): Promise<UserEntity> {
    const res = await this.collectionService.user
      .where({
        _id: account,
        password,
      })
      .get();
    return res.data[0];
  }
}
