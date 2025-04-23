import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

@Injectable()
export class PdfProcessingService {
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor(private configService: ConfigService) {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: +this.configService.getOrThrow('CHUNK_SIZE'),
      chunkOverlap: +this.configService.getOrThrow('CHUNK_OVERLAP'),
    });
  }

  async loadAndSplitPdf(filePath: string): Promise<any> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return this.textSplitter.splitDocuments(docs);
  }
}
