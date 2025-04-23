import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export function AddCodeDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Upload a new code with book and photo' }),
        ApiConsumes('multipart/form-data'),
        ApiResponse({ 
            status: 201, 
            description: 'Returns the created code with book and photo URLs' 
        }),
        ApiResponse({ 
            status: 400, 
            description: 'Invalid file type or missing required fields' 
        }),
        ApiBody({
            schema: {
                type: 'object',
                required: ['name', 'book'],
                properties: {
                    name: { 
                        type: 'string',
                        example: 'الكود السعودي الكهربائي',
                        description: 'Name of the code/book' 
                    },
                    description: { 
                        type: 'string',
                        example: 'هذا الكود يتضمن كل شيء عن التمديدات الكهربائية',
                        description: 'Optional description' 
                    },
                    book: {
                        type: 'string',
                        format: 'binary',
                        description: 'PDF book file (required)',
                    },
                    photo: {
                        type: 'string',
                        format: 'binary',
                        description: 'Optional cover photo (JPEG)',
                    },
                },
            },
        }),
        UseInterceptors(FileFieldsInterceptor([
            { name: 'book', maxCount: 1 },
            { name: 'photo', maxCount: 1 }
        ]))
    );
}

export function GetCodesDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Codes' }),
        ApiResponse({ status: 200, description: 'You will get a list of codes' }),
        // ApiBearerAuth(),
    );
}