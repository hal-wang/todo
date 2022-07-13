import { Database } from "@cloudbase/node-sdk";
import { Inject } from "@ipare/inject";
import { CbappService } from "./cbapp.service";

export class CollectionService {
  @Inject
  private readonly cbappService!: CbappService;

  private getCollection(collection: string): Database.CollectionReference {
    return this.cbappService.db.collection(collection);
  }

  get user(): Database.CollectionReference {
    return this.getCollection("user");
  }
  get todo(): Database.CollectionReference {
    return this.getCollection("todo");
  }
}
