import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  root() {
    return { message: 'Kramnik Shop API' };
  }

  @Get('health')
  async health() {
    const productCount = await this.prisma.product.count();
    return { status: 'ok', productCount };
  }
}
