import { Body, Controller, Get, Post, UploadedFiles } from '@nestjs/common';
import { CodeService } from './code.service';
import { AddCodeDto } from './dto/add-code.dto';
import { AddCodeDecorator, GetCodesDecorator } from 'src/core/decorators/appliers';

@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Post()
    @AddCodeDecorator()
    uploadOldFile(
        @Body() addBookDto: AddCodeDto,
        @UploadedFiles() files: {
            book: Express.Multer.File[],
            photo?: Express.Multer.File[]
        }
    ) {
        return this.codeService.uploadOldFile(addBookDto, files);
    }

    @Get()
    @GetCodesDecorator()
    getCodesDecorator() {
        return this.codeService.getCodes();
    }
}
