import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const matchRoles = (roles, userRoles) => {
    return roles.some(role => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate (context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const req = context.switchToHttp().getRequest() as any;
        const user = req.user;
        const result = matchRoles(roles, user.role);
        if (result) {
            return true
        }
        throw new HttpException(
            {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: [`unauthorized user`],
                error: "`unauthorized user"
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
