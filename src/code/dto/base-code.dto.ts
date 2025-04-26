import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class BaseCode {
    @ApiProperty({
        description: 'Name of the code',
        type: String,
        example: 'الكود السعودي الكهربائي'
    })
    @IsString()
    @Length(1, 50)
    name: string;

    @ApiProperty({
        description: 'Description of the code',
        type: String,
        example: 'هذا الكود يتضمن كل شيء عن التمديدات الكهربائية'
    })
    @IsString()
    @Length(1, 100)
    description: string;

    @ApiProperty({
        description: 'Collection Name',
        type: String,
        example: 'B1'
    })
    @IsString()
    @Length(1, 50)
    collectionName: string;

    @ApiProperty({
        description: "Book's PDF URL",
        type: String,
        example: ''
    })
    @IsString()
    @Length(1, 500)
    bookUrl: string;

    @ApiProperty({
        description: "Book's photo URL",
        type: String,
        example: ''
    })
    @IsString()
    @Length(1, 500)
    photoUrl: string;
}