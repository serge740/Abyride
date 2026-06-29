import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DriverAuthService } from './driver-auth.service';
import { DriverAuthController } from './driver-auth.controller';
import { DriverAuthGuard } from '../../../Guards/driver-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [DriverAuthController],
  providers: [DriverAuthService, DriverAuthGuard],
  exports: [DriverAuthService, DriverAuthGuard],
})
export class DriverAuthModule {}
