import { Inject, parseInject } from "@halsp/inject";
import { JwtService } from "@halsp/jwt";

export const Account = Inject(async (ctx) => {
  const jwtService = await parseInject(ctx, JwtService);
  const jwt = jwtService.decode({
    json: true,
  });
  return (jwt as any)?.account;
});
