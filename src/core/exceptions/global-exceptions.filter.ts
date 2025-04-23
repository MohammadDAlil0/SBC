import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GlobalResponse } from '../constants';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(BadRequestException)
export class badRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let messages = ['Bad Exception'];
    if (Array.isArray((exception.getResponse() as any).message)) messages = (exception.getResponse() as any).message;
    else if ((exception.getResponse() as any).message) messages = [(exception.getResponse() as any).message]; 

    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: messages
    }));
  }
}

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = exception.message || 'Conflic at the database level';
    let statusCode = HttpStatus.CONFLICT;
    if (exception.constructor.name === 'EntityNotFoundError') {
      message = 'Entity not found';
      statusCode =  HttpStatus.NOT_FOUND;
    }

    response.status(statusCode).json(GlobalResponse({
      path: request.url,
      statusCode: statusCode,
      messages: [message]
    }));
  }
}

@Catch()
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = (exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR)

    console.log(exception.constructor.name);
    
    response.status(statusCode).json(GlobalResponse({
      path: request.url,
      statusCode: statusCode,
      messages: [exception.message]
    }));
  }
}