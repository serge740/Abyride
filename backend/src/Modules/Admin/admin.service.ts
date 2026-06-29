import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async adminLogin(credentials: { email: string; password: string }) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: credentials.email },
    });

    if (!admin) throw new UnauthorizedException('Invalid email or password');

    const passwordValid = await bcrypt.compare(credentials.password, admin.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid email or password');

    const payload = { id: admin.id, email: admin.email, names: admin.names };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    const { password: _, ...adminWithoutPassword } = admin;
    return { admin: adminWithoutPassword, token };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async editProfile(
    adminId: string,
    data: { names?: string; email?: string },
  ) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (data.email && data.email !== admin.email) {
      const existing = await this.prisma.admin.findUnique({ where: { email: data.email } });
      if (existing) throw new BadRequestException('Email already in use');
    }

    const updated = await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        ...(data.names && { names: data.names }),
        ...(data.email && { email: data.email }),
      },
    });

    const token = this.jwtService.sign(
      { id: updated.id, email: updated.email, names: updated.names },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    const { password: _, ...adminWithoutPassword } = updated;
    return { admin: adminWithoutPassword, token };
  }

  async changePassword(
    adminId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    const valid = await bcrypt.compare(data.currentPassword, admin.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    if (!data.newPassword || data.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });

    return { message: 'Password changed successfully' };
  }
}
