import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from 'src/core/models';
import { Repository } from 'typeorm';
import { AddCodeDto } from './dto';
import * as path from 'path';
import { FileStorageService, PdfProcessingService, VectorStoreService } from 'src/core/utils';

@Injectable()
export class CodeService {
    constructor(
        @InjectRepository(Code)
        private codeRepository: Repository<Code>,
        private fileStorageService: FileStorageService,
        private pdfProcessingService: PdfProcessingService,
        private vectorStoreService: VectorStoreService,
    ) {}

    async uploadOldFile(
        addBookDto: AddCodeDto,
        UploadedFilesfiles: {
            book: Express.Multer.File[],
            photo?: Express.Multer.File[]
        }
    ) {
        // 1. Store files
        const bookUrl = await this.fileStorageService.storeFile(
            UploadedFilesfiles.book[0],
            'books',
        );
        
        let photoUrl: string | undefined = undefined;
        if (UploadedFilesfiles.photo) {
            photoUrl = await this.fileStorageService.storeFile(
            UploadedFilesfiles.photo[0],
            'photos',
            );
        }

        // 2. Process PDF into chunks - use the stored file directly
        const filePath = path.join(
            __dirname, 
            '../../uploads', 
            bookUrl.replace('/uploads/', '')
        );
        // const chunks = await this.pdfProcessingService.loadAndSplitPdf(filePath);

        // await this.vectorStoreService.createVectorStore(chunks, addBookDto.name);


        // // 5. Save to database
        const code = this.codeRepository.create({
            name: addBookDto.name,
            description: addBookDto.description,
            bookUrl,
            photoUrl
        });

        return this.codeRepository.save(code);
    }

    async getCodes() {
        return this.codeRepository.findAndCount();
    }
}
