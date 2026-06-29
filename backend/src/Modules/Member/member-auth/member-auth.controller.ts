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
import { MemberAuthService } from './member-auth.service';
import { MemberAuthGuard } from '../../../Guards/member-auth.guard';
import { RequestWithMember } from '../../../common/interfaces/request-member.interface';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('member-auth')
export class MemberAuthController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.memberAuthService.memberLogin(body);
    res.cookie('AccessMemberToken', result.token, COOKIE_OPTIONS);
    return { member: result.member, message: 'Login successful' };
  }

  @Post('logout')
  @UseGuards(MemberAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessMemberToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(MemberAuthGuard)
  getProfile(@Req() req: RequestWithMember) {
    return this.memberAuthService.getProfile(req.member!.id);
  }

  @Patch('change-password')
  @UseGuards(MemberAuthGuard)
  changePassword(@Req() req: RequestWithMember, @Body() body: any) {
    return this.memberAuthService.changePassword(req.member!.id, body);
  }

  @Put('profile')
  @UseGuards(MemberAuthGuard)
  updateProfile(@Req() req: RequestWithMember, @Body() body: any) {
    return this.memberAuthService.updateProfile(req.member!.id, body);
  }
}
