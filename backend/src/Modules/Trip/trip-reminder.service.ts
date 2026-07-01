import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TripService } from './trip.service';
import { EmailService } from '../../Global/email/email.service';

/**
 * SchedulePage.jsx already promises riders "we'll send a reminder 60 minutes
 * before pickup" — this job is what makes that true.
 */
@Injectable()
export class TripReminderService {
  private readonly logger = new Logger(TripReminderService.name);

  constructor(
    private readonly tripService: TripService,
    private readonly emailService: EmailService,
  ) {}

  @Cron('*/5 * * * *')
  async sendUpcomingReminders() {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 55 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 65 * 60 * 1000);

    const trips = await this.tripService.findTripsNeedingReminder(windowStart, windowEnd);

    for (const trip of trips) {
      try {
        await this.emailService.sendTripReminderEmail({
          email: trip.member.email,
          name: trip.member.names,
          pickupAddress: trip.pickupAddress,
          scheduledAt: trip.scheduledAt as Date,
        });
        await this.tripService.markReminderSent(trip.id);
      } catch (err) {
        this.logger.error(`Failed to send reminder for trip ${trip.id}: ${err?.message}`);
      }
    }
  }
}
