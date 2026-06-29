import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MemberAuthService } from './member-auth.service';
import { MemberAuthController } from './member-auth.controller';
import { MemberAuthGuard } from '../../../Guards/member-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MemberAuthController],
  providers: [MemberAuthService, MemberAuthGuard],
  exports: [MemberAuthService, MemberAuthGuard],
})
export class MemberAuthModule {}
