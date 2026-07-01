import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { FleetCategory, FleetStatus } from '@prisma/client';

@Injectable()
export class FleetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    slug: string;
    name: string;
    description?: string;
    category: FleetCategory;
    passengerCapacity: number;
    perKmRate: number;
    accessible?: boolean;
    status?: FleetStatus;
  }) {
    const existing = await this.prisma.fleet.findUnique({ where: { slug: data.slug } });
    if (existing) throw new BadRequestException('A fleet with this slug already exists');

    return this.prisma.fleet.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description ?? null,
        category: data.category,
        passengerCapacity: Number(data.passengerCapacity),
        perKmRate: Number(data.perKmRate),
        accessible: data.accessible ?? false,
        status: data.status ?? FleetStatus.ACTIVE,
      },
    });
  }

  async findAll(activeOnly = false) {
    return this.prisma.fleet.findMany({
      where: activeOnly ? { status: FleetStatus.ACTIVE } : undefined,
      include: { _count: { select: { drivers: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const fleet = await this.prisma.fleet.findUnique({ where: { id } });
    if (!fleet) throw new NotFoundException('Fleet not found');
    return fleet;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      category: FleetCategory;
      passengerCapacity: number;
      perKmRate: number;
      accessible: boolean;
    }>,
  ) {
    const fleet = await this.prisma.fleet.findUnique({ where: { id } });
    if (!fleet) throw new NotFoundException('Fleet not found');

    return this.prisma.fleet.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.passengerCapacity !== undefined && { passengerCapacity: Number(data.passengerCapacity) }),
        ...(data.perKmRate !== undefined && { perKmRate: Number(data.perKmRate) }),
        ...(data.accessible !== undefined && { accessible: data.accessible }),
      },
    });
  }

  async setStatus(id: string, status: FleetStatus) {
    const fleet = await this.prisma.fleet.findUnique({ where: { id } });
    if (!fleet) throw new NotFoundException('Fleet not found');
    await this.prisma.fleet.update({ where: { id }, data: { status } });
    return { message: `Fleet ${status.toLowerCase()} successfully` };
  }

  async remove(id: string) {
    const fleet = await this.prisma.fleet.findUnique({ where: { id } });
    if (!fleet) throw new NotFoundException('Fleet not found');

    try {
      await this.prisma.fleet.delete({ where: { id } });
    } catch {
      throw new BadRequestException(
        'This fleet still has drivers or trips linked to it. Deactivate it instead of deleting it.',
      );
    }
    return { message: 'Fleet deleted successfully' };
  }
}
