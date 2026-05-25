import { Injectable, NotFoundException } from '@nestjs/common'
import { toProductPublic, type ProductPublic } from '@kramnik/types'
import { ListProductsQueryDto } from './dto/list-products-query.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListProductsQueryDto): Promise<ProductPublic[]> {
    const where: Prisma.ProductWhereInput = {}
    if (query.category) {
      where.category = query.category
    }
    const search = query.q?.trim()
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    const priceFilter: Prisma.DecimalFilter = {}
    if (query.minPrice) {
      priceFilter.gte = new Prisma.Decimal(query.minPrice)
    }
    if (query.maxPrice) {
      priceFilter.lte = new Prisma.Decimal(query.maxPrice)
    }
    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter
    }
    const rows = await this.prisma.product.findMany({
      where,
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