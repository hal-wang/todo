import { V } from "@ipare/validator";

@V().Description("Page params")
export class PageParamsDto {
  @V().Description("Page index")
  readonly page?: number;

  @V().Description("Per page limit")
  readonly limit?: number;
}
