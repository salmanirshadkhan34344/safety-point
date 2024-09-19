
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
// import { BlockUser } from '../../users/entities/block-users.entity';
import { BlockUser } from 'src/libs/database/entities/block-user.entity';
import { Users } from '../../database/entities/user.entity';

@Injectable()
export class BlockUserInterceptor implements NestInterceptor {
    async intercept (context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { owner_id } = request.body;
        const userId = request.user.id
        if (owner_id) {
            let item: any = await BlockUser.query()
                .where({ block_by: userId, block_to: owner_id })
                .orWhere({ block_by: owner_id, block_to: userId })
                .first()
            if (item) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.GONE,
                        message: [`this content is not available for you`],
                        error: "this content is not available for you"
                    },
                    HttpStatus.GONE,
                );
            }

            if (owner_id) {
                let item: any = await Users.query().where({ id: owner_id, is_deleted: 1 }).first()

                if (item) {
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.NOT_ACCEPTABLE,
                            message: [`this account is not available`],
                            error: "this account is not available"
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }
        }

        return next.handle();
    }
}