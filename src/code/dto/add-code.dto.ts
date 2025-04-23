import { PickType } from "@nestjs/swagger";
import { BaseCode } from "./base-code.dto";

export class AddCodeDto extends PickType(BaseCode, ['name', 'description']) {}