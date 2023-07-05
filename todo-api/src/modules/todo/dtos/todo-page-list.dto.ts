import { V } from "@halsp/validator";
import { GetTodoDto } from "./get-todo.dto";
import { PageParamsDto } from "../../../dtos/page-params.dto";

@V().Description("todo page list")
export class TodoPageListDto extends PageParamsDto {
  @V().Description("todo list").Items(GetTodoDto)
  list!: GetTodoDto[];

  @V().Description("total")
  total: number | undefined;
}
