import { Inject, parseInject } from "@ipare/inject";
import { JwtService } from "@ipare/jwt";

export const Account = Inject(async (ctx) => {
  const jwtService = await parseInject(ctx, JwtService);
  const jwt = jwtService.decode({
    json: true,
  });
  return (jwt as any)?.account;
});
