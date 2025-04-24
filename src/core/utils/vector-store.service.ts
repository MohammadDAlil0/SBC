// src/vector-store/vector-store.service.ts
import { Injectable } from '@nestjs/common';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VectorStoreService {
  private embeddings: OpenAIEmbeddings;
  private client: QdrantClient;

  constructor(private configService: ConfigService) {
    this.embeddings = new OpenAIEmbeddings({
      modelName: this.configService.getOrThrow('EMBEDDING_MODEL'),
      openAIApiKey: this.configService.getOrThrow('OPENAI_API'),
    });

    this.client = new QdrantClient({
      url: this.configService.getOrThrow('QDRANT_URL'),
      apiKey: this.configService.getOrThrow('QDRANT_API_KEY'),
    });
  }

  async getVectorStore(collectionName: string) {
    return new QdrantVectorStore(this.embeddings, {
      url: this.configService.getOrThrow('QDRANT_URL'),
      collectionName,
      client: this.client,
    });
  }

  async createVectorStore(documents: any[], collectionName: string, batchSize = 100) {
    const vectorStore = new QdrantVectorStore(this.embeddings, {
      url: this.configService.getOrThrow('QDRANT_URL'),
      collectionName,
      client: this.client,
    });
  
    // Process documents in batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await vectorStore.addDocuments(batch);
    }
  
    return vectorStore;
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    try {
      const collections = await this.client.getCollections();
      return collections.collections.some(
        (col) => col.name === collectionName,
      );
    } catch (error) {
      return false;
    }
  }
}