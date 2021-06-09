import Global from "./Global";
import { Database } from "@cloudbase/node-sdk";
import * as tcb from "@cloudbase/node-sdk";
import { HttpContext } from "sfa";

export default class Collections {
  public static ctx: HttpContext;

  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (Global.isTest) name = `${collection}_test`;
    else name = collection;

    return this.ctx.bag<tcb.Database.Db>("CB_DB").collection(name);
  }

  static get user(): Database.CollectionReference {
    return this.getCollection("user");
  }
  static get todo(): Database.CollectionReference {
    return this.getCollection("todo");
  }
}
