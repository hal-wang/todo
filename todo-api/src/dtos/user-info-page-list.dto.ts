import { V } from "@ipare/validator";
import { PageParamsDto } from "./page-params.dto";
import { UserInfoDto } from "./user-info.dto";

export class UserInfoPageListDto extends PageParamsDto {
  @V().Description("user list").Items([UserInfoDto])
  list!: UserInfoDto[];

  @V().Description("total")
  total: number | undefined;
}
