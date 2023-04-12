import { Inject } from "@halsp/inject";
import { UserEntity } from "../entities/user.entity";
import { CollectionService } from "./collection.service";
import { JwtService } from "@halsp/jwt";

export class UserService {
  @Inject
  private readonly collectionService!: CollectionService;
  @Inject
  private readonly jwtService!: JwtService;

  async existUser(account: string): Promise<boolean> {
    const res = await this.collectionService.user
      .where({
        _id: account,
      })
      .count();
    return !!res.total;
  }

  async getUser(account: string): Promise<UserEntity> {
    const res = await this.collectionService.user
      .where({
        _id: account,
      })
      .get();
    return res.data[0];
  }

  async login(
    account: string,
    password: string
  ): Promise<UserEntity | undefined> {
    const res = await this.collectionService.user
      .where({
        _id: account,
        password,
      })
      .get();
    return res.data[0];
  }

  async createToken(account: string) {
    return await this.jwtService.sign({
      account,
    });
  }
}
