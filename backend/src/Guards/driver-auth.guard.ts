import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['AccessDriverToken'];

    if (!token) {
      throw new UnauthorizedException('Driver access token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      request.driver = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired driver token');
    }
  }
}
