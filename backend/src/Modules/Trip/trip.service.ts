import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/email/email.service';
import { AppSocketGateway } from '../../Global/socket/socket.gateway';
import { MemberService } from '../Member/member.service';
import { getRoute, haversineKm } from '../../common/utils/routing.util';

const ARRIVAL_RADIUS_KM = 0.1; // 100m
import { FleetStatus, TripStatus, DriverStatus, PaymentStatus } from '@prisma/client';

const TRIP_INCLUDE = {
  member: { select: { id: true, names: true, email: true, phone: true } },
  driver: { select: { id: true, names: true, email: true, phone: true, status: true } },
  fleet: true,
};

@Injectable()
export class TripService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly socketGateway: AppSocketGateway,
    private readonly memberService: MemberService,
  ) {}

  async createTrip(data: {
    names: string;
    email: string;
    phone?: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
    fleetId: string;
    scheduledAt?: string;
    paymentMethod?: string;
  }) {
    if (!data.pickupAddress || !data.dropoffAddress || !data.fleetId) {
      throw new BadRequestException('pickupAddress, dropoffAddress and fleetId are required');
    }
    if (!data.names || !data.email) {
      throw new BadRequestException('Rider name and email are required');
    }

    const fleet = await this.prisma.fleet.findUnique({ where: { id: data.fleetId } });
    if (!fleet || fleet.status !== FleetStatus.ACTIVE) {
      throw new BadRequestException('Selected fleet is not available');
    }

    const member = await this.memberService.findOrCreateGuest({
      names: data.names,
      email: data.email,
      phone: data.phone,
    });

    let route;
    try {
      route = await getRoute(
        [Number(data.pickupLat), Number(data.pickupLng)],
        [Number(data.dropoffLat), Number(data.dropoffLng)],
      );
    } catch {
      throw new BadGatewayException('Could not calculate a route for the given addresses. Please try again.');
    }

    const fare = route.distanceKm * fleet.perKmRate;

    const trip = await this.prisma.trip.create({
      data: {
        memberId: member.id,
        fleetId: fleet.id,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        pickupLat: Number(data.pickupLat),
        pickupLng: Number(data.pickupLng),
        dropoffLat: Number(data.dropoffLat),
        dropoffLng: Number(data.dropoffLng),
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        fare,
        paymentMethod: data.paymentMethod || 'CASH',
        status: TripStatus.REQUESTED,
      },
      include: TRIP_INCLUDE,
    });

    this.socketGateway.emitToAllAdmins('trip:created', trip);

    try {
      await this.emailService.sendTripConfirmationEmail({
        email: member.email,
        name: member.names,
        pickupAddress: trip.pickupAddress,
        dropoffAddress: trip.dropoffAddress,
        fare,
        scheduledAt: trip.scheduledAt,
      });
    } catch (err) {
      console.error('Failed to send trip confirmation email:', err?.message);
    }

    return { trip };
  }

  async findAllForAdmin() {
    return this.prisma.trip.findMany({
      include: TRIP_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id }, include: TRIP_INCLUDE });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async assign(tripId: string, driverId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.REQUESTED) {
      throw new BadRequestException('Only requested trips can be assigned a driver');
    }

    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');
    if (driver.status !== DriverStatus.ACTIVE) {
      throw new BadRequestException('Driver is not active');
    }
    if (driver.fleetId !== trip.fleetId) {
      throw new BadRequestException("Driver's fleet does not match the trip's requested fleet");
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { driverId, status: TripStatus.ACCEPTED },
      include: TRIP_INCLUDE,
    });

    this.socketGateway.emitToAllAdmins('trip:assigned', updated);
    this.socketGateway.emitToMember(updated.memberId, 'trip:assigned', updated);
    this.socketGateway.emitToDriver(driverId, 'trip:assigned', updated);

    try {
      await this.emailService.sendTripAssignedEmail({
        email: updated.member.email,
        name: updated.member.names,
        driverName: updated.driver?.names || 'Your driver',
      });
    } catch (err) {
      console.error('Failed to send trip assigned email:', err?.message);
    }

    return updated;
  }

  async arrivedAtPickup(tripId: string, callerId?: string, lat?: number, lng?: number) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.ACCEPTED) {
      throw new BadRequestException('Trip must be in ACCEPTED status');
    }
    if (callerId && trip.driverId !== callerId) {
      throw new BadRequestException('You are not assigned to this trip');
    }

    // Drivers must be physically near the pickup point to self-report arrival.
    // Admin overrides (no callerId) skip this check.
    if (callerId) {
      if (lat === undefined || lat === null || lng === undefined || lng === null) {
        throw new BadRequestException('Current location is required to mark arrival');
      }
      const distanceKm = haversineKm([Number(lat), Number(lng)], [trip.pickupLat, trip.pickupLng]);
      if (distanceKm > ARRIVAL_RADIUS_KM) {
        throw new BadRequestException(
          `You must be within 100m of the pickup location to mark arrival (currently ${Math.round(distanceKm * 1000)}m away)`,
        );
      }
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.ARRIVED_AT_PICKUP },
      include: TRIP_INCLUDE,
    });
    this.socketGateway.emitToMember(updated.memberId, 'trip:statusChanged', updated);
    this.socketGateway.emitToAllAdmins('trip:statusChanged', updated);
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:statusChanged', updated);
    return updated;
  }

  async start(tripId: string, callerId?: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.ARRIVED_AT_PICKUP) {
      throw new BadRequestException('Driver must arrive at pickup before starting the trip');
    }
    if (callerId && trip.driverId !== callerId) {
      throw new BadRequestException('You are not assigned to this trip');
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.IN_PROGRESS },
      include: TRIP_INCLUDE,
    });
    this.socketGateway.emitToMember(updated.memberId, 'trip:statusChanged', updated);
    this.socketGateway.emitToAllAdmins('trip:statusChanged', updated);
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:statusChanged', updated);
    return updated;
  }

  async complete(tripId: string, callerId?: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress trips can be completed');
    }
    if (callerId) {
      if (trip.driverId !== callerId) throw new BadRequestException('You are not assigned to this trip');
      if (!trip.driverCanComplete) throw new ForbiddenException('Admin has not granted you permission to complete this trip');
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.COMPLETED },
      include: TRIP_INCLUDE,
    });
    this.socketGateway.emitToMember(updated.memberId, 'trip:statusChanged', updated);
    this.socketGateway.emitToAllAdmins('trip:statusChanged', updated);
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:statusChanged', updated);

    try {
      await this.emailService.sendTripCompletedEmail({
        email: updated.member.email,
        name: updated.member.names,
        fare: updated.fare ?? 0,
      });
    } catch (err) {
      console.error('Failed to send trip completed email:', err?.message);
    }

    return updated;
  }

  async cancel(tripId: string, reason?: string, isAdmin = false) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELLED) {
      throw new BadRequestException(`Trip is already ${trip.status.toLowerCase()}`);
    }
    if (!isAdmin && trip.status !== TripStatus.REQUESTED) {
      throw new BadRequestException('Only unassigned trips can be cancelled without admin access');
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        status: TripStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason ?? null,
      },
      include: TRIP_INCLUDE,
    });

    this.socketGateway.emitToAllAdmins('trip:statusChanged', updated);
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:statusChanged', updated);

    return updated;
  }

  async findByPaymentIntentId(paymentIntentId: string) {
    return this.prisma.trip.findUnique({ where: { stripePaymentIntentId: paymentIntentId } });
  }

  async markPaid(paymentIntentId: string) {
    const trip = await this.findByPaymentIntentId(paymentIntentId);
    if (!trip) return;
    await this.prisma.trip.update({
      where: { id: trip.id },
      data: { paymentStatus: 'PAID', paidAt: new Date() },
    });
    this.socketGateway.emitToAllAdmins('trip:paymentUpdated', { tripId: trip.id, paymentStatus: 'PAID' });
  }

  async markFailed(paymentIntentId: string) {
    const trip = await this.findByPaymentIntentId(paymentIntentId);
    if (!trip) return;
    await this.prisma.trip.update({
      where: { id: trip.id },
      data: { paymentStatus: 'FAILED' },
    });
    this.socketGateway.emitToAllAdmins('trip:paymentUpdated', { tripId: trip.id, paymentStatus: 'FAILED' });
  }

  async markPaidManually(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { paymentStatus: 'PAID', paidAt: new Date() },
      include: TRIP_INCLUDE,
    });
    this.socketGateway.emitToAllAdmins('trip:paymentUpdated', { tripId, paymentStatus: 'PAID' });
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:paymentUpdated', { tripId, paymentStatus: 'PAID' });
    return updated;
  }

  async markUnpaid(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { paymentStatus: 'PENDING', paidAt: null },
      include: TRIP_INCLUDE,
    });
    this.socketGateway.emitToAllAdmins('trip:paymentUpdated', { tripId, paymentStatus: 'PENDING' });
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:paymentUpdated', { tripId, paymentStatus: 'PENDING' });
    return updated;
  }

  async grantDriverComplete(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { driverCanComplete: !trip.driverCanComplete },
      include: TRIP_INCLUDE,
    });
    const payload = { tripId, driverCanComplete: updated.driverCanComplete };
    this.socketGateway.emitToAllAdmins('trip:permissionChanged', payload);
    if (updated.driverId) this.socketGateway.emitToDriver(updated.driverId, 'trip:permissionChanged', payload);
    return updated;
  }

  async findAllForDriver(driverId: string) {
    return this.prisma.trip.findMany({
      where: { driverId },
      include: TRIP_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Used by the reminder cron job. */
  async findTripsNeedingReminder(windowStart: Date, windowEnd: Date) {
    return this.prisma.trip.findMany({
      where: {
        scheduledAt: { gte: windowStart, lte: windowEnd },
        reminderSentAt: null,
        status: { in: [TripStatus.REQUESTED, TripStatus.ACCEPTED, TripStatus.ARRIVED_AT_PICKUP] },
      },
      include: TRIP_INCLUDE,
    });
  }

  async markReminderSent(tripId: string) {
    await this.prisma.trip.update({ where: { id: tripId }, data: { reminderSentAt: new Date() } });
  }
}
