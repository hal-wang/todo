import { V } from "@ipare/validator";

export class GetBingImageDto {
  @V()
  "startdate"!: string;
  @V()
  "fullstartdate"!: number;
  @V()
  "enddate"!: number;
  @V()
  "url"!: string;
  @V()
  "urlbase": string;
  @V()
  "copyright": string;
  @V()
  "copyrightlink": string;
  @V()
  "title": string;
  @V()
  "quiz": string;
  @V()
  "wp": boolean;
  @V()
  "hsh": string;
  @V()
  "drk": 0 | 1;
  @V()
  "top": 0 | 1;
  @V()
  "bot": 0 | 1;
  @V().Items(String)
  "hs": [];
}
