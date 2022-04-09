import { setActionMetadata } from "@sfajs/router";

export function Todo(target: any) {
  setActionMetadata(target, {
    todo: true,
  });
}
