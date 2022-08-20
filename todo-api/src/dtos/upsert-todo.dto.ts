import { DtoDescription } from "@ipare/swagger";

@DtoDescription("Todo info")
export class UpsertTodoDto {
  @DtoDescription("Todo content")
  content!: string;

  @DtoDescription("Todo schedule")
  schedule!: number;
}
