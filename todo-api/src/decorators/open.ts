import { setActionMetadata } from "@sfajs/router";

export function Open(target: any) {
  setActionMetadata(target, {
    open: true,
  });
}
