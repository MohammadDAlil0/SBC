import { ApiProperty, PickType } from "@nestjs/swagger";
import { BaseUserDto } from "./base-user.dto";
import { IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/core/decorators/validators";

export class CreateUserDto extends PickType(BaseUserDto, [
    'firstName',
    'lastName',
    'email',
    'password',
    'company',
    'phone',
    'country',
    'timezone',
] as const) {
    @ApiProperty({
        description: 'Confirm your password',
        type: String,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}