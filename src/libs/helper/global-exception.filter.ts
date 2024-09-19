import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ErrorLogs } from '../database/entities/error-logs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    async catch (exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let request: any = ctx.getRequest();
        let exceptionResponse = exception?.response;


        let statusCodeException = exceptionResponse?.statusCode ? exceptionResponse?.statusCode : HttpStatus.BAD_REQUEST
        if (typeof exceptionResponse?.message == 'string') {
            await ErrorLogs.query().insertAndFetch({
                user_id: request?.auth?.user?.id ? request?.auth?.user?.id : null,
                method: request?.method,
                status_code: statusCodeException,
                url: request?.url,
                error:exceptionResponse?.message,
            })
            return response.status(statusCodeException).json({
                statusCode: statusCodeException,
                message:  [exceptionResponse?.message],
                error: exceptionResponse?.message,
            });
        }
        await ErrorLogs.query().insertAndFetch({
            user_id: request?.auth?.user?.id ? request?.auth?.user?.id : null,
            method: request?.method,
            status_code: statusCodeException,
            url: request?.url,
            error: exceptionResponse?.message[0],
        })
        return response.status(statusCodeException).json({
            statusCode: statusCodeException,
            message: exceptionResponse?.message,
            error: exceptionResponse?.error,
        });
    }
}
