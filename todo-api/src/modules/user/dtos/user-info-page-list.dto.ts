import { V } from "@halsp/validator";
import { PageParamsDto } from "../../../dtos/page-params.dto";
import { UserInfoDto } from "./user-info.dto";

export class UserInfoPageListDto extends PageParamsDto {
  @V().Description("user list").Items(UserInfoDto)
  list!: UserInfoDto[];

  @V().Description("total")
  total: number | undefined;
}
