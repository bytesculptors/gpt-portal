import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { NotFoundError, Observable } from "rxjs";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private refector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const requiredRoles = this.refector.getAllAndOverride<Role>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredRoles) {
            return true
        }
        const { user } = request
        if (!user) {
            throw new NotFoundException('User not found in request!!')
        }
        console.log(requiredRoles[0]);

        return requiredRoles[0] === user.role
    }
}