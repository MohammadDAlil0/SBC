import { PickType } from "@nestjs/swagger";
import { BaseUserDto } from "./base-user.dto";

export class UserEmailDto extends PickType(BaseUserDto, ['email']) {}