import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Users } from '../database/entities/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,

        });
    }

    async validate (payload: any) {

        if (payload) {

            let isUser = await Users.query().where({ id: payload?.id }).first();
            if (!isUser) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.FAILED_DEPENDENCY,
                        message: ["User does not exist"],
                        error: "User does not exist",
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
        }


        if (payload.iat) {
            delete payload.iat
        }

        // return { userId: payload.sub, username: payload.username };
        return payload;
    }
}