import { V } from "@ipare/validator";
import { GetTodoDto } from "./get-todo.dto";
import { PageParamsDto } from "./page-params.dto";

export class TodoPageListDto extends PageParamsDto {
  @V().Description("todo list").Items([GetTodoDto])
  list!: GetTodoDto[];

  @V().Description("total")
  total: number | undefined;
}