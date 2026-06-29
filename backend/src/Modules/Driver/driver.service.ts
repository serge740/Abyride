import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/email/email.service';
import { CloudinaryService } from '../../Global/cloudinary/cloudinary.service';
import { generatePassword } from '../../common/utils/generate-password.util';
import { DriverStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(data: {
    names: string;
    email: string;
    phone?: string;
    status?: DriverStatus;
    profileImg?: string;
    licenseImage?: string;
    vehicleImage?: string;
    licenseDocument?: string;
    insuranceDocument?: string;
  }) {
    const existing = await this.prisma.driver.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('A driver with this email already exists');

    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const driver = await this.prisma.driver.create({
      data: {
        names: data.names,
        email: data.email,
        phone: data.phone ?? null,
        status: data.status ?? DriverStatus.PENDING,
        password: hashedPassword,
        profileImg: data.profileImg ?? null,
        licenseImage: data.licenseImage ?? null,
        vehicleImage: data.vehicleImage ?? null,
        licenseDocument: data.licenseDocument ?? null,
        insuranceDocument: data.insuranceDocument ?? null,
      },
    });

    let emailSent = true;
    try {
      await this.emailService.sendWelcomeEmail({
        email: driver.email,
        name: driver.names,
        tempPassword: rawPassword,
        role: 'driver',
      });
    } catch (err) {
      emailSent = false;
      console.error('Failed to send welcome email:', err?.message);
    }

    const { password: _, ...driverWithoutPassword } = driver;
    return {
      ...driverWithoutPassword,
      emailSent,
      ...(emailSent ? {} : { tempPassword: rawPassword }),
    };
  }

  async findAll() {
    return this.prisma.driver.findMany({
      select: {
        id: true,
        names: true,
        email: true,
        phone: true,
        status: true,
        profileImg: true,
        licenseImage: true,
        vehicleImage: true,
        licenseDocument: true,
        insuranceDocument: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      select: {
        id: true,
        names: true,
        email: true,
        phone: true,
        status: true,
        profileImg: true,
        licenseImage: true,
        vehicleImage: true,
        licenseDocument: true,
        insuranceDocument: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  async update(
    id: string,
    data: Partial<{
      names: string;
      phone: string;
      status: DriverStatus;
      profileImg: string;
      licenseImage: string;
      vehicleImage: string;
      licenseDocument: string;
      insuranceDocument: string;
    }>,
  ) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Driver not found');

    if (data.profileImg && driver.profileImg) this.cloudinary.deleteByUrl(driver.profileImg, 'image');
    if (data.licenseImage && driver.licenseImage) this.cloudinary.deleteByUrl(driver.licenseImage, 'image');
    if (data.vehicleImage && driver.vehicleImage) this.cloudinary.deleteByUrl(driver.vehicleImage, 'image');
    if (data.licenseDocument && driver.licenseDocument) this.cloudinary.deleteByUrl(driver.licenseDocument, 'raw');
    if (data.insuranceDocument && driver.insuranceDocument) this.cloudinary.deleteByUrl(driver.insuranceDocument, 'raw');

    const updated = await this.prisma.driver.update({
      where: { id },
      data: {
        ...(data.names && { names: data.names }),
        ...(data.phone && { phone: data.phone }),
        ...(data.status && { status: data.status }),
        ...(data.profileImg && { profileImg: data.profileImg }),
        ...(data.licenseImage && { licenseImage: data.licenseImage }),
        ...(data.vehicleImage && { vehicleImage: data.vehicleImage }),
        ...(data.licenseDocument && { licenseDocument: data.licenseDocument }),
        ...(data.insuranceDocument && { insuranceDocument: data.insuranceDocument }),
      },
    });

    const { password: _, ...driverWithoutPassword } = updated;
    return driverWithoutPassword;
  }

  async setStatus(id: string, status: DriverStatus) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Driver not found');
    await this.prisma.driver.update({ where: { id }, data: { status } });
    return { message: `Driver ${status.toLowerCase()} successfully` };
  }

  async remove(id: string) {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Driver not found');
    await this.prisma.driver.delete({ where: { id } });
    return { message: 'Driver deleted successfully' };
  }
}
