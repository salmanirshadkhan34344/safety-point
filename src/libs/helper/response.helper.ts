import { HttpStatus } from "@nestjs/common";
import { ErrorLogs } from "../database/orm/error-logs";

export class ResponseHelper {

    static async success ({ res, data }) {
        return res.status(HttpStatus.OK).json({
            data: data,
            statusCode: HttpStatus.OK,
            message: 'success',
        });
    }


    static async error ({ res, error, req, errorCode = HttpStatus.BAD_REQUEST }) {
        await ErrorLogs.query().insertAndFetch({
            user_id: req?.auth?.user?.id ? req?.auth?.user?.id : null,
            method: req.method,
            status_code: errorCode,
            url: req.url,
            error: error?.message,
        })
        return res.status(errorCode).json({
            statusCode: errorCode,
            message: [error?.message, `error in ${req.originalUrl}`],
            error: error?.response,
        });
    }

}