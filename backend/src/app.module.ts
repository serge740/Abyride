import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './Prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { EmailModule } from './Global/email/email.module';
import { SocketModule } from './Global/socket/socket.module';
import { CloudinaryModule } from './Global/cloudinary/cloudinary.module';
import { PaymentModule } from './Global/payment/payment.module';
import { AdminModule } from './Modules/Admin/admin.module';
import { DriverModule } from './Modules/Driver/driver.module';
import { MemberModule } from './Modules/Member/member.module';
import { FleetModule } from './Modules/Fleet/fleet.module';
import { TripModule } from './Modules/Trip/trip.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 400 }]),
    PrismaModule,
    CommonModule,
    EmailModule,
    SocketModule,
    CloudinaryModule,
    PaymentModule,
    AdminModule,
    DriverModule,
    MemberModule,
    FleetModule,
    TripModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
