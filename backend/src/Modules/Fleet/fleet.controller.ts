import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FleetService } from './fleet.service';
import { AdminAuthGuard } from '../../Guards/admin-auth.guard';

@Controller('fleets')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get()
  findAll() {
    return this.fleetService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fleetService.findOne(id);
  }

  @Get('admin/all')
  @UseGuards(AdminAuthGuard)
  findAllForAdmin() {
    return this.fleetService.findAll(false);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() body: any) {
    return this.fleetService.create(body);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.fleetService.update(id, body);
  }

  @Patch(':id/activate')
  @UseGuards(AdminAuthGuard)
  activate(@Param('id') id: string) {
    return this.fleetService.setStatus(id, 'ACTIVE');
  }

  @Patch(':id/deactivate')
  @UseGuards(AdminAuthGuard)
  deactivate(@Param('id') id: string) {
    return this.fleetService.setStatus(id, 'INACTIVE');
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.fleetService.remove(id);
  }
}
