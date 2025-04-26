import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import { Match } from "../../core/decorators/validators";

export class BaseUserDto {
    @ApiProperty({
        description: 'First name of a user',
        type: String,
        example: 'Ahmad'
    })
    @IsString()
    @Length(1, 50)
    firstName: string;
    
    @ApiProperty({
        description: 'Last name of a user',
        type: String,
        example: 'Maki'
    })
    @IsString()
    @Length(1, 50)
    lastName: string;
    
    @ApiProperty({
        description: 'Email of a user',
        type: String,
        example: 'ahmad@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of a user',
        type: String,
        minLength: 8,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: 'Company of a user',
        type: String,
        example: 'Google'
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    company?: string;

    @ApiProperty({
        description: 'Phone Number of a user',
        type: String,
        example: '+963958463123'
    })
    @IsOptional()
    phone?: string;
    
    @ApiProperty({
        description: 'Country of a user',
        type: String,
        example: 'Syria'
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    country: string;
    
    @ApiProperty({
        description: 'Timezone of a user',
        type: String,
        example: 'Syria (UTC+03:00)'
    })
    @IsOptional()
    @Length(1, 50)
    timezone?: string;
}