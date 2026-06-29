import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MemberAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async memberLogin(credentials: { email: string; password: string }) {
    const member = await this.prisma.member.findUnique({
      where: { email: credentials.email },
    });

    if (!member) throw new UnauthorizedException('Invalid credentials');

    if (member.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account is suspended. Please contact support.');
    }

    const passwordValid = await bcrypt.compare(credentials.password, member.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign(
      { id: member.id, email: member.email, names: member.names },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    const { password: _, ...memberWithoutPassword } = member;
    return { member: memberWithoutPassword, token };
  }

  async getProfile(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        names: true,
        email: true,
        phone: true,
        status: true,
        profileImg: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async changePassword(
    memberId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const valid = await bcrypt.compare(data.currentPassword, member.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    if (!data.newPassword || data.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.member.update({ where: { id: memberId }, data: { password: hashed } });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(memberId: string, data: Partial<{ names: string; phone: string }>) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const updated = await this.prisma.member.update({
      where: { id: memberId },
      data: {
        ...(data.names && { names: data.names }),
        ...(data.phone && { phone: data.phone }),
      },
    });

    const { password: _, ...memberWithoutPassword } = updated;
    return memberWithoutPassword;
  }
}
