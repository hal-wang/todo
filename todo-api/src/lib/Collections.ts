import Global from "./Global";
import { Database } from "@cloudbase/node-sdk";
import { Startup } from "@hal-wang/cloudbase-access";
import * as tcb from "@cloudbase/node-sdk";

export default class Collections {
  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (Global.isTest) name = `${collection}_test`;
    else name = collection;

    return Startup.current.httpContext
      .getBag<tcb.Database.Db>("db")
      .collection(name);
  }

  static get user(): Database.CollectionReference {
    return Collections.getCollection("user");
  }
  static get todo(): Database.CollectionReference {
    return Collections.getCollection("todo");
  }
}
