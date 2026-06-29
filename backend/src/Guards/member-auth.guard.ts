import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MemberAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['AccessMemberToken'];

    if (!token) {
      throw new UnauthorizedException('Member access token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      request.member = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired member token');
    }
  }
}
