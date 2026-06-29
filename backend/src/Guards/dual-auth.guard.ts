import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class DualAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminToken = request.cookies?.['AccessAdminToken'];
    const driverToken = request.cookies?.['AccessDriverToken'];
    const memberToken = request.cookies?.['AccessMemberToken'];

    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET as string);
        request.admin = decoded;
        return true;
      } catch {
        // fall through
      }
    }

    if (driverToken) {
      try {
        const decoded = jwt.verify(driverToken, process.env.JWT_SECRET as string);
        request.driver = decoded;
        return true;
      } catch {
        // fall through
      }
    }

    if (memberToken) {
      try {
        const decoded = jwt.verify(memberToken, process.env.JWT_SECRET as string);
        request.member = decoded;
        return true;
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    throw new UnauthorizedException('Authentication required');
  }
}
