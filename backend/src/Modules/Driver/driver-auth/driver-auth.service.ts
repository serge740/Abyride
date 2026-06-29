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
export class DriverAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async driverLogin(credentials: { email: string; password: string }) {
    const driver = await this.prisma.driver.findUnique({
      where: { email: credentials.email },
    });

    if (!driver) throw new UnauthorizedException('Invalid credentials');

    if (driver.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account is suspended. Please contact support.');
    }

    const passwordValid = await bcrypt.compare(credentials.password, driver.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign(
      { id: driver.id, email: driver.email, names: driver.names },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    const { password: _, ...driverWithoutPassword } = driver;
    return { driver: driverWithoutPassword, token };
  }

  async getProfile(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
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
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  async changePassword(
    driverId: string,
    data: { currentPassword: string; newPassword: string },
  ) {
    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const valid = await bcrypt.compare(data.currentPassword, driver.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    if (!data.newPassword || data.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await this.prisma.driver.update({ where: { id: driverId }, data: { password: hashed } });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(driverId: string, data: Partial<{ names: string; phone: string }>) {
    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const updated = await this.prisma.driver.update({
      where: { id: driverId },
      data: {
        ...(data.names && { names: data.names }),
        ...(data.phone && { phone: data.phone }),
      },
    });

    const { password: _, ...driverWithoutPassword } = updated;
    return driverWithoutPassword;
  }
}
