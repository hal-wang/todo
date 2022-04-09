import { setActionMetadata } from "@sfajs/router";

export function Admin(target: any) {
  setActionMetadata(target, {
    admin: true,
  });
}
