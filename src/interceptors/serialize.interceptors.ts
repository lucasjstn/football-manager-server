import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from 'rxjs/operators'
import { plainToClass } from "class-transformer"

export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        console.log("I'm running before the handler", context);

        return handler.handle().pipe(
            map((data: any) => {
                console.log('Im running before the response is sent out', data);
            })
        )
    }
}