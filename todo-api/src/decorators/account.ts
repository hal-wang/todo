import { Context } from "@halsp/core";
import { Inject } from "@halsp/inject";
import { JwtService } from "@halsp/jwt";

export async function getAccountFromToken(ctx: Context) {
  const jwtService = await ctx.getService(JwtService);
  const jwt = jwtService.decode({
    json: true,
  });
  return (jwt as any)?.account;
}

export const Account = Inject(async (ctx) => {
  return await getAccountFromToken(ctx);
});
