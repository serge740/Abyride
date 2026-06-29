import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './Prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { EmailModule } from './Global/email/email.module';
import { SocketModule } from './Global/socket/socket.module';
import { CloudinaryModule } from './Global/cloudinary/cloudinary.module';
import { AdminModule } from './Modules/Admin/admin.module';
import { DriverModule } from './Modules/Driver/driver.module';
import { MemberModule } from './Modules/Member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 400 }]),
    PrismaModule,
    CommonModule,
    EmailModule,
    SocketModule,
    CloudinaryModule,
    AdminModule,
    DriverModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
