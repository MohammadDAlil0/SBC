import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from 'src/core/models';
import { FileStorageService, PdfProcessingService, VectorStoreService } from 'src/core/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Code])
  ],
  controllers: [CodeController],
  providers: [
    CodeService,
    FileStorageService,
    PdfProcessingService,
    VectorStoreService
  ]
})
export class CodeModule {}
