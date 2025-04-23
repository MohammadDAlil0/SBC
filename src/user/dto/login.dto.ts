import { PickType } from "@nestjs/swagger";
import { BaseUserDto } from "./base-user.dto";

export class LoginDto extends PickType(BaseUserDto, ['email', 'password']) {}