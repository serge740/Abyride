import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { AdminAuthGuard } from '../../Guards/admin-auth.guard';
import { DriverAuthGuard } from '../../Guards/driver-auth.guard';
import { DualAuthGuard } from '../../Guards/dual-auth.guard';
import { RequestWithDriver } from '../../common/interfaces/request-driver.interface';
import { Request } from 'express';

interface RequestWithCaller extends Request {
  admin?: { id: string };
  driver?: { id: string };
}

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() body: any) {
    return this.tripService.createTrip(body);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.tripService.findAllForAdmin();
  }

  /** Must come before :id to avoid NestJS matching 'driver-trips' as an id param. */
  @Get('driver-trips')
  @UseGuards(DriverAuthGuard)
  findMyTrips(@Req() req: RequestWithDriver) {
    return this.tripService.findAllForDriver(req.driver!.id);
  }

  /** The trip's UUID acts as a capability token so a guest with no login can check status. */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  /** Public — guest can cancel their own REQUESTED trip using the UUID as a capability token. */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.tripService.cancel(id, body?.reason, false);
  }

  /** Admin — can cancel any non-completed trip regardless of status. */
  @Patch(':id/admin-cancel')
  @UseGuards(AdminAuthGuard)
  adminCancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.tripService.cancel(id, body?.reason, true);
  }

  @Patch(':id/assign')
  @UseGuards(AdminAuthGuard)
  assign(@Param('id') id: string, @Body() body: { driverId: string }) {
    return this.tripService.assign(id, body.driverId);
  }

  /** Driver marks they have arrived at the pickup location. Must be within 100m (enforced for drivers, not admin overrides). */
  @Patch(':id/arrived-pickup')
  @UseGuards(DualAuthGuard)
  arrivedAtPickup(@Param('id') id: string, @Body() body: { lat?: number; lng?: number }, @Req() req: RequestWithCaller) {
    const driverId = req.admin ? undefined : req.driver?.id;
    return this.tripService.arrivedAtPickup(id, driverId, body?.lat, body?.lng);
  }

  /** Driver starts the trip after passenger boards. */
  @Patch(':id/start')
  @UseGuards(DualAuthGuard)
  start(@Param('id') id: string, @Req() req: RequestWithCaller) {
    const driverId = req.admin ? undefined : req.driver?.id;
    return this.tripService.start(id, driverId);
  }

  /** Admin or the assigned driver can complete a trip. */
  @Patch(':id/complete')
  @UseGuards(DualAuthGuard)
  complete(@Param('id') id: string, @Req() req: RequestWithCaller) {
    const driverId = req.admin ? undefined : req.driver?.id;
    return this.tripService.complete(id, driverId);
  }

  @Patch(':id/grant-complete')
  @UseGuards(AdminAuthGuard)
  grantDriverComplete(@Param('id') id: string) {
    return this.tripService.grantDriverComplete(id);
  }

  @Patch(':id/mark-paid')
  @UseGuards(AdminAuthGuard)
  markPaid(@Param('id') id: string) {
    return this.tripService.markPaidManually(id);
  }

  @Patch(':id/mark-unpaid')
  @UseGuards(AdminAuthGuard)
  markUnpaid(@Param('id') id: string) {
    return this.tripService.markUnpaid(id);
  }
}
