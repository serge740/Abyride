import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripPaymentWebhookController } from './trip-payment-webhook.controller';
import { TripReminderService } from './trip-reminder.service';
import { MemberModule } from '../Member/member.module';
import { DriverAuthModule } from '../Driver/driver-auth/driver-auth.module';

@Module({
  imports: [MemberModule, DriverAuthModule],
  controllers: [TripController, TripPaymentWebhookController],
  providers: [TripService, TripReminderService],
  exports: [TripService],
})
export class TripModule {}
