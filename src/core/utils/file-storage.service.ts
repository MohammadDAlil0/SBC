// src/file-storage/file-storage.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private uploadDir = path.join(__dirname, '../../uploads');

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDirectoryExists();
  }

  private ensureUploadsDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async storeFile(
    file: Express.Multer.File,
    subfolder: string,
  ): Promise<string> {
    const folderPath = path.join(this.uploadDir, subfolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(folderPath, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return `/uploads/${subfolder}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;
    
    const filePath = path.join(
      this.uploadDir,
      fileUrl.replace('/uploads/', ''),
    );
    
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}