import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isUndefined } from 'lodash';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';
import { Users } from '../database/entities/user.entity';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email', passReqToCallback: true });
    }

    async validate(req: Request, email: string, password: string): Promise<any> {
        let bodyReq: any = req.body;
        if (isUndefined(bodyReq.device_token)) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: [`device_token required`],
                    error: "device_token required "
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const user = await this.authService.validateUser(email, password, bodyReq.device_token);
        if (!user) {
            throw new HttpException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: [`Incorrect email or password`],
                error: "Incorrect email or password"
            },
                HttpStatus.UNAUTHORIZED,
            );
        }
        if (user.is_block == 1) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: [`your account temporarily locked by admin`],
                    error: 'your account temporarily locked by admin',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        if (user.is_deleted == 1) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: [`this account is not available`],
                    error: 'this account is not available',
                },
                HttpStatus.BAD_REQUEST,
            );
        }


        await Users.query().updateAndFetchById(user.id, {
            longitude: bodyReq.longitude,
            latitude: bodyReq.latitude,
        })
        return user;
    }
}