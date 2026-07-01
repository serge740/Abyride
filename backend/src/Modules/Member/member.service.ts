import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { EmailService } from '../../Global/email/email.service';
import { CloudinaryService } from '../../Global/cloudinary/cloudinary.service';
import { generatePassword } from '../../common/utils/generate-password.util';
import { MemberStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(data: {
    names: string;
    email: string;
    phone?: string;
    profileImg?: string;
  }) {
    const existing = await this.prisma.member.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('A member with this email already exists');

    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const member = await this.prisma.member.create({
      data: {
        names: data.names,
        email: data.email,
        phone: data.phone ?? null,
        password: hashedPassword,
        profileImg: data.profileImg ?? null,
      },
    });

    let emailSent = true;
    try {
      await this.emailService.sendWelcomeEmail({
        email: member.email,
        name: member.names,
        tempPassword: rawPassword,
        role: 'member',
      });
    } catch (err) {
      emailSent = false;
      console.error('Failed to send welcome email:', err?.message);
    }

    const { password: _, ...memberWithoutPassword } = member;
    return {
      ...memberWithoutPassword,
      emailSent,
      ...(emailSent ? {} : { tempPassword: rawPassword }),
    };
  }

  /**
   * Used by guest checkout (trip booking): returns the existing Member for this
   * email, or silently creates one (same onboarding as an admin-created member —
   * generated password + welcome email). Not exposed via any public REST route.
   */
  async findOrCreateGuest(data: { names: string; email: string; phone?: string }) {
    const existing = await this.prisma.member.findUnique({ where: { email: data.email } });
    if (existing) return existing;

    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const member = await this.prisma.member.create({
      data: {
        names: data.names,
        email: data.email,
        phone: data.phone ?? null,
        password: hashedPassword,
      },
    });

    try {
      await this.emailService.sendWelcomeEmail({
        email: member.email,
        name: member.names,
        tempPassword: rawPassword,
        role: 'member',
      });
    } catch (err) {
      console.error('Failed to send welcome email:', err?.message);
    }

    return member;
  }

  async findAll() {
    return this.prisma.member.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
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

  async update(
    id: string,
    data: Partial<{ names: string; phone: string; profileImg: string }>,
  ) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');

    if (data.profileImg && member.profileImg) {
      this.cloudinary.deleteByUrl(member.profileImg, 'image');
    }

    const updated = await this.prisma.member.update({
      where: { id },
      data: {
        ...(data.names && { names: data.names }),
        ...(data.phone && { phone: data.phone }),
        ...(data.profileImg && { profileImg: data.profileImg }),
      },
    });

    const { password: _, ...memberWithoutPassword } = updated;
    return memberWithoutPassword;
  }

  async setStatus(id: string, status: MemberStatus) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    await this.prisma.member.update({ where: { id }, data: { status } });
    return { message: `Member ${status.toLowerCase()} successfully` };
  }

  async remove(id: string) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    await this.prisma.member.delete({ where: { id } });
    return { message: 'Member deleted successfully' };
  }
}
