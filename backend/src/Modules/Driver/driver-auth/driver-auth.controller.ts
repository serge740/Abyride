import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { DriverAuthService } from './driver-auth.service';
import { DriverAuthGuard } from '../../../Guards/driver-auth.guard';
import { RequestWithDriver } from '../../../common/interfaces/request-driver.interface';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('driver-auth')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.driverAuthService.driverLogin(body);
    res.cookie('AccessDriverToken', result.token, COOKIE_OPTIONS);
    return { driver: result.driver, message: 'Login successful' };
  }

  @Post('logout')
  @UseGuards(DriverAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessDriverToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(DriverAuthGuard)
  getProfile(@Req() req: RequestWithDriver) {
    return this.driverAuthService.getProfile(req.driver!.id);
  }

  @Patch('change-password')
  @UseGuards(DriverAuthGuard)
  changePassword(@Req() req: RequestWithDriver, @Body() body: any) {
    return this.driverAuthService.changePassword(req.driver!.id, body);
  }

  @Put('profile')
  @UseGuards(DriverAuthGuard)
  updateProfile(@Req() req: RequestWithDriver, @Body() body: any) {
    return this.driverAuthService.updateProfile(req.driver!.id, body);
  }
}
