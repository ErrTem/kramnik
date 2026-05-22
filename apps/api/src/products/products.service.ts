import { Injectable, NotFoundException } from '@nestjs/common'
import { toProductPublic, type ProductPublic } from '@kramnik/types'
import { ListProductsQueryDto } from './dto/list-products-query.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(_query: ListProductsQueryDto): Promise<ProductPublic[]> {
    const rows = await this.prisma.product.findMany({
      orderBy: { name: 'asc' },
    })
    return rows.map(toProductPublic)
  }

  async findOne(id: string): Promise<ProductPublic> {
    const row = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!row) {
      throw new NotFoundException(`Product ${id} not found`)
    }
    return toProductPublic(row)
  }
}