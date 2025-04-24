import { PickType } from "@nestjs/swagger";
import { BaseUserDto } from "./base-user.dto";

export class UserPasswordDto extends PickType(BaseUserDto, ['password']) {}