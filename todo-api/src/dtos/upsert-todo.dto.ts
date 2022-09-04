import { V } from "@ipare/validator";

@V().Description("Todo info")
export class UpsertTodoDto {
  @V().Description("Todo content")
  content!: string;

  @V().Description("Todo schedule")
  schedule!: number;
}
