import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class QuestionDto {
    @ApiProperty({
        description: 'Questio Of The User',
        type: String,
        example: 'اشرح الكتاب بالمختصر المفيد'
    })
    @IsString()
    @Length(1, 1000)
    content: string;
}
