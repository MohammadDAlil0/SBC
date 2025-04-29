import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('book')
export class BookController {
  @Get(':filename')
  streamPdf(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'public', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Book not found');
    }

    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(404).send('Error reading the book');
      }
    });
    

    fileStream.pipe(res);
  }
}
