import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { GlobalResponse } from "../constants/responses";

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map(data => GlobalResponse({
                path: request.url,
                data,
                statusCode: response.statusCode,
                messages: ['Success'],
            }))
        );
    }
}
